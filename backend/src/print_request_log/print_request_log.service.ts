import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePrintRequestLogDto } from "./dto/create-print_request_log.dto";
import { PrintRequestLog } from "./entities/print_request_log.entity";

@Injectable()
export class PrintRequestLogService {
  constructor(
    @InjectRepository(PrintRequestLog)
    private printRequestLogRepository: Repository<PrintRequestLog>
  ) {}

  async create(
    printRequestLog: CreatePrintRequestLogDto
  ): Promise<PrintRequestLog> {
    const newItem = new PrintRequestLog();
    newItem.document_template_id = printRequestLog.document_template_id;
    newItem.print_request_detail_id = printRequestLog.print_request_detail_id;
    newItem.dtid = printRequestLog.dtid;
    newItem.request_app_user = printRequestLog.request_app_user;
    newItem.request_json = printRequestLog.request_json;
    newItem.create_userid = printRequestLog.request_app_user; // same as request_app_user
    const newPRL = this.printRequestLogRepository.create(newItem);
    return this.printRequestLogRepository.save(newPRL);
  }

  async findAll(): Promise<PrintRequestLog[]> {
    return this.printRequestLogRepository.find();
  }

  async findByDtid(dtid: number): Promise<PrintRequestLog[]> {
    return this.printRequestLogRepository.find({
      where: {
        document_template_id: dtid,
      },
    });
  }

  async findNextVersion(dtid: number): Promise<string> {
    const requestLogs = await this.printRequestLogRepository.findAndCount({
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
