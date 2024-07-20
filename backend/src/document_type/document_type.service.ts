import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DocumentType } from './entities/document_type.entity';
import { ProvisionGroup } from './entities/provision_group.entity';

@Injectable()
export class DocumentTypeService {
  constructor(
    @InjectRepository(DocumentType)
    private documentTypeRepository: Repository<DocumentType>,
    @InjectRepository(ProvisionGroup)
    private provisionGroupRepository: Repository<ProvisionGroup>
  ) {}

  async findById(id: number): Promise<DocumentType | undefined> {
    try {
      return this.documentTypeRepository.findOne({
        where: { id: id },
        relations: { document_type_provisions: true },
      });
    } catch (error) {
      console.error('Error fetching DocumentType:', error);
      throw error;
    }
  }

  findByIds(ids: number[]): Promise<DocumentType[]> {
    return this.documentTypeRepository.findBy({ id: In(ids) });
  }

  findAll(): Promise<DocumentType[]> {
    return this.documentTypeRepository.find();
  }

  add(name: string, prefix: string, created_by: string, created_date: string, userid: string): Promise<DocumentType> {
    const newDocumentType = this.documentTypeRepository.create({
      name: name,
      prefix: prefix,
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
    prefix: string,
    created_by: string,
    created_date: string,
    userid: string
  ): Promise<DocumentType> {
    await this.documentTypeRepository.update(id, { name, prefix, created_by, created_date, update_userid: userid });
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

  save(docType: DocumentType) {
    return this.documentTypeRepository.save(docType);
  }

  async getGroupMax(): Promise<any> {
    const provisionGroups = await this.provisionGroupRepository.find({
      relations: ['document_type'],
    });
    return provisionGroups.sort((a, b) => a.provision_group - b.provision_group);
  }

  async getGroupMaxByDocTypeId(document_type_id: number): Promise<any> {
    const provisionGroups = await this.provisionGroupRepository.find({
      where: { document_type: { id: document_type_id } },
    });
    return Array.from(provisionGroups).sort((a, b) => a.provision_group - b.provision_group);
  }

  async addProvisionGroup(
    provision_group: number,
    provision_group_text: string,
    max: number,
    document_type_id: number
  ): Promise<any> {
    const newProvisionGroup = new ProvisionGroup();
    newProvisionGroup.provision_group = provision_group;
    newProvisionGroup.provision_group_text = provision_group_text;
    newProvisionGroup.max = max;
    newProvisionGroup.document_type = await this.documentTypeRepository.findOne({ where: { id: document_type_id } });
    await this.provisionGroupRepository.save(newProvisionGroup);
  }

  async updateProvisionGroups(document_type_id: number, provision_groups: ProvisionGroup[]): Promise<any> {
    const existingProvisionGroups = await this.provisionGroupRepository.find({
      where: { document_type: { id: document_type_id } },
    });
    const updatedProvisionGroups: ProvisionGroup[] = [];

    provision_groups.map((pg) => {
      const existingGroup = existingProvisionGroups.find((eg) => eg.id === pg.id);
      if (existingGroup) {
        existingGroup.max = pg.max;
        existingGroup.provision_group = pg.provision_group;
        existingGroup.provision_group_text = pg.provision_group_text;
        updatedProvisionGroups.push(existingGroup);
      }
    });
    return this.provisionGroupRepository.save(updatedProvisionGroups);
  }

  async removeProvisionGroup(provision_group_id: number) {
    const result = await this.provisionGroupRepository.delete(provision_group_id);

    if (result.affected === 0) {
      throw new Error(`Provision group with ID ${provision_group_id} not found`);
    }
  }

  async updateGroupMaximums(provision_group: number, max: number, provision_group_text: string) {
    let provisionGroup: ProvisionGroup = await this.provisionGroupRepository.findOneBy({
      provision_group: provision_group,
    });
    if (!provisionGroup) {
      const newGroup = this.provisionGroupRepository.create({
        provision_group: provision_group,
        max: max,
        provision_group_text: provision_group_text,
      });
      provisionGroup = await this.provisionGroupRepository.save(newGroup);
    }
    if (provisionGroup.max != max || provisionGroup.provision_group_text != provision_group_text) {
      await this.provisionGroupRepository.update(provisionGroup.id, {
        max: max,
        provision_group_text: provision_group_text,
      });
    }
  }

  removeDuplicates<T>(array: T[], property: keyof T): T[] {
    return array.reduce<T[]>((accumulator, currentObject) => {
      const existingObject = accumulator.find((obj) => obj[property] === currentObject[property]);
      if (!existingObject) {
        accumulator.push(currentObject);
      }
      return accumulator;
    }, []);
  }
}
