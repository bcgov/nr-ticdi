import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProvisionDto } from './dto/create-provision.dto';
import { Provision } from './entities/provision.entity';
import { UpdateProvisionDto } from './dto/update-provision.dto';
import { ProvisionGroup } from './entities/provision_group.entity';
import { ProvisionVariable } from './entities/provision_variable.entity';
import { DocumentType } from 'src/document_type/entities/document_type.entity';

@Injectable()
export class ProvisionService {
  constructor(
    @InjectRepository(Provision)
    private provisionRepository: Repository<Provision>,
    @InjectRepository(ProvisionGroup)
    private provisionGroupRepository: Repository<ProvisionGroup>,
    @InjectRepository(ProvisionVariable)
    private provisionVariableRepository: Repository<ProvisionVariable>,
    @InjectRepository(DocumentType)
    private documentTypeRepository: Repository<DocumentType>
  ) {}

  async create(provision: CreateProvisionDto): Promise<Provision> {
    const provision_group = Math.floor(provision.provision_group);
    const provision_group_text = provision.provision_group_text;
    delete provision['provision_group'];
    delete provision['provision_group_text'];
    provision.max = Math.floor(provision.max);
    await this.updateGroupMaximums(provision_group, provision.max, provision_group_text);
    if ((await this.provisionGroupRepository.countBy({ provision_group })) == 0) {
      const newProvisionGroup = this.provisionGroupRepository.create({
        provision_group,
        provision_group_text,
      });
      await this.provisionGroupRepository.save(newProvisionGroup);
    }
    const provisionGroup = await this.provisionGroupRepository.findOneBy({
      provision_group,
    });
    const newProvision: Provision = this.provisionRepository.create({
      ...provision,
      provision_group: provisionGroup,
    });
    return this.provisionRepository.save(newProvision);
  }

  async update(id: number, provision: UpdateProvisionDto): Promise<any> {
    const provision_group = Math.floor(provision.provision_group);
    const provision_group_text = provision.provision_group_text;
    delete provision['provision_group'];
    delete provision['provision_group_text'];
    provision.max = Math.floor(provision.max);
    await this.updateGroupMaximums(provision_group, provision.max, provision_group_text);
    const provisionGroup = await this.provisionGroupRepository.findOneBy({
      provision_group,
    });
    const existingProvision: Provision = await this.provisionRepository.findOneBy({ id });
    existingProvision.type = provision.type;
    existingProvision.provision_name = provision.provision_name;
    existingProvision.free_text = provision.free_text;
    existingProvision.help_text = provision.help_text;
    existingProvision.category = provision.category;
    existingProvision.update_userid = provision.update_userid;
    const updatedProvision = this.provisionRepository.create({
      ...existingProvision,
      provision_group: provisionGroup,
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
    const provision = await this.findById(variable.provision_id);
    delete variable['provision_id'];
    const newVariable = this.provisionVariableRepository.create({
      ...variable,
      provision: provision,
    });
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

  async findAll(): Promise<any[]> {
    const provisions = await this.provisionRepository.find({
      relations: ['provision_group'],
    });
    return provisions.map((provision) => {
      delete provision.provision_group['id'];

      return {
        ...provision,
        ...provision.provision_group,
      };
    });
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
        relations: ['provision_group'],
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
        .innerJoin('provision_group.document_type', 'document_type')
        .where('document_type.id = :document_type_id', { document_type_id })
        .getMany();

      return provisions;
    } catch (err) {
      console.log('Error in getAllProvisionsByDocTypeId');
      console.log(err);
      return null;
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

  async getGroupMax(): Promise<any> {
    const provisions = await this.provisionRepository.find({
      relations: ['provision_group'],
    });
    let provisionGroups: ProvisionGroup[] = [];
    provisions.forEach((provision) => {
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

  // async getVariablesByDtid(dtid: number): Promise<any> {
  //   // gets ALL provisions
  //   const provisions = await this.provisionRepository.find({
  //     relations: ['provision_variables'],
  //   });

  //   const provisionVariables: ProvisionVariable[] = [];
  //   provisions.forEach((provision) => {
  //     provision.provision_variables.forEach((variable) => {
  //       variable['provisionId'] = provision.id;
  //       provisionVariables.push(variable);
  //     });
  //   });
  //   return provisionVariables;
  // }

  async getMandatoryProvisions(): Promise<number[]> {
    const provisions = await this.provisionRepository.find({
      where: { type: 'M' },
    });
    return provisions.map((provision) => provision.id);
  }

  async getMandatoryProvisionsByDocumentTypeId(document_type_id: number): Promise<number[]> {
    const provisions = await this.provisionRepository
      .createQueryBuilder('provision')
      .innerJoinAndSelect('provision.document_types', 'documentType')
      .where('provision.type = :type', { type: 'M' })
      .andWhere('documentType.id = :documentTypeId', { documentTypeId: document_type_id })
      .getMany();

    return provisions.map((provision) => provision.id);
  }

  async remove(id: number): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.provisionRepository.delete(id);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
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
