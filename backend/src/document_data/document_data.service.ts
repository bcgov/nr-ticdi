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
import { DocumentTypeService } from 'src/document_type/document_type.service';
import { DocumentTypeProvision } from 'src/provision/entities/document_type_provision';

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
    private documentTypeService: DocumentTypeService,
    private dataSource: DataSource
  ) {}

  async createOrUpdate(
    documentDataDto: CreateDocumentDataDto,
    document_type_id: number,
    provisionArray: { provision_id: number; doc_type_provision_id: number }[],
    variableArray: { variable_id: number; variable_value: string }[]
  ): Promise<DocumentData> {
    const { dtid } = documentDataDto;
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
    const documentTemplate = await this.documentTemplateService.findActiveByDocumentType(document_type_id);
    documentDataDto['template_id'] = documentTemplate ? documentTemplate.id : null;
    const documentType = await this.documentTypeService.findById(document_type_id);
    const newDocumentData: DocumentData = this.documentDataRepository.create(documentDataDto);
    newDocumentData.document_type = documentType;
    const updatedDocumentData = await this.documentDataRepository.save(newDocumentData);

    const documentTypeProvisions: DocumentTypeProvision[] =
      await this.provisionService.getSimpleDocTypeProvisionsByDocTypeId(document_type_id);

    const documentDataProvisions = provisionArray.map(({ provision_id }) => {
      const documentProvision = documentProvisions.find((provision) => provision.id === provision_id);
      const documentDataProvision = new DocumentDataProvision();
      documentDataProvision.document_data = updatedDocumentData;
      documentDataProvision.document_type_provision = documentTypeProvisions.find(
        (dtp) => dtp.provision.id === provision_id
      );
      documentDataProvision.document_provision = documentProvision;
      return documentDataProvision;
    });
    const documentDataVariables = variableArray.map(({ variable_id, variable_value }) => {
      const documentVariable = documentVariables.find((variable) => variable.id === variable_id);
      const documentDataVariable = new DocumentDataVariable();
      documentDataVariable.document_data = updatedDocumentData;
      documentDataVariable.document_variable = documentVariable;
      documentDataVariable.data_variable_value = variable_value;
      return documentDataVariable;
    });
    if (documentData) {
      await this.deleteDataVarsAndProvs(documentData, provisionArray, variableArray);
    }

    await this.documentDataProvisionRepository.save(documentDataProvisions);
    await this.documentDataVariableRepository.save(documentDataVariables);

    return updatedDocumentData;
  }

  async updateDocumentData(
    documentDataDto: CreateDocumentDataDto,
    documentData: DocumentData,
    provisionArray: { provision_id: number; doc_type_provision_id: number }[],
    variableArray: { variable_id: number; variable_value: string }[],
    documentProvisions: Provision[],
    documentVariables: ProvisionVariable[]
  ): Promise<DocumentData> {
    // Update DocumentData entity
    documentData.template_id = documentDataDto.template_id;
    documentData.status = documentDataDto.status;
    documentData.update_userid = documentDataDto.create_userid;

    const updatedDocumentData = await this.documentDataRepository.save(documentData);

    // Update DocumentDataProvision entities
    for (const provision of provisionArray) {
      const documentDataProvision = documentData.document_data_provisions.find(
        (p) => p.document_provision.id === provision.provision_id
      );
      const documentProvision = documentProvisions.find((p) => p.id === provision.provision_id);
      const documentTypeProvision = await this.provisionService.getDocTypeProvisionById(
        provision.doc_type_provision_id
      );

      if (documentDataProvision) {
        // Update an existing DocumentDataProvision entry
        // await this.documentDataProvisionRepository.save(documentDataProvision);
      } else if (!documentDataProvision) {
        // No data found for this specific provision so create a new entry in DocumentDataProvision
        const documentProvisionToAdd = await this.documentProvisionRepository.findOneBy({
          id: provision.provision_id,
        });
        const newDocumentDataProvision: DocumentDataProvision = this.documentDataProvisionRepository.create({
          document_provision: documentProvisionToAdd,
          document_type_provision: documentTypeProvision,
          document_data: updatedDocumentData,
        });
        await this.documentDataProvisionRepository.save(newDocumentDataProvision);
      }
    }

    // Update DocumentDataVariable entities
    for (const variable of variableArray) {
      const documentDataVariable = documentData.document_data_variables.find(
        (v) => v.document_variable.id === variable.variable_id
      );

      if (documentDataVariable && documentDataVariable.data_variable_value != variable.variable_value) {
        // Update an existing DocumentDataVariable entry
        documentDataVariable.data_variable_value = variable.variable_value;
        await this.documentDataVariableRepository.save(documentDataVariable);
      } else if (!documentDataVariable) {
        // No data found for this specific variable so create a new entry in DocumentDataVariable
        const documentVariable = await this.documentProvisionVariableRepository.findOneBy({
          id: variable.variable_id,
        });
        const newDocumentDataVariable: DocumentDataVariable = this.documentDataVariableRepository.create({
          document_variable: documentVariable,
          document_data: updatedDocumentData,
          data_variable_value: variable.variable_value,
        });
        await this.documentDataVariableRepository.save(newDocumentDataVariable);
      }
    }
    await this.deleteDataVarsAndProvs(documentData, provisionArray, variableArray);

    return updatedDocumentData;
  }

  async deleteDataVarsAndProvs(
    documentData: DocumentData,
    provisionArray: { provision_id: number; doc_type_provision_id: number }[],
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

  // Used by the search page. *can probably be removed*
  async findAll(): Promise<DocumentData[]> {
    return await this.documentDataRepository.find({
      relations: ['document_type'],
    });
  }

  // Used by the search page. Filters document data for inactive doc types
  async findAllWithActiveDT(): Promise<DocumentData[]> {
    const documentData = await this.documentDataRepository.find({
      relations: ['document_type'],
    });
    return documentData.filter((data) => data.document_type.active === true);
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
    console.log(`document_type_id: ${document_type_id}, dtid: ${dtid}`);
    try {
      const documentData = await this.documentDataRepository.find({
        where: { dtid: dtid },
        relations: {
          document_data_provisions: {
            document_provision: true,
          },
          document_data_variables: {
            document_variable: true,
          },
          document_type: true,
        },
      });
      const filteredDocumentData = documentData.find((d) => d.document_type && d.document_type.id === document_type_id);
      const provisionIds =
        filteredDocumentData?.document_data_provisions?.map((dataProvision) => dataProvision.document_provision.id) ??
        [];
      const variableIds =
        filteredDocumentData?.document_data_variables?.map((dataVariable) => dataVariable.document_variable.id) ?? [];
      return { documentData: filteredDocumentData || null, provisionIds, variableIds };
    } catch (err) {
      console.log('Error in findDocumentDataByDocTypeIdAndDtid');
      console.log(err);
      return { documentData: null, provisionIds: [], variableIds: [] };
    }
  }

  async findViewByDocumentDataId(documentDataId: number): Promise<DocumentDataView> {
    return this.dataSource.manager.findOneBy(DocumentDataView, {
      DocumentDataId: documentDataId,
    });
  }

  // delete
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
        return { variables: [], variableIds: [] };
      }
      // saved variables attached to the documentData entry
      const existingDataVariables: DocumentDataVariable[] = documentData.document_data_variables;
      // all variables associated with the variant
      const variables: ProvisionVariable[] = await this.provisionService.getVariablesByDocumentTypeId();
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
      return { variables: [], variableIds: [] };
    }
  }

  /**
   * Gets all document type provisions (combined with global provision info), a list of preselected
   * provision ids, and any document_data_provisions and document_data_variables
   * that have been saved for this combination of DTID and document_type_id.
   *
   * Returns
   * @param document_type_id
   * @param dtid
   * @returns
   */
  async getProvisionsByDocTypeIdAndDtid(document_type_id: number, dtid: number) {
    try {
      const documentData: DocumentData = await this.documentDataRepository.findOne({
        where: { document_type: { id: document_type_id }, dtid: dtid },
      });
      const documentDataProvisions: DocumentDataProvision[] = await this.getDocumentDataProvisions(
        document_type_id,
        dtid
      );
      const documentDataVariables: DocumentDataVariable[] = await this.getDocumentDataVariables(document_type_id, dtid);
      const mappedVariables = documentDataVariables.map((ddv) => {
        return { id: ddv.id, variable_id: ddv.document_variable.id, saved_value: ddv.data_variable_value };
      });
      const variableIds: number[] = documentDataVariables.map((dataVariable) => dataVariable.document_variable.id);
      const documentTypeProvisions: DocumentTypeProvision[] = await this.getDocumentTypeProvisions(document_type_id);

      const provisionIds = documentDataProvisions.map((dataProvision) => dataProvision.document_provision.id);
      return {
        provisions: documentTypeProvisions,
        preselectedProvisionIds: provisionIds,
        preselectedVariableIds: variableIds,
        documentDataProvisions: documentDataProvisions,
        savedVariableInfo: mappedVariables,
      };
    } catch (err) {
      console.log('Error in getProvisionsByDocTypeIdAndDtid');
      console.log(err);
      return null;
    }
  }

  // helper function for getProvisionsByDocTypeIdAndDtid
  async getDocumentTypeProvisions(document_type_id: number): Promise<DocumentTypeProvision[]> {
    const documentTypeProvisions: DocumentTypeProvision[] =
      await this.provisionService.getDocumentTypeProvisionsByDocumentTypeId(document_type_id);
    return documentTypeProvisions;
  }

  // helper function for getProvisionsByDocTypeIdAndDtid
  async getDocumentDataProvisions(document_type_id: number, dtid: number): Promise<DocumentDataProvision[]> {
    const documentData: DocumentData = await this.documentDataRepository.findOne({
      where: { dtid: dtid, document_type: { id: document_type_id } },
      relations: ['document_data_provisions'],
    });
    if (documentData && documentData.id) {
      const documentDataProvisions: DocumentDataProvision[] = await this.documentDataProvisionRepository.find({
        where: { document_data: { id: documentData.id } },
        relations: ['document_type_provision', 'document_provision', 'document_data'],
      });
      return documentDataProvisions;
    } else {
      return [];
    }
  }

  // helper function for getProvisionsByDocTypeIdAndDtid
  async getDocumentDataVariables(document_type_id: number, dtid: number): Promise<DocumentDataVariable[]> {
    const documentData: DocumentData = await this.documentDataRepository.findOne({
      where: { dtid: dtid, document_type: { id: document_type_id } },
      relations: ['document_data_provisions'],
    });
    if (documentData && documentData.id) {
      const documentDataVariables: DocumentDataVariable[] = await this.documentDataVariableRepository.find({
        where: { document_data: { id: documentData.id } },
        relations: ['document_data', 'document_variable'],
      });
      return documentDataVariables;
    } else {
      return [];
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

  async removeByDocTypeId(document_type_id: number) {
    return this.documentDataRepository.delete({
      document_type: { id: document_type_id },
    });
  }
}
