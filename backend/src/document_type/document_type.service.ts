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

  add(name: string, created_by: string, created_date: string, userid: string): Promise<DocumentType> {
    const newDocumentType = this.documentTypeRepository.create({
      name: name,
      created_by: created_by,
      created_date: created_date,
      create_userid: userid,
      update_userid: userid,
    });
    return this.documentTypeRepository.save(newDocumentType);
  }

  async update(
    id: number,
    name: string,
    created_by: string,
    created_date: string,
    userid: string
  ): Promise<DocumentType> {
    await this.documentTypeRepository.update(id, { name, created_by, created_date, update_userid: userid });
    const updatedDocumentType = await this.documentTypeRepository.findOneBy({ id });
    if (!updatedDocumentType) {
      throw new Error('DocumentType not found');
    }
    return updatedDocumentType;
  }

  async remove(id: number): Promise<void> {
    const result = await this.documentTypeRepository.delete(id);

    if (result.affected === 0) {
      throw new Error(`DocumentType with ID ${id} not found`);
    }
  }
}
