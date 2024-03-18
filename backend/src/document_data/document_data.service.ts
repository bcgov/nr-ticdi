import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Provision } from 'src/provision/entities/provision.entity';
import { ProvisionVariable } from 'src/provision/entities/provision_variable.entity';
import { DataSource, In, Repository } from 'typeorm';
import { CreateDocumentDataDto } from './dto/create-document_data.dto';
import { DocumentData } from './entities/document_data.entity';
import { DocumentDataProvision } from './entities/document_data_provision.entity';
import { DocumentDataVariable } from './entities/document_data_variable.entity';
import { DocumentDataView } from './entities/document_data_vw';
import { ProvisionService } from 'src/provision/provision.service';
import { DocumentTemplateService } from 'src/document_template/document_template.service';
import { DocumentType } from 'src/document_type/entities/document_type.entity';

@Injectable()
export class DocumentDataService {
  constructor(
    @InjectRepository(DocumentData)
    private documentDataRepository: Repository<DocumentData>,
    @InjectRepository(Provision)
    private documentProvisionRepository: Repository<Provision>,
    @InjectRepository(DocumentDataProvision)
    private documentDataProvisionRepository: Repository<DocumentDataProvision>,
    @InjectRepository(ProvisionVariable)
    private documentProvisionVariableRepository: Repository<ProvisionVariable>,
    @InjectRepository(DocumentDataVariable)
    private documentDataVariableRepository: Repository<DocumentDataVariable>,
    private provisionService: ProvisionService,
    private documentTemplateService: DocumentTemplateService,
    private dataSource: DataSource
  ) {}

  async createOrUpdate(
    documentDataDto: CreateDocumentDataDto,
    provisionArray: { provision_id: number; free_text: string }[],
    variableArray: { variable_id: number; variable_value: string }[]
  ): Promise<DocumentData> {
    const { dtid, document_type_id } = documentDataDto;
    // const documentType: DocumentType = await this.documentTemplateService.getDocumentType(document_type_id);
    const documentData: DocumentData = await this.documentDataRepository.findOne({
      where: { dtid: dtid, document_type: { id: document_type_id } },
      relations: [
        'document_data_variables',
        'document_data_provisions',
        'document_data_variables.document_variable',
        'document_data_provisions.document_provision',
        'document_type',
      ],
    });

    const documentProvisionIds = provisionArray.map(({ provision_id }) => provision_id);
    const documentProvisions = await this.documentProvisionRepository.findBy({
      id: In(documentProvisionIds),
    });
    const documentVariableIds = variableArray.map(({ variable_id }) => variable_id);
    const documentVariables = await this.documentProvisionVariableRepository.findBy({
      id: In(documentVariableIds),
    });

    // if documentData for this dtid+template exists, update it
    if (documentData) {
      return await this.updateDocumentData(
        documentDataDto,
        documentData,
        provisionArray,
        variableArray,
        documentProvisions,
        documentVariables
      );
    }
    // else create new documentData
    const documentTemplate = await this.documentTemplateService.findActiveByDocumentType(
      documentDataDto.document_type_id
    );
    documentDataDto['template_id'] = documentTemplate ? documentTemplate.id : null;
    const newNfrData: DocumentData = this.documentDataRepository.create(documentDataDto);
    const updatedNfrData = await this.documentDataRepository.save(newNfrData);

    const documentDataProvisions = provisionArray.map(({ provision_id, free_text }) => {
      const documentProvision = documentProvisions.find((provision) => provision.id === provision_id);
      const documentDataProvision = new DocumentDataProvision();
      documentDataProvision.document_data = updatedNfrData;
      documentDataProvision.document_provision = documentProvision;
      documentDataProvision.provision_free_text = documentProvision.free_text; // quick fix to not use the free_text from the document page
      return documentDataProvision;
    });
    const documentDataVariables = variableArray.map(({ variable_id, variable_value }) => {
      const documentVariable = documentVariables.find((variable) => variable.id === variable_id);
      const documentDataVariable = new DocumentDataVariable();
      documentDataVariable.document_data = updatedNfrData;
      documentDataVariable.document_variable = documentVariable;
      documentDataVariable.data_variable_value = variable_value;
      return documentDataVariable;
    });
    if (documentData) {
      await this.deleteDataVarsAndProvs(documentData, provisionArray, variableArray);
    }

    await this.documentDataProvisionRepository.save(documentDataProvisions);
    await this.documentDataVariableRepository.save(documentDataVariables);

    return updatedNfrData;
  }

  async updateDocumentData(
    documentDataDto: CreateDocumentDataDto,
    documentData: DocumentData,
    provisionArray: { provision_id: number; free_text: string }[],
    variableArray: { variable_id: number; variable_value: string }[],
    documentProvisions: Provision[],
    documentVariables: ProvisionVariable[]
  ): Promise<DocumentData> {
    // Update NFRData entity
    documentData.template_id = documentDataDto.template_id;
    documentData.status = documentDataDto.status;
    documentData.update_userid = documentDataDto.create_userid;

    const updatedNfrData = await this.documentDataRepository.save(documentData);

    // Update NFRDataProvision entities
    for (const provision of provisionArray) {
      const documentDataProvision = documentData.document_data_provisions.find(
        (p) => p.document_provision.id === provision.provision_id
      );
      const documentProvision = documentProvisions.find((p) => p.id === provision.provision_id);

      if (documentDataProvision && documentDataProvision.provision_free_text != documentProvision.free_text) {
        // Update an existing NFRDataProvision entry
        documentDataProvision.provision_free_text = documentProvision.free_text;
        await this.documentDataProvisionRepository.save(documentDataProvision);
      } else if (!documentDataProvision) {
        // No data found for this specific provision so create a new entry in NFRDataProvision
        const documentProvisionToAdd = await this.documentProvisionRepository.findOneBy({
          id: provision.provision_id,
        });
        const newNfrDataProvision: DocumentDataProvision = this.documentDataProvisionRepository.create({
          document_provision: documentProvisionToAdd,
          document_data: updatedNfrData,
          provision_free_text: documentProvisionToAdd.free_text, // quick fix
        });
        await this.documentDataProvisionRepository.save(newNfrDataProvision);
      }
    }

    // Update NFRDataVariable entities
    for (const variable of variableArray) {
      const documentDataVariable = documentData.document_data_variables.find(
        (v) => v.document_variable.id === variable.variable_id
      );

      if (documentDataVariable && documentDataVariable.data_variable_value != variable.variable_value) {
        // Update an existing NFRDataVariable entry
        documentDataVariable.data_variable_value = variable.variable_value;
        await this.documentDataVariableRepository.save(documentDataVariable);
      } else if (!documentDataVariable) {
        // No data found for this specific variable so create a new entry in NFRDataVariable
        const documentVariable = await this.documentProvisionVariableRepository.findOneBy({
          id: variable.variable_id,
        });
        const newNfrDataVariable: DocumentDataVariable = this.documentDataVariableRepository.create({
          document_variable: documentVariable,
          document_data: updatedNfrData,
          data_variable_value: variable.variable_value,
        });
        await this.documentDataVariableRepository.save(newNfrDataVariable);
      }
    }
    await this.deleteDataVarsAndProvs(documentData, provisionArray, variableArray);

    return updatedNfrData;
  }

  async deleteDataVarsAndProvs(
    documentData: DocumentData,
    provisionArray: { provision_id: number; free_text: string }[],
    variableArray: { variable_id: number; variable_value: string }[]
  ) {
    // Delete data provisions that have been removed by the user
    const oldProvisionIds = documentData
      ? documentData.document_data_provisions.map((dataProvision) => dataProvision.document_provision.id)
      : [];
    const newProvisionIds = provisionArray.map(({ provision_id }) => provision_id);
    const provisionsToDelete = oldProvisionIds.filter((item) => !newProvisionIds.includes(item));
    const documentDataProvisionsToDelete = documentData.document_data_provisions
      .filter((dataProvision) => provisionsToDelete.includes(dataProvision.document_provision.id))
      .map((dataProvision) => dataProvision.id);
    if (documentDataProvisionsToDelete.length > 0) {
      await this.documentDataProvisionRepository.delete(documentDataProvisionsToDelete);
    }

    // Delete data variables that have been removed by the user
    const oldVariableIds = documentData
      ? documentData.document_data_variables.map((dataVariable) => dataVariable.document_variable.id)
      : [];
    const newVariableIds = variableArray.map(({ variable_id }) => variable_id);
    const variablesToDelete = oldVariableIds.filter((item) => !newVariableIds.includes(item));
    const documentDataVariablesToDelete = documentData.document_data_variables
      .filter((dataVariable) => variablesToDelete.includes(dataVariable.document_variable.id))
      .map((dataVariable) => dataVariable.id);
    if (documentDataVariablesToDelete.length > 0) {
      await this.documentDataVariableRepository.delete(documentDataVariablesToDelete);
    }
    return null;
  }

  // Used by the search page.
  // Variant data is persisted so only return the active variant foreach dtid.
  async findAll(): Promise<DocumentData[]> {
    return await this.documentDataRepository.find({
      where: {
        active: true,
      },
      relations: ['document_type'],
    });
  }

  async findByDocumentDataId(documentDataId: number): Promise<{
    documentData: DocumentData;
    provisionIds: number[];
    variableIds: number[];
  }> {
    try {
      const documentData = await this.documentDataRepository.findOne({
        where: { id: documentDataId },
        join: {
          alias: 'document_data',
          leftJoinAndSelect: {
            document_data_provisions: 'document_data.document_data_provisions',
            provision: 'document_data_provisions.provision',
            document_data_variables: 'document_data.document_data_variables',
            document_variable: 'document_data_variables.document_variable',
          },
        },
      });
      const existingDataProvisions = documentData.document_data_provisions;
      const provisionIds = existingDataProvisions.map((dataProvision) => dataProvision.document_provision.id);
      const existingDataVariables = documentData.document_data_variables;
      const variableIds = existingDataVariables.map((dataVariable) => dataVariable.document_variable.id);
      return { documentData, provisionIds, variableIds };
    } catch (err) {
      console.log('Error in findByDocumentDataId');
      console.log(err);
      return null;
    }
  }

  async findDocumentDataByDocTypeIdAndDtid(
    document_type_id: number,
    dtid: number
  ): Promise<{
    documentData: DocumentData;
    provisionIds: number[];
    variableIds: number[];
  }> {
    try {
      const documentData = await this.documentDataRepository.find({
        where: { dtid: dtid },
        join: {
          alias: 'document_data',
          leftJoinAndSelect: {
            document_data_provisions: 'document_data.document_data_provisions',
            document_provision: 'document_data_provisions.document_provision',
            document_data_variables: 'document_data.document_data_variables',
            document_variable: 'document_data_variables.document_variable',
          },
        },
      });
      const filteredDocumentData = documentData.find((d) => d.document_type.id === document_type_id);
      console.log(filteredDocumentData);
      const provisionIds =
        filteredDocumentData && filteredDocumentData.document_data_provisions
          ? filteredDocumentData.document_data_provisions.map((dataProvision) => dataProvision.document_provision.id)
          : [];
      const variableIds =
        filteredDocumentData && filteredDocumentData.document_data_variables
          ? filteredDocumentData.document_data_variables.map((dataVariable) => dataVariable.document_variable.id)
          : [];
      return { documentData: filteredDocumentData, provisionIds, variableIds };
    } catch (err) {
      console.log('Error in findActiveByDtid');
      console.log(err);
      return null;
    }
  }

  async findViewByDocumentDataId(documentDataId: number): Promise<DocumentDataView> {
    return this.dataSource.manager.findOneBy(DocumentDataView, {
      DocumentDataId: documentDataId,
    });
  }

  async getVariablesByDtidAndDocType(dtid: number, document_type_id: number) {
    try {
      const documentData: DocumentData = await this.documentDataRepository.findOne({
        where: { dtid: dtid, document_type: { id: document_type_id } },
        join: {
          alias: 'document_data',
          leftJoinAndSelect: {
            document_data_variables: 'document_data.document_data_variables',
            document_variable: 'document_data_variables.document_variable',
          },
        },
      });
      // if the documentData doesn't exist yet, return null. This null value is caught elsewhere.
      if (!documentData) {
        return null;
      }
      // saved variables attached to the documentData entry
      const existingDataVariables: DocumentDataVariable[] = documentData.document_data_variables;
      // all variables associated with the variant
      const variables: ProvisionVariable[] = await this.provisionService.getVariablesByDocumentTypeId(document_type_id);
      // inserting the existing variable_values to the set of all variables
      for (const variable of variables) {
        const existingDataVariable = existingDataVariables.find(
          (dataVariable) => dataVariable.document_variable.id === variable.id
        );
        if (existingDataVariable) {
          variable.variable_value = existingDataVariable.data_variable_value;
        }
      }
      const variableIds = existingDataVariables.map((dataVariable) => dataVariable.document_variable.id);
      return { variables, variableIds };
    } catch (err) {
      console.log('Error in getVariablesByDtidAndDocType');
      console.log(err);
      return null;
    }
  }

  async getProvisionsByDocTypeIdAndDtid(document_type_id: number, dtid: number) {
    try {
      const documentData = await this.documentDataRepository
        .createQueryBuilder('document_data')
        .leftJoinAndSelect('document_data.document_data_provisions', 'document_data_provisions')
        .leftJoinAndSelect('document_data_provisions.document_provision', 'provision')
        .where('document_data.dtid = :dtid', { dtid })
        .andWhere('document_data."documentTypeId"  = :document_type_id', { document_type_id })
        .getOne();
      console.log(documentData);

      // if the documentData doesn't exist yet, return null. This null value is caught elsewhere.
      if (!documentData) {
        return null;
      }

      // saved provisions attached to the dtid
      const existingDataProvisions: DocumentDataProvision[] = [];
      existingDataProvisions.push(...documentData.document_data_provisions);
      // all provisions
      const provisions: Provision[] = await this.provisionService.getAllProvisionsByDocTypeId(document_type_id);
      const provisionIds = existingDataProvisions.map((dataProvision) => dataProvision.document_provision.id);
      return { provisions, provisionIds };
    } catch (err) {
      console.log('Error in getProvisionsByDocTypeIdAndDtid');
      console.log(err);
      return null;
    }
  }

  async getEnabledProvisionsByDocTypeIdAndDtid(document_type_id: number, dtid: number) {
    try {
      const documentData: DocumentData = await this.documentDataRepository.findOne({
        where: { dtid: dtid, document_type: { id: document_type_id } },
        join: {
          alias: 'document_data',
          leftJoinAndSelect: {
            document_data_provisions: 'document_data.document_data_provisions',
            provision: 'document_data_provisions.provision',
          },
        },
      });
      const provisionIds =
        documentData && documentData.document_data_provisions
          ? documentData.document_data_provisions.map((dataProvision) => dataProvision.document_provision.id)
          : [];
      return provisionIds;
    } catch (err) {
      console.log('Error in getEnabledProvisionsByDocTypeIdAndDtid');
      console.log(err);
      return null;
    }
  }

  async remove(dtid: number): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.documentDataRepository.delete({ dtid: dtid });
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
