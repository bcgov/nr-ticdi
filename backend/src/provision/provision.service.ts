import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProvisionDto } from './dto/create-provision.dto';
import { Provision } from './entities/provision.entity';
import { UpdateProvisionDto } from './dto/update-provision.dto';
import { ProvisionVariable } from './entities/provision_variable.entity';
import { DocumentTypeService } from 'src/document_type/document_type.service';
import { DocumentType } from 'src/document_type/entities/document_type.entity';
import { DocumentTypeProvision } from './entities/document_type_provision';
import { ProvisionGroup } from 'src/document_type/entities/provision_group.entity';

@Injectable()
export class ProvisionService {
  constructor(
    @InjectRepository(Provision)
    private provisionRepository: Repository<Provision>,
    @InjectRepository(ProvisionVariable)
    private provisionVariableRepository: Repository<ProvisionVariable>,
    @InjectRepository(DocumentTypeProvision)
    private documentTypeProvisionRepository: Repository<DocumentTypeProvision>,
    private documentTypeService: DocumentTypeService
  ) {}

  async create(provision: CreateProvisionDto): Promise<Provision> {
    const newProvision: Provision = this.provisionRepository.create({
      ...provision,
    });
    const savedProvision = await this.provisionRepository.save(newProvision);
    const documentTypes: DocumentType[] = await this.documentTypeService.findAll();

    // create an array of DocumentTypeProvision entries, one for each document type, each using the newly saved provision
    const documentTypeProvisions = documentTypes.map((documentType) => {
      const documentTypeProvision = new DocumentTypeProvision();
      documentTypeProvision.document_type = documentType;
      documentTypeProvision.provision = savedProvision;
      return documentTypeProvision;
    });

    // save the new document_type_provision entries to the db
    await this.documentTypeProvisionRepository.save(documentTypeProvisions);

    return savedProvision;
  }

  async update(id: number, provision: UpdateProvisionDto): Promise<any> {
    const existingProvision: Provision = await this.provisionRepository.findOneBy({ id });
    existingProvision.provision_name = provision.provision_name;
    existingProvision.free_text = provision.free_text;
    existingProvision.help_text = provision.help_text;
    existingProvision.category = provision.category;
    existingProvision.update_userid = provision.update_userid;
    const updatedProvision = this.provisionRepository.create({
      ...existingProvision,
    });
    return this.provisionRepository.save(updatedProvision);
  }

  async addVariable(variable: {
    variable_name: string;
    variable_value: string;
    help_text: string;
    provision_id: number;
    create_userid: string;
  }) {
    const provision: Provision = await this.findById(variable.provision_id);
    delete variable['provision_id'];
    const newVariable = this.provisionVariableRepository.create({
      ...variable,
      provision: provision,
    });
    console.log(newVariable);
    return this.provisionVariableRepository.save(newVariable);
  }

  async updateVariable(variable: {
    id: number;
    variable_name: string;
    variable_value: string;
    help_text: string;
    provision_id: number;
    update_userid: string;
  }) {
    const provision = await this.findById(variable.provision_id);
    delete variable['provision_id'];
    const variableToUpdate = await this.provisionVariableRepository.findOne({
      where: { id: variable.id },
    });

    if (!variableToUpdate) {
      throw new Error('Variable not found');
    }
    variableToUpdate.variable_name = variable.variable_name;
    variableToUpdate.variable_value = variable.variable_value;
    variableToUpdate.help_text = variable.help_text;
    variableToUpdate.provision = provision;
    variableToUpdate.update_userid = variable.update_userid;

    return this.provisionVariableRepository.save(variableToUpdate);
  }

  async removeVariable(id: number): Promise<any> {
    return this.provisionVariableRepository.delete(id);
  }

  // gets global provision list
  async findAll(): Promise<any[]> {
    const provisions = await this.provisionRepository.find({
      where: { is_deleted: false },
    });
    return provisions;
  }

  async findAllVariables(): Promise<any[]> {
    const variables = await this.provisionVariableRepository.find({
      relations: ['provision'],
    });
    return variables.map((variable) => {
      return {
        ...variable,
        provision_id: variable.provision.id,
      };
    });
  }

  async getProvisionsByDocumentTypeId(document_type_id: number): Promise<Provision[]> {
    const provisions: Provision[] = await this.provisionRepository
      .createQueryBuilder('provision')
      .innerJoinAndSelect('provision.document_types', 'documentType')
      .innerJoinAndSelect('provision.provision_group', 'provisionGroup')
      .where('documentType.id = :documentTypeId', { documentTypeId: document_type_id })
      .andWhere('is_deleted = false')
      .getMany();

    return provisions;
  }

  // querybuilder is more efficient here
  async getVariablesByDocumentTypeId(document_type_id: number) {
    const provisions = await this.provisionRepository
      .createQueryBuilder('provision')
      .innerJoin('provision.document_types', 'documentType', 'documentType.id = :document_type_id', {
        document_type_id,
      })
      .where('is_deleted = false')
      .getMany();
    if (!provisions.length) {
      return [];
    }
    const provisionIds = provisions.map((provision) => provision.id);
    const provisionVariables = await this.provisionVariableRepository
      .createQueryBuilder('provisionVariable')
      .where('provisionVariable.provisionId IN (:...provisionIds)', { provisionIds })
      .leftJoinAndSelect('provisionVariable.provision', 'provision')
      .getMany();
    return provisionVariables;
  }

  async findById(provisionId: number): Promise<Provision> {
    try {
      return this.provisionRepository.findOne({
        where: { id: provisionId },
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async getAllProvisionsByDocTypeId(document_type_id: number): Promise<Provision[]> {
    try {
      const provisions: Provision[] = await this.provisionRepository
        .createQueryBuilder('provision')
        .innerJoinAndSelect('provision.provision_group', 'provision_group')
        .innerJoin('provision.document_types', 'document_type', 'document_type.id = :document_type_id', {
          document_type_id,
        })
        .where('provision.is_deleted = false')
        .getMany();
      return provisions;
    } catch (err) {
      console.error('Error in getAllProvisionsByDocTypeId', err);
      return [];
    }
  }

  async enable(id: number): Promise<any> {
    await this.provisionRepository.update(id, {
      active_flag: true,
    });
    return { message: 'Provision Enabled' };
  }

  async disable(id: number): Promise<any> {
    await this.provisionRepository.update(id, {
      active_flag: false,
    });
    return { message: 'Provision Disabled' };
  }

  async remove(id: number): Promise<any> {
    await this.provisionRepository.update(id, { is_deleted: true });
    // update downstream document type provisions
    await this.documentTypeProvisionRepository.delete({ provision: { id: id } });
    return { message: 'Provision deleted' };
  }

  /**
   * Document Type Provisions
   */
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
      sequence_value: number;
      associated: boolean; // is the provision currently associated with the doc type
      provision_group: ProvisionGroup | null;
    };

    const provisions: Provision[] = await this.findAll();
    console.log(provisions);
    // get all docTypeProvisions with provision_group relation
    const docTypeProvisions = await this.documentTypeProvisionRepository.find({
      relations: ['provision_group', 'provision'],
    });
    console.log(docTypeProvisions);
    // get provisions which are associated with the document type
    const associatedProvisions = await this.documentTypeProvisionRepository.find({
      where: { document_type: { id: document_type_id } },
    });
    console.log(associatedProvisions);
    // map them to a more readable format
    const associatedProvisionIds = associatedProvisions.map((raw) => raw.id);
    // map 'docTypeProvisions' to include a variable called 'associated' which is true or false
    const managedProvisions: ManageDocTypeProvision[] = docTypeProvisions.map((docTypeProvision) => ({
      id: docTypeProvision.id,
      type: docTypeProvision.type,
      provision_name: docTypeProvision.provision.provision_name,
      free_text: docTypeProvision.provision.free_text,
      help_text: docTypeProvision.provision.help_text,
      category: docTypeProvision.provision.category,
      active_flag: docTypeProvision.provision.active_flag,
      sequence_value: docTypeProvision.sequence_value,
      associated: associatedProvisionIds.includes(docTypeProvision.id),
      provision_group: docTypeProvision.provision_group,
    }));
    return managedProvisions;
  }

  async associateDocType(provision_id: number, document_type_id: number) {
    try {
      console.log(`associating provision id ${provision_id} to doc type ${document_type_id}`);
      const documentType: DocumentType = await this.documentTypeService.findById(document_type_id);
      const dtProvision: DocumentTypeProvision = await this.documentTypeProvisionRepository.findOneBy({
        id: provision_id,
      });
      // make sure they aren't already related
      const existingProvision = documentType.document_type_provisions.find((p) => p.id === dtProvision.id);
      if (documentType && dtProvision && !existingProvision) {
        documentType.document_type_provisions.push(dtProvision);
        await this.documentTypeService.save(documentType);
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
      const documentType: DocumentType = await this.documentTypeService.findById(document_type_id);
      const provisionIndex = documentType.document_type_provisions.findIndex((p) => {
        return p.id === provision_id;
      });
      if (documentType && provisionIndex > -1) {
        documentType.document_type_provisions.splice(provisionIndex, 1);
        await this.documentTypeService.save(documentType);
      } else {
        throw new Error(`Failed to disassociate Provision and Document Type`);
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
   * When a new document type is created, a document type provision for each existing global provision needs to be created
   * @param documentType
   */
  async generateDocTypeProvisions(documentType: DocumentType): Promise<void> {
    const allProvisions: Provision[] = await this.findAll();
    const documentTypeProvisions = allProvisions.map((provision) => {
      const documentTypeProvision = new DocumentTypeProvision();
      documentTypeProvision.document_type = documentType;
      documentTypeProvision.provision = provision;
      return documentTypeProvision;
    });
    await this.documentTypeProvisionRepository.save(documentTypeProvisions);
  }

  /**
   * Deletes all document type provisions for a given document type which is being deleted.
   * @param document_type_id
   */
  async removeDocTypeProvisions(document_type_id: number): Promise<void> {
    await this.documentTypeProvisionRepository.delete({ document_type: { id: document_type_id } });
  }
}
