import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateNFRProvisionDto } from "./dto/create-nfr_provision.dto";
import { NFRProvision } from "./entities/nfr_provision.entity";

@Injectable()
export class NFRProvisionService {
  constructor(
    @InjectRepository(NFRProvision)
    private nfrProvisionRepository: Repository<NFRProvision>
  ) {}

  async create(nfrProvision: CreateNFRProvisionDto): Promise<NFRProvision> {
    return this.nfrProvisionRepository.create(nfrProvision);
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

  async remove(dtid: number): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.nfrProvisionRepository.delete({ dtid: dtid });
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
