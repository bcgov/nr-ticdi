import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NFRProvision } from "src/nfr_provision/entities/nfr_provision.entity";
import { NFRProvisionVariant } from "src/nfr_provision/entities/nfr_provision_variant.entity";
import { DataSource, Repository } from "typeorm";
import { CreateNFRDataDto } from "./dto/create-nfr_data.dto";
import { NFRData } from "./entities/nfr_data.entity";
import { NFRDataView } from "./entities/nfr_data_vw";

@Injectable()
export class NFRDataService {
  constructor(
    @InjectRepository(NFRData)
    private nfrDataRepository: Repository<NFRData>,
    @InjectRepository(NFRProvision)
    private nfrProvisionRepository: Repository<NFRProvision>,
    @InjectRepository(NFRProvisionVariant)
    private nfrProvisionVariantRepository: Repository<NFRProvisionVariant>,
    private dataSource: DataSource
  ) {}

  async create(dto: CreateNFRDataDto): Promise<NFRData> {
    const variant: NFRProvisionVariant =
      await this.nfrProvisionVariantRepository.findOne({
        where: { variant_name: dto.variant_name },
      });
    if (!variant) {
      throw new Error(
        `Could not find NFRProvisionVariant with variant_name '${dto.variant_name}'`
      );
    }
    const provisions = await this.nfrProvisionRepository.find({
      where: { provision_variant: variant },
    });
    if (!provisions.length) {
      throw new Error(
        `Could not find any NFRProvisions associated with NFRProvisionVariant '${dto.variant_name}'`
      );
    }
    const nfrData = this.nfrDataRepository.create({ ...dto });
    return this.nfrDataRepository.save(nfrData);
  }

  async findAll(): Promise<NFRData[]> {
    return await this.nfrDataRepository.find();
  }

  async findByNfrDataId(nfrDataId: number): Promise<NFRData> {
    try {
      return this.nfrDataRepository.findOneBy({
        id: nfrDataId,
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async findByDtid(dtid: number): Promise<NFRData[]> {
    try {
      return dtid != null
        ? this.nfrDataRepository.find({
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

  async findViewByNFRDataId(nfrDataId: number): Promise<NFRDataView> {
    return this.dataSource.manager.findOneBy(NFRDataView, {
      NFRDataId: nfrDataId,
    });
  }

  async getEnabledProvisions(id: number): Promise<number[]> {
    const nfrData = await this.nfrDataRepository.findOneBy({ id: id });
    return nfrData.enabled_provisions;
  }

  async remove(dtid: number): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.nfrDataRepository.delete({ dtid: dtid });
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
