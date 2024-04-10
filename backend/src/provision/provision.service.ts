import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateProvisionDto } from './dto/create-provision.dto';
import { Provision } from './entities/provision.entity';
import { UpdateProvisionDto } from './dto/update-provision.dto';
import { ProvisionVariable } from './entities/provision_variable.entity';
import { DocumentTypeService } from 'src/document_type/document_type.service';
import { DocumentType } from 'src/document_type/entities/document_type.entity';
import { DocumentTypeProvision } from './entities/document_type_provision';
import { ProvisionGroup } from 'src/document_type/entities/provision_group.entity';
import { ManageDocTypeProvision } from 'src/types';

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

  // old route to be deleted
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

  async getVariablesByDocumentTypeId() {
    const provisions: Provision[] = await this.provisionRepository.find({
      where: { is_deleted: false, active_flag: true },
      relations: ['document_type_provisions', 'provision_variables'],
    });

    if (!provisions.length) {
      return [];
    }
    const provisionIds = provisions.map((provision) => provision.id);
    const provisionVariables = await this.provisionVariableRepository.find({
      where: {
        provision: { id: In(provisionIds) },
      },
      relations: ['provision'],
    });
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
  async getDocTypeProvisionById(document_type_provision_id: number): Promise<DocumentTypeProvision> {
    return this.documentTypeProvisionRepository.findOne({ where: { id: document_type_provision_id } });
  }

  async getMandatoryProvisionsByDocumentTypeId(document_type_id: number): Promise<number[]> {
    const docTypeProvisions = await this.documentTypeProvisionRepository.find({
      where: {
        type: 'M',
        document_type: {
          id: document_type_id,
        },
      },
    });

    return docTypeProvisions.map((provision) => provision.id);
  }

  async getManageDocTypeProvisions(document_type_id: number) {
    const provisions: Provision[] = await this.findAll();
    console.log(provisions);
    // get all docTypeProvisions with provision_group relation
    const docTypeProvisions = await this.documentTypeProvisionRepository.find({
      where: { document_type: { id: document_type_id } },
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
      associated: docTypeProvision.associated,
      provision_group: docTypeProvision?.provision_group ? docTypeProvision.provision_group.provision_group : null,
      max: docTypeProvision?.provision_group ? docTypeProvision.provision_group.max : null,
      provision_group_object: docTypeProvision.provision_group,
    }));
    return managedProvisions;
  }

  async getDocumentTypeProvisionsByDocumentTypeId(document_type_id: number): Promise<DocumentTypeProvision[]> {
    type DocTypeProvisionData = {
      id: number;
      type: string;
      sequence_value: number;
      associated: boolean;
      provision_id: number;
      provision_name: string;
      free_text: string;
      help_text: string;
      category: string;
      active_flag: boolean;
      is_deleted: boolean;
      provision_group: ProvisionGroup;
      create_userid: string;
      update_userid: string;
      create_timestamp: string;
      update_timestamp: string;
    };
    const docTypeProvisions = await this.documentTypeProvisionRepository.find({
      where: { document_type: { id: document_type_id }, associated: true },
      relations: ['document_type', 'provision', 'provision_group', 'document_data_provisions'],
    });
    const provisions = await this.provisionRepository.find({ relations: ['provision_variables'] });
    const fullDocTypeProvisions = docTypeProvisions.flatMap((docTypeProvision) => {
      const correspondingProvision = provisions.find((provision) => provision.id === docTypeProvision.provision.id);
      const dtProv = docTypeProvision.provision;
      delete docTypeProvision['provision'];
      return {
        ...docTypeProvision,
        ...dtProv,
        id: docTypeProvision.id,
        provision_id: dtProv.id,
      };
    });
    return fullDocTypeProvisions;
  }

  async getSimpleDocTypeProvisionsByDocTypeId(document_type_id: number): Promise<DocumentTypeProvision[]> {
    return this.documentTypeProvisionRepository.find({
      where: { document_type: { id: document_type_id } },
      relations: ['provision'],
    });
  }

  async associateDocType(provision_id: number, document_type_id: number) {
    try {
      console.log(`associating provision id ${provision_id} from doc type ${document_type_id}`);
      const documentTypeProvision = await this.documentTypeProvisionRepository.findOneOrFail({
        where: { id: provision_id },
      });
      await this.documentTypeProvisionRepository.save({
        ...documentTypeProvision,
        associated: true,
      });
    } catch (err) {
      console.log(err);
      throw new Error('Error associating provision.');
    }
  }

  async disassociateDocType(provision_id: number, document_type_id: number) {
    try {
      console.log(`disassociating provision id ${provision_id} from doc type ${document_type_id}`);
      const documentTypeProvision = await this.documentTypeProvisionRepository.findOneOrFail({
        where: { id: provision_id },
      });
      await this.documentTypeProvisionRepository.save({
        ...documentTypeProvision,
        associated: false,
      });
    } catch (err) {
      console.log(err);
      throw new Error('Error disassociating provision.');
    }
  }

  async updateManageDocTypeProvisions(document_type_id: number, docTypeProvisions: ManageDocTypeProvision[]) {
    const existingDocTypeProvisions: DocumentTypeProvision[] = await this.documentTypeProvisionRepository.find({
      where: {
        document_type: { id: document_type_id },
      },
    });
    const updatedProvisions = existingDocTypeProvisions.map((existingProv) => {
      const matchingProv = docTypeProvisions.find((dtp) => dtp.id === existingProv.id);

      if (matchingProv) {
        return {
          ...existingProv,
          type: matchingProv.type,
          associated: matchingProv.associated,
          sequence_value: matchingProv.sequence_value,
          provision_group: matchingProv.provision_group_object,
        };
      }
      return existingProv;
    });
    await this.documentTypeProvisionRepository.save(updatedProvisions);
    console.log('Provisions updated successfully!');
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
