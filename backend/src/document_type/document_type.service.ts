import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DocumentType } from './entities/document_type.entity';

@Injectable()
export class DocumentTypeService {
  constructor(
    @InjectRepository(DocumentType)
    private documentTypeRepository: Repository<DocumentType>
  ) {}

  findById(id: number): Promise<DocumentType> {
    console.log('findById function');
    return this.documentTypeRepository.findOneBy({ id: id });
  }

  findByIds(ids: number[]): Promise<DocumentType[]> {
    return this.documentTypeRepository.findBy({ id: In(ids) });
  }

  findAll(): Promise<DocumentType[]> {
    return this.documentTypeRepository.find();
  }
}
