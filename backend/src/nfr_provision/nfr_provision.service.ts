import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository, UpdateResult } from "typeorm";
import { CreateNFRProvisionDto } from "./dto/create-nfr_provision.dto";
import { NFRProvision } from "./entities/nfr_provision.entity";
import { UpdateNFRProvisionDto } from "./dto/update-nfr_provision.dto";

@Injectable()
export class NFRProvisionService {
  constructor(
    @InjectRepository(NFRProvision)
    private nfrProvisionRepository: Repository<NFRProvision>
  ) {}

  async create(nfrProvision: CreateNFRProvisionDto): Promise<NFRProvision> {
    nfrProvision.provision_group = Math.floor(nfrProvision.provision_group);
    nfrProvision.max = Math.floor(nfrProvision.max);
    const newProvision = this.nfrProvisionRepository.create(nfrProvision);
    await this.updateGroupMaximums(
      nfrProvision.provision_group,
      nfrProvision.max
    );
    return this.nfrProvisionRepository.save(newProvision);
  }

  async update(
    id: number,
    nfrProvision: UpdateNFRProvisionDto
  ): Promise<UpdateResult> {
    nfrProvision.provision_group = Math.floor(nfrProvision.provision_group);
    nfrProvision.max = Math.floor(nfrProvision.max);
    const updatedProvision = this.nfrProvisionRepository.create(nfrProvision);
    await this.updateGroupMaximums(
      nfrProvision.provision_group,
      nfrProvision.max
    );
    return this.nfrProvisionRepository.update(id, updatedProvision);
  }

  async findAll(): Promise<NFRProvision[]> {
    return await this.nfrProvisionRepository.find();
  }

  async findById(provisionId: number): Promise<NFRProvision> {
    try {
      return this.nfrProvisionRepository.findOneBy({
        id: provisionId,
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async findByDtid(dtid: number): Promise<NFRProvision[]> {
    try {
      return dtid != null
        ? this.nfrProvisionRepository.find({
            where: {
              dtid: dtid,
            },
          })
        : null;
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
    const provisionToSelect = await this.nfrProvisionRepository.findOneBy({
      id: id,
    });
    const numberSelectedSameGroup =
      await this.nfrProvisionRepository.findAndCountBy({
        provision_group: provisionToSelect.provision_group,
        select: true,
      })[1];
    if (numberSelectedSameGroup >= provisionToSelect.max) {
      return { message: "Provision group is already at maximum." };
    } else {
      await this.nfrProvisionRepository.update(id, {
        select: true,
      });
      return { message: "Provision Selected" };
    }
  }

  async deselect(id: number): Promise<any> {
    await this.nfrProvisionRepository.update(id, {
      select: false,
    });
    return { message: "Provision Deselected" };
  }

  async getGroupMax(): Promise<any> {
    const provisions = await this.nfrProvisionRepository.find({
      select: ["provision_group", "max", "provision_group_text"],
    });
    const result = provisions.map(
      ({ provision_group, max, provision_group_text }) => ({
        provision_group,
        max,
        provision_group_text,
      })
    );
    const uniqueResult = result
      .filter(
        (value, index, self) =>
          self.findIndex(
            (item) => item.provision_group === value.provision_group
          ) === index
      )
      .sort((a, b) => a.provision_group - b.provision_group);
    return uniqueResult;
  }

  async getGroupMaxByDTID(dtid: number): Promise<any> {
    const provisions = await this.nfrProvisionRepository.find({
      select: ["provision_group", "max", "provision_group_text"],
      where: { dtid: dtid },
    });
    const result = provisions.map(
      ({ provision_group, max, provision_group_text }) => ({
        provision_group,
        max,
        provision_group_text,
      })
    );
    const uniqueResult = result.filter(
      (value, index, self) =>
        self.findIndex(
          (item) => item.provision_group === value.provision_group
        ) === index
    );
    return uniqueResult;
  }

  async remove(dtid: number): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.nfrProvisionRepository.delete({ dtid: dtid });
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }

  async updateGroupMaximums(provision_group: number, max: number) {
    const sameGroupProvisions = await this.nfrProvisionRepository.findBy({
      provision_group: provision_group,
    });
    if (sameGroupProvisions.length > 0 && sameGroupProvisions[0].max != max) {
      const idList = sameGroupProvisions.map((obj) => obj.id);
      await this.nfrProvisionRepository.update(
        {
          id: In(idList),
        },
        { max: max, active_flag: false }
      );
    }
  }
}
