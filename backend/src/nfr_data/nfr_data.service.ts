import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreateNFRDataDto } from "./dto/create-nfr_data.dto";
import { NFRData } from "./entities/nfr_data.entity";
import { NFRDataView } from "./entities/nfr_data_vw";

@Injectable()
export class NFRDataService {
  constructor(
    @InjectRepository(NFRData)
    private nfrDataRepository: Repository<NFRData>,
    private dataSource: DataSource
  ) {}

  async create(nfrData: CreateNFRDataDto): Promise<NFRData> {
    return this.nfrDataRepository.create(nfrData);
  }

  async findAll(): Promise<NFRData[]> {
    return await this.nfrDataRepository.find();
  }

  async findByDtid(dtid: number): Promise<NFRData[]> {
    try {
      return this.nfrDataRepository.find({
        where: {
          dtid: dtid,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async findViewByNFRDataId(nfrDataId: number): Promise<NFRDataView> {
    return this.dataSource.manager.findOneBy(NFRDataView, {
      NFRDataId: nfrDataId,
    });
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
