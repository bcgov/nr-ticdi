import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProvisionDto } from './dto/create-provision.dto';
import { Provision } from './entities/provision.entity';
import { UpdateProvisionDto } from './dto/update-provision.dto';
import { ProvisionVariable } from './entities/provision_variable.entity';

@Injectable()
export class ProvisionService {
  constructor(
    @InjectRepository(Provision)
    private provisionRepository: Repository<Provision>,
    @InjectRepository(ProvisionVariable)
    private provisionVariableRepository: Repository<ProvisionVariable>
  ) {}

  async create(provision: CreateProvisionDto): Promise<Provision> {
    // const provision_group = Math.floor(provision.provision_group);
    // const provision_group_text = provision.provision_group_text;
    // delete provision['provision_group'];
    // delete provision['provision_group_text'];
    // provision.max = Math.floor(provision.max);
    // await this.updateGroupMaximums(provision_group, provision.max, provision_group_text);
    // if ((await this.provisionGroupRepository.countBy({ provision_group })) == 0) {
    //   const newProvisionGroup = this.provisionGroupRepository.create({
    //     provision_group,
    //     provision_group_text,
    //   });
    //   await this.provisionGroupRepository.save(newProvisionGroup);
    // }
    // const provisionGroup = await this.provisionGroupRepository.findOneBy({
    //   provision_group,
    // });
    const newProvision: Provision = this.provisionRepository.create({
      ...provision,
      // provision_group: provisionGroup,
    });
    return this.provisionRepository.save(newProvision);
  }

  async update(id: number, provision: UpdateProvisionDto): Promise<any> {
    // const provision_group = Math.floor(provision.provision_group);
    // const provision_group_text = provision.provision_group_text;
    // delete provision['provision_group'];
    // delete provision['provision_group_text'];
    // provision.max = Math.floor(provision.max);
    // await this.updateGroupMaximums(provision_group, provision.max, provision_group_text);
    // const provisionGroup = await this.provisionGroupRepository.findOneBy({
    //   provision_group,
    // });
    const existingProvision: Provision = await this.provisionRepository.findOneBy({ id });

    // const documentTypes: DocumentType[] = await this.documentTypeService.findByIds(document_type_ids);

    // existingProvision.type = provision.type;
    existingProvision.provision_name = provision.provision_name;
    existingProvision.free_text = provision.free_text;
    existingProvision.help_text = provision.help_text;
    existingProvision.category = provision.category;
    existingProvision.update_userid = provision.update_userid;
    // existingProvision.document_types = documentTypes;
    const updatedProvision = this.provisionRepository.create({
      ...existingProvision,
      // provision_group: provisionGroup,
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
      // relations: ['provision_group', 'document_types'],
    });
    return provisions;
    // return provisions.map((provision) => {
    //   const { provision_group, document_types, ...restOfProvision } = provision;
    //   delete provision_group['id'];

    //   return {
    //     ...provision,
    //     ...provision_group,
    //     document_types,
    //   };
    // });
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
    return { message: 'Provision deleted' };
  }
}
