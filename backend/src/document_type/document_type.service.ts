import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentType } from './entities/document_type.entity';

@Injectable()
export class DocumentTypeService {
  constructor(
    @InjectRepository(DocumentType)
    private documentTypeRepository: Repository<DocumentType>
  ) {}
  findById(id: number): Promise<DocumentType> {
    return this.documentTypeRepository.findOneByOrFail({ id: id });
  }

  findAll(): Promise<DocumentType[]> {
    return this.documentTypeRepository.find();
  }
}
