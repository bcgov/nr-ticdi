import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NFRProvision } from "src/nfr_provision/entities/nfr_provision.entity";
import { NFRProvisionVariant } from "src/nfr_provision/entities/nfr_provision_variant.entity";
import { DataSource, Repository } from "typeorm";
import { CreateNFRDataDto } from "./dto/create-nfr_data.dto";
import { NFRData } from "./entities/nfr_data.entity";
import { NFRDataProvision } from "./entities/nfr_data_provision.entity";
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

  async create(
    dto: CreateNFRDataDto & { enabled_provisions: number[] }
  ): Promise<NFRData> {
    const enabledProvisions = dto.enabled_provisions;
    delete dto["enabled_provisions"];
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
    const nfrDataProvisions = provisions.map((provision) => {
      const nfrDataProvision = new NFRDataProvision();
      nfrDataProvision.nfr_data = nfrData;
      nfrDataProvision.nfr_provision = provision;
      nfrDataProvision.enabled = enabledProvisions.includes(provision.id);
      return nfrDataProvision;
    });
    nfrData.nfr_data_provisions = nfrDataProvisions;
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

  // async select(nfrDataId: number, provisionId: number): Promise<any> {
  //   const nfrData = await this.nfrDataRepository.findOne({
  //     where: { id: nfrDataId },
  //     relations: ["nfr_data_provisions"],
  //   });
  //   if (!nfrData) {
  //     throw new Error(`NFRData with ID ${nfrDataId} not found`);
  //   }
  //   let provisionGroup: NFRProvisionGroup;
  //   if (!nfrData.nfr_data_provisions) {
  //     throw new Error(`Provisions for NFRData with ID ${nfrDataId} not found.`);
  //   }
  //   const provisionIndex = nfrData.nfr_data_provisions.findIndex(
  //     (prov) => prov.nfr_provision.id === provisionId
  //   );
  //   if (provisionIndex === -1) {
  //     throw new Error(
  //       `NFRDataProvision with provision id ${provisionId} not found`
  //     );
  //   }
  //   const enabledProvisions = nfrData.nfr_data_provisions.filter(
  //     (prov) => prov.enabled
  //   );

  //   if (enabledProvisions.length < provisionGroup.max) {
  //     nfrData.nfr_data_provisions[provisionIndex].enabled = true;
  //     await this.nfrDataRepository.save(nfrData);
  //     return { message: "Provision Selected" };
  //   } else {
  //     return { message: "Provision group is already at maximum." };
  //   }
  // }

  // async deselect(nfrDataId: number, provisionId: number): Promise<any> {
  //   const nfrData = await this.nfrDataRepository.findOne({
  //     where: { id: nfrDataId },
  //     relations: ["nfr_data_provisions"],
  //   });
  //   if (!nfrData) {
  //     throw new Error(`NFRData with id ${nfrDataId} not found`);
  //   }
  //   const provisionIndex = nfrData.nfr_data_provisions.findIndex(
  //     (prov) => prov.nfr_provision.id === provisionId
  //   );
  //   if (provisionIndex === -1) {
  //     throw new Error(
  //       `NFRDataProvision with provision id ${provisionId} not found`
  //     );
  //   }
  //   const provision = nfrData.nfr_data_provisions[provisionIndex];
  //   provision.enabled = false;
  //   await this.nfrDataRepository.save(nfrData);
  //   return { message: "Provision Deselected" };
  // }

  async remove(dtid: number): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.nfrDataRepository.delete({ dtid: dtid });
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
