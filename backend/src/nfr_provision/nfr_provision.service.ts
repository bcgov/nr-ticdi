import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository, UpdateResult } from "typeorm";
import { CreateNFRProvisionDto } from "./dto/create-nfr_provision.dto";
import { NFRProvision } from "./entities/nfr_provision.entity";
import { UpdateNFRProvisionDto } from "./dto/update-nfr_provision.dto";
import { NFRProvisionGroup } from "./entities/nfr_provision_group.entity";
import { NFRProvisionVariant } from "./entities/nfr_provision_variant.entity";
import { NFRProvisionVariable } from "./entities/nfr_provision_variable.entity";

@Injectable()
export class NFRProvisionService {
  constructor(
    @InjectRepository(NFRProvision)
    private nfrProvisionRepository: Repository<NFRProvision>,
    @InjectRepository(NFRProvisionGroup)
    private nfrProvisionGroupRepository: Repository<NFRProvisionGroup>,
    @InjectRepository(NFRProvisionVariant)
    private nfrProvisionVariantRepository: Repository<NFRProvisionVariant>,
    @InjectRepository(NFRProvisionVariable)
    private nfrProvisionVariableRepository: Repository<NFRProvisionVariable>
  ) {}

  async create(nfrProvision: CreateNFRProvisionDto): Promise<NFRProvision> {
    const provision_group = Math.floor(nfrProvision.provision_group);
    const provision_group_text = nfrProvision.provision_group_text;
    delete nfrProvision["provision_group"];
    delete nfrProvision["provision_group_text"];
    nfrProvision.max = Math.floor(nfrProvision.max);
    await this.updateGroupMaximums(
      provision_group,
      nfrProvision.max,
      provision_group_text
    );
    if (
      (await this.nfrProvisionGroupRepository.countBy({ provision_group })) == 0
    ) {
      const newProvisionGroup = this.nfrProvisionGroupRepository.create({
        provision_group,
        provision_group_text,
      });
      await this.nfrProvisionGroupRepository.save(newProvisionGroup);
    }
    const nfrProvisionGroup = await this.nfrProvisionGroupRepository.findOneBy({
      provision_group,
    });
    const newProvision = this.nfrProvisionRepository.create({
      ...nfrProvision,
      provision_group: nfrProvisionGroup,
    });
    return this.nfrProvisionRepository.save(newProvision);
  }

  async update(
    id: number,
    nfrProvision: UpdateNFRProvisionDto
  ): Promise<UpdateResult> {
    const provision_group = Math.floor(nfrProvision.provision_group);
    const provision_group_text = nfrProvision.provision_group_text;
    delete nfrProvision["provision_group"];
    delete nfrProvision["provision_group_text"];
    nfrProvision.max = Math.floor(nfrProvision.max);
    await this.updateGroupMaximums(
      provision_group,
      nfrProvision.max,
      provision_group_text
    );
    const nfrProvisionGroup = await this.nfrProvisionGroupRepository.findOneBy({
      provision_group,
    });
    const updatedProvision = this.nfrProvisionRepository.create({
      ...nfrProvision,
      provision_group: nfrProvisionGroup,
    });
    return this.nfrProvisionRepository.update(id, updatedProvision);
  }

  async findAll(): Promise<NFRProvision[]> {
    const nfrProvisions = await this.nfrProvisionRepository.find({
      relations: ["provision_group"],
    });
    nfrProvisions.forEach((nfrProvision) => {
      delete nfrProvision.provision_group["id"];
    });
    return nfrProvisions.map((nfrProvision) =>
      Object.assign(nfrProvision, nfrProvision.provision_group)
    );
  }

  async findById(provisionId: number): Promise<NFRProvision> {
    try {
      return this.nfrProvisionRepository.findOne({
        where: { id: provisionId },
        relations: ["provision_group"],
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async getProvisionsByVariant(variantName: string): Promise<NFRProvision[]> {
    try {
      const variant = await this.nfrProvisionVariantRepository.findOne({
        where: {
          variant_name: variantName,
        },
      });
      if (!variant) {
        return [];
      }
      const provisions: NFRProvision[] = await this.nfrProvisionRepository.find(
        {
          where: { provision_variant: variant },
          relations: ["provision_group"],
        }
      );
      return provisions;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async enable(id: number): Promise<any> {
    await this.nfrProvisionRepository.update(id, {
      active_flag: true,
    });
    return { message: "Provision Enabled" };
  }

  async disable(id: number): Promise<any> {
    await this.nfrProvisionRepository.update(id, {
      active_flag: false,
    });
    return { message: "Provision Disabled" };
  }

  async getGroupMax(): Promise<any> {
    const nfrProvisions = await this.nfrProvisionRepository.find({
      relations: ["provision_group"],
    });
    let nfrProvisionGroups: NFRProvisionGroup[] = [];
    nfrProvisions.forEach((nfrProvision) => {
      nfrProvisionGroups.push(nfrProvision.provision_group);
    });
    nfrProvisionGroups = this.removeDuplicates(
      nfrProvisionGroups,
      "provision_group"
    );
    return Array.from(nfrProvisionGroups).sort(
      (a, b) => a.provision_group - b.provision_group
    );
  }

  async getGroupMaxByVariant(variantName: string): Promise<any> {
    try {
      const variant = await this.nfrProvisionVariantRepository.findOne({
        where: {
          variant_name: variantName,
        },
      });
      if (!variant) {
        return [];
      }
      const provisions = await this.nfrProvisionRepository.find({
        where: { provision_variant: variant },
        relations: ["provision_group"],
      });
      let nfrProvisionGroups: NFRProvisionGroup[] = [];
      provisions.forEach((nfrProvision) => {
        nfrProvisionGroups.push(nfrProvision.provision_group);
      });
      nfrProvisionGroups = this.removeDuplicates(
        nfrProvisionGroups,
        "provision_group"
      );
      return Array.from(nfrProvisionGroups).sort(
        (a, b) => a.provision_group - b.provision_group
      );
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async getVariablesByVariant(variantName: string): Promise<any> {
    const variant = await this.nfrProvisionVariantRepository.findOne({
      where: {
        variant_name: variantName,
      },
    });
    if (!variant) {
      return [];
    }
    const provisions = await this.nfrProvisionRepository.find({
      where: { provision_variant: variant },
      relations: ["provision_variables"],
    });

    const provisionVariables: NFRProvisionVariable[] = [];
    provisions.forEach((provision) => {
      provision.provision_variables.forEach((variable) => {
        variable["provisionId"] = provision.id;
        provisionVariables.push(variable);
      });
    });
    return provisionVariables;
  }

  async getMandatoryProvisionsByVariant(
    variantName: string
  ): Promise<number[]> {
    const variant = await this.nfrProvisionVariantRepository.findOne({
      where: {
        variant_name: variantName,
      },
    });
    if (!variant) {
      return [];
    }
    const provisions = await this.nfrProvisionRepository.find({
      where: { provision_variant: variant, mandatory: true },
    });
    return provisions.map((provision) => provision.id);
  }

  async remove(id: number): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.nfrProvisionRepository.delete(id);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }

  async updateGroupMaximums(
    provision_group: number,
    max: number,
    provision_group_text: string
  ) {
    let nfrProvisionGroup: NFRProvisionGroup =
      await this.nfrProvisionGroupRepository.findOneBy({
        provision_group: provision_group,
      });
    if (!nfrProvisionGroup) {
      const newGroup = this.nfrProvisionGroupRepository.create({
        provision_group: provision_group,
        max: max,
        provision_group_text: provision_group_text,
      });
      nfrProvisionGroup = await this.nfrProvisionGroupRepository.save(newGroup);
    }
    if (
      nfrProvisionGroup.max != max ||
      nfrProvisionGroup.provision_group_text != provision_group_text
    ) {
      await this.nfrProvisionGroupRepository.update(nfrProvisionGroup.id, {
        max: max,
        provision_group_text: provision_group_text,
      });
    }
  }

  removeDuplicates<T>(array: T[], property: keyof T): T[] {
    return array.reduce<T[]>((accumulator, currentObject) => {
      const existingObject = accumulator.find(
        (obj) => obj[property] === currentObject[property]
      );
      if (!existingObject) {
        accumulator.push(currentObject);
      }
      return accumulator;
    }, []);
  }
}
