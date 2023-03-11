import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { CreateNFRProvisionDto } from "./dto/create-nfr_provision.dto";
import { NFRProvision } from "./entities/nfr_provision.entity";
import { UpdateNFRProvisionDto } from "./dto/update-nfr_provision.dto";
import { NFRProvisionGroup } from "./entities/nfr_provision_group.entity";

@Injectable()
export class NFRProvisionService {
  constructor(
    @InjectRepository(NFRProvision)
    private nfrProvisionRepository: Repository<NFRProvision>,
    @InjectRepository(NFRProvisionGroup)
    private nfrProvisionGroupRepository: Repository<NFRProvisionGroup>
  ) {}

  async create(nfrProvision: CreateNFRProvisionDto): Promise<NFRProvision> {
    const provision_group = Math.floor(nfrProvision.provision_group);
    const provision_group_text = nfrProvision.provision_group_text;
    delete nfrProvision["provision_group"];
    delete nfrProvision["provision_group_text"];
    nfrProvision.max = Math.floor(nfrProvision.max);
    console.log(nfrProvision);
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

  async findByDtid(dtid: number): Promise<NFRProvision[]> {
    try {
      const nfrProvisions =
        dtid != null
          ? await this.nfrProvisionRepository.find({
              where: {
                dtid: dtid,
                active_flag: true,
              },
              relations: ["provision_group"],
            })
          : null;
      nfrProvisions.forEach((nfrProvision) => {
        delete nfrProvision.provision_group["id"];
      });
      return nfrProvisions.map((nfrProvision) =>
        Object.assign(nfrProvision, nfrProvision.provision_group)
      );
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

  async select(id: number): Promise<any> {
    const nfrProvision = await this.nfrProvisionRepository.findOne({
      where: { id: id },
      relations: ["provision_group"],
    });
    if (!nfrProvision) {
      throw new Error(`NFRProvision with ID ${id} not found`);
    }
    const nfrProvisionGroup = nfrProvision.provision_group;
    if (!nfrProvisionGroup) {
      throw new Error(
        `NFRProvision with ID ${id} has no associated NFRProvisionGroup`
      );
    }
    const selectedCount = await this.nfrProvisionRepository.count({
      where: { provision_group: nfrProvisionGroup, select: true },
    });

    if (selectedCount < nfrProvisionGroup.max) {
      nfrProvision.select = true;
      await this.nfrProvisionRepository.save(nfrProvision);
      return { message: "Provision Selected" };
    } else {
      return { message: "Provision group is already at maximum." };
    }
  }

  async deselect(id: number): Promise<any> {
    await this.nfrProvisionRepository.update(id, {
      select: false,
    });
    return { message: "Provision Deselected" };
  }

  async getGroupMax(): Promise<any> {
    const nfrProvisions = await this.nfrProvisionRepository.find({
      relations: ["provision_group"],
    });
    const nfrProvisionGroups = new Set<NFRProvisionGroup>();
    nfrProvisions.forEach((nfrProvision) => {
      nfrProvisionGroups.add(nfrProvision.provision_group);
    });
    return Array.from(nfrProvisionGroups).sort(
      (a, b) => a.provision_group - b.provision_group
    );
  }

  async getGroupMaxByDTID(dtid: number): Promise<any> {
    const nfrProvisions = await this.nfrProvisionRepository.find({
      where: { dtid: dtid },
      relations: ["provision_group"],
    });
    const nfrProvisionGroups = new Set<NFRProvisionGroup>();
    nfrProvisions.forEach((nfrProvision) => {
      nfrProvisionGroups.add(nfrProvision.provision_group);
    });
    const sortedNfrProvisionGroups = Array.from(nfrProvisionGroups).sort(
      (a, b) => a.provision_group - b.provision_group
    );
    return sortedNfrProvisionGroups;
  }

  async remove(dtid: number): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.nfrProvisionRepository.delete({ dtid: dtid });
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
    let nfrProvisionGroup = await this.nfrProvisionGroupRepository.findOneBy({
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
      await this.nfrProvisionGroupRepository.update(nfrProvisionGroup, {
        max: max,
        provision_group_text: provision_group_text,
      });
      await this.nfrProvisionRepository.update(
        { provision_group: nfrProvisionGroup },
        { select: false }
      );
    }
  }
}
