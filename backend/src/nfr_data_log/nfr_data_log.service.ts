import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateNFRDataLogDto } from "./dto/create-nfr_data_log.dto";
import { NFRDataLog } from "./entities/nfr_data_log.entity";

@Injectable()
export class NFRDataLogService {
  constructor(
    @InjectRepository(NFRDataLog)
    private nfrDataLogRepository: Repository<NFRDataLog>
  ) {}

  async create(nfrDataLog: CreateNFRDataLogDto): Promise<NFRDataLog> {
    const newItem = new NFRDataLog();
    newItem.document_template_id = nfrDataLog.document_template_id;
    newItem.nfr_data_id = nfrDataLog.nfr_data_id;
    newItem.dtid = nfrDataLog.dtid;
    newItem.request_app_user = nfrDataLog.request_app_user;
    newItem.request_json = nfrDataLog.request_json;
    newItem.create_userid = nfrDataLog.request_app_user; // same as request_app_user
    const newPRL = this.nfrDataLogRepository.create(newItem);
    return this.nfrDataLogRepository.save(newPRL);
  }

  async findAll(): Promise<NFRDataLog[]> {
    return this.nfrDataLogRepository.find();
  }

  async findByDtid(dtid: number): Promise<NFRDataLog[]> {
    return this.nfrDataLogRepository.find({
      where: {
        document_template_id: dtid,
      },
    });
  }

  async findNextVersion(dtid: number): Promise<string> {
    const requestLogs = await this.nfrDataLogRepository.findAndCount({
      where: {
        dtid: dtid,
      },
    });
    let version = (requestLogs[1] + 1).toString();
    // prepend zeroes to the version before returning
    while (version.length < 4) {
      version = "0" + version;
    }
    return version;
  }
}
