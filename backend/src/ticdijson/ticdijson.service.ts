import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TenantAddr } from "../tenantAddr/entities/tenantAddr.entity";
import { Repository } from "typeorm";
import { CreateTicdijsonDto } from "./dto/create-ticdijson.dto";
import { Ticdijson } from "./entities/ticdijson.entity";

@Injectable()
export class TicdijsonService {
  constructor(
    @InjectRepository(Ticdijson)
    private ticdijsonRepository: Repository<Ticdijson>
  ) {}

  async create(
    ticdiJson: CreateTicdijsonDto,
    tenantAddr: TenantAddr
  ): Promise<Ticdijson> {
    const newItem = new Ticdijson();
    newItem.airPhotoNum = ticdiJson.airPhotoNum;
    newItem.area = ticdiJson.area;
    newItem.bcgsSheet = ticdiJson.bcgsSheet;
    newItem.complexLevel = ticdiJson.complexLevel;
    newItem.dtid = ticdiJson.dtid;
    newItem.fileNum = ticdiJson.fileNum;
    newItem.legalDesc = ticdiJson.legalDesc;
    newItem.locLand = ticdiJson.locLand;
    newItem.orgUnit = ticdiJson.orgUnit;
    newItem.purpose = ticdiJson.purpose;
    newItem.subPurpose = ticdiJson.subPurpose;
    newItem.subType = ticdiJson.subType;
    newItem.type = ticdiJson.type;
    newItem.tenantAddr = tenantAddr;
    const existingTicdi = await this.ticdijsonRepository.findBy({
      dtid: ticdiJson.dtid,
    });
    if (!existingTicdi) {
      newItem.version = 1;
      const newTicdi = this.ticdijsonRepository.create(newItem);
      return this.ticdijsonRepository.save(newTicdi);
    } else {
      let currentVersion = 0;
      for (let item of existingTicdi) {
        if (item.version > currentVersion) {
          currentVersion = item.version;
        }
      }
      newItem.version = currentVersion + 1;
      const newTicdi = this.ticdijsonRepository.create(newItem);
      return this.ticdijsonRepository.save(newTicdi);
    }
  }

  async findAll(): Promise<Ticdijson[]> {
    return this.ticdijsonRepository.find({
      relations: ["tenantAddr"],
    });
  }

  async findByDtid(dtid: number): Promise<Ticdijson[]> {
    return this.ticdijsonRepository.find({
      where: {
        dtid: dtid,
      },
      relations: ["tenantAddr"],
    });
  }

  async remove(dtid: number): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.ticdijsonRepository.delete({ dtid: dtid });
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
