import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DocumentType } from './entities/document_type.entity';
import { ProvisionGroup } from './entities/provision_group.entity';
import { DocumentTypeProvision } from './entities/document_type_provision';
// import { ProvisionService } from 'src/provision/provision.service';

@Injectable()
export class DocumentTypeService {
  constructor(
    @InjectRepository(DocumentType)
    private documentTypeRepository: Repository<DocumentType>,
    @InjectRepository(DocumentTypeProvision)
    private documentTypeProvisionRepository: Repository<DocumentTypeProvision>,
    @InjectRepository(ProvisionGroup)
    private provisionGroupRepository: Repository<ProvisionGroup> // private provisionService: ProvisionService
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

  save(docType: DocumentType) {
    return this.documentTypeRepository.save(docType);
  }

  /** Document Type Provision & Provision Group functions */

  async getGroupMax(): Promise<any> {
    const docTypeProvisions = await this.documentTypeProvisionRepository.find({
      relations: ['provision_group'],
    });
    let provisionGroups: ProvisionGroup[] = [];
    docTypeProvisions.forEach((provision) => {
      provisionGroups.push(provision.provision_group);
    });
    provisionGroups = this.removeDuplicates(provisionGroups, 'provision_group');
    return Array.from(provisionGroups).sort((a, b) => a.provision_group - b.provision_group);
  }

  async getGroupMaxByDocTypeId(document_type_id: number): Promise<any> {
    const provisionGroups = await this.provisionGroupRepository.find({
      where: { document_type: { id: document_type_id } },
    });
    return Array.from(provisionGroups).sort((a, b) => a.provision_group - b.provision_group);
  }

  async getMandatoryProvisions(): Promise<number[]> {
    const docTypeProvisions = await this.documentTypeProvisionRepository.find({
      where: { type: 'M' },
    });
    return docTypeProvisions.map((provision) => provision.id);
  }

  async getMandatoryProvisionsByDocumentTypeId(document_type_id: number): Promise<number[]> {
    const docTypeProvisions = await this.documentTypeProvisionRepository
      .createQueryBuilder('provision')
      .innerJoinAndSelect('provision.document_types', 'documentType')
      .where('provision.type = :type', { type: 'M' })
      .andWhere('documentType.id = :documentTypeId', { documentTypeId: document_type_id })
      .getMany();

    return docTypeProvisions.map((provision) => provision.id);
  }

  async getManageDocTypeProvisions(document_type_id: number) {
    // type used by the frontend for displaying data in a table
    type ManageDocTypeProvision = {
      id: number;
      type: string;
      provision_name: string;
      free_text: string;
      help_text: string;
      category: string;
      active_flag: boolean;
      order_value: number;
      associated: boolean; // is the provision currently associated with the doc type
      provision_group: ProvisionGroup;
    };

    // get all docTypeProvisions with provision_group relation
    const docTypeProvisions = await this.documentTypeProvisionRepository.find({
      relations: ['provision_group', 'provision'],
    });
    // get provision ids which are associated with the document type
    const rawAssociatedProvisions = await this.documentTypeProvisionRepository
      .createQueryBuilder('provision')
      .select('provision.id', 'id')
      .innerJoin('provision.document_types', 'documentType', 'documentType.id = :document_type_id', {
        document_type_id,
      })
      .getRawMany();
    // map them to a more readable format
    const associatedProvisionIds = rawAssociatedProvisions.map((raw) => raw.id);
    // map 'docTypeProvisions' to include a variable called 'associated' which is true or false
    const managedProvisions: ManageDocTypeProvision[] = docTypeProvisions.map((docTypeProvision) => ({
      id: docTypeProvision.id,
      type: docTypeProvision.type,
      provision_name: docTypeProvision.provision.provision_name,
      free_text: docTypeProvision.provision.free_text,
      help_text: docTypeProvision.provision.help_text,
      category: docTypeProvision.provision.category,
      active_flag: docTypeProvision.provision.active_flag,
      order_value: docTypeProvision.order_value,
      associated: associatedProvisionIds.includes(docTypeProvision.id),
      provision_group: docTypeProvision.provision_group,
    }));
    return managedProvisions;
  }

  async associateDocType(provision_id: number, document_type_id: number) {
    try {
      console.log(`associating provision id ${provision_id} to doc type ${document_type_id}`);
      const documentType: DocumentType = await this.findById(document_type_id);
      const provision: DocumentTypeProvision = await this.documentTypeProvisionRepository.findOneBy({
        id: provision_id,
      });
      // make sure they aren't already related
      const existingProvision = documentType.document_type_provisions.find((p) => p.id === provision.id);
      if (documentType && provision && !existingProvision) {
        documentType.document_type_provisions.push(provision);
        await this.save(documentType);
      } else {
        throw new Error(`Failed to associate Provision with Document Type`);
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async disassociateDocType(provision_id: number, document_type_id: number) {
    try {
      console.log(`disassociating provision id ${provision_id} from doc type ${document_type_id}`);
      const documentType: DocumentType = await this.findById(document_type_id);
      const provisionIndex = documentType.document_type_provisions.findIndex((p) => {
        return p.id === provision_id;
      });
      if (documentType && provisionIndex > -1) {
        documentType.document_type_provisions.splice(provisionIndex, 1);
        await this.save(documentType);
      } else {
        throw new Error(`Failed to disassociate Provision and Document Type`);
      }
    } catch (err) {
      console.log(err);
      throw err;
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
