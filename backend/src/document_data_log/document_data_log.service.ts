import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentDataLog } from './entities/document_data_log.entity';
import { CreateDocumentDataLogDto } from './dto/create-document_data_log.dto';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentDataLogService {
  constructor(
    @InjectRepository(DocumentDataLog)
    private documentDataLogRepository: Repository<DocumentDataLog>
  ) {}

  async create(documentDataLog: CreateDocumentDataLogDto): Promise<DocumentDataLog> {
    const newItem = new DocumentDataLog();
    newItem.document_template_id = documentDataLog.document_template_id;
    newItem.document_data_id = documentDataLog.document_data_id;
    newItem.document_type_id = documentDataLog.document_type_id;
    newItem.dtid = documentDataLog.dtid;
    newItem.request_app_user = documentDataLog.request_app_user;
    newItem.request_json = documentDataLog.request_json;
    newItem.create_userid = documentDataLog.request_app_user; // same as request_app_user
    const newPRL = this.documentDataLogRepository.create(newItem);
    return this.documentDataLogRepository.save(newPRL);
  }

  async findAll(): Promise<DocumentDataLog[]> {
    return this.documentDataLogRepository.find();
  }

  async findByDtid(dtid: number): Promise<DocumentDataLog[]> {
    return this.documentDataLogRepository.find({
      where: {
        dtid: dtid,
      },
    });
  }

  async findNextVersion(dtid: number, document_type_id: number): Promise<string> {
    const requestLogs = await this.documentDataLogRepository.findAndCount({
      where: {
        dtid: dtid,
        document_type_id: document_type_id,
      },
    });
    let version = (requestLogs[1] + 1).toString();
    // prepend zeroes to the version before returning
    while (version.length < 4) {
      version = '0' + version;
    }
    return version;
  }
}
