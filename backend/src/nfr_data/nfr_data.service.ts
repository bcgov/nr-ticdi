import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NFRProvision } from "src/nfr_provision/entities/nfr_provision.entity";
import { NFRProvisionVariable } from "src/nfr_provision/entities/nfr_provision_variable.entity";
import { DataSource, In, Repository } from "typeorm";
import { CreateNFRDataDto } from "./dto/create-nfr_data.dto";
import { NFRData } from "./entities/nfr_data.entity";
import { NFRDataProvision } from "./entities/nfr_data_provision.entity";
import { NFRDataVariable } from "./entities/nfr_data_variable.entity";
import { NFRDataView } from "./entities/nfr_data_vw";
import { NFRProvisionService } from "src/nfr_provision/nfr_provision.service";
import { DocumentTemplateService } from "src/document_template/document_template.service";

@Injectable()
export class NFRDataService {
  constructor(
    @InjectRepository(NFRData)
    private nfrDataRepository: Repository<NFRData>,
    @InjectRepository(NFRProvision)
    private nfrProvisionRepository: Repository<NFRProvision>,
    @InjectRepository(NFRDataProvision)
    private nfrDataProvisionRepository: Repository<NFRDataProvision>,
    @InjectRepository(NFRProvisionVariable)
    private nfrProvisionVariableRepository: Repository<NFRProvisionVariable>,
    @InjectRepository(NFRDataVariable)
    private nfrDataVariableRepository: Repository<NFRDataVariable>,
    private nfrProvisionService: NFRProvisionService,
    private documentTemplateService: DocumentTemplateService,
    private dataSource: DataSource
  ) {}

  async createOrUpdate(
    nfrDataDto: CreateNFRDataDto,
    provisionArray: { provision_id: number; free_text: string }[],
    variableArray: { variable_id: number; variable_value: string }[]
  ): Promise<NFRData> {
    const { dtid, variant_name } = nfrDataDto;
    const nfrData: NFRData = await this.nfrDataRepository.findOne({
      where: { dtid: dtid, variant_name: variant_name },
      relations: [
        "nfr_data_variables",
        "nfr_data_provisions",
        "nfr_data_variables.nfr_variable",
        "nfr_data_provisions.nfr_provision",
      ],
    });

    const nfrProvisionIds = provisionArray.map(
      ({ provision_id }) => provision_id
    );
    const nfrProvisions = await this.nfrProvisionRepository.findBy({
      id: In(nfrProvisionIds),
    });
    const nfrVariableIds = variableArray.map(({ variable_id }) => variable_id);
    const nfrVariables = await this.nfrProvisionVariableRepository.findBy({
      id: In(nfrVariableIds),
    });

    // if nfrData for this dtid+template exists, update it
    if (nfrData) {
      return await this.updateNfrData(
        nfrDataDto,
        nfrData,
        provisionArray,
        variableArray,
        nfrProvisions,
        nfrVariables
      );
    }
    // else create new nfrData
    const documentTemplate =
      await this.documentTemplateService.findActiveByDocumentType(
        nfrDataDto.variant_name
      );
    nfrDataDto["template_id"] = documentTemplate ? documentTemplate.id : null;
    const newNfrData: NFRData = this.nfrDataRepository.create(nfrDataDto);
    const updatedNfrData = await this.nfrDataRepository.save(newNfrData);

    const nfrDataProvisions = provisionArray.map(
      ({ provision_id, free_text }) => {
        const nfrProvision = nfrProvisions.find(
          (provision) => provision.id === provision_id
        );
        const nfrDataProvision = new NFRDataProvision();
        nfrDataProvision.nfr_data = updatedNfrData;
        nfrDataProvision.nfr_provision = nfrProvision;
        nfrDataProvision.provision_free_text = nfrProvision.free_text; // quick fix to not use the free_text from the nfr page
        return nfrDataProvision;
      }
    );
    const nfrDataVariables = variableArray.map(
      ({ variable_id, variable_value }) => {
        const nfrVariable = nfrVariables.find(
          (variable) => variable.id === variable_id
        );
        const nfrDataVariable = new NFRDataVariable();
        nfrDataVariable.nfr_data = updatedNfrData;
        nfrDataVariable.nfr_variable = nfrVariable;
        nfrDataVariable.data_variable_value = variable_value;
        return nfrDataVariable;
      }
    );
    if (nfrData) {
      await this.deleteDataVarsAndProvs(nfrData, provisionArray, variableArray);
    }

    await this.nfrDataProvisionRepository.save(nfrDataProvisions);
    await this.nfrDataVariableRepository.save(nfrDataVariables);

    await this.makeActive(newNfrData.dtid, newNfrData.variant_name);

    return updatedNfrData;
  }

  async updateNfrData(
    nfrDataDto: CreateNFRDataDto,
    nfrData: NFRData,
    provisionArray: { provision_id: number; free_text: string }[],
    variableArray: { variable_id: number; variable_value: string }[],
    nfrProvisions: NFRProvision[],
    nfrVariables: NFRProvisionVariable[]
  ): Promise<NFRData> {
    // Update NFRData entity
    nfrData.variant_name = nfrDataDto.variant_name;
    nfrData.template_id = nfrDataDto.template_id;
    nfrData.status = nfrDataDto.status;
    nfrData.update_userid = nfrDataDto.create_userid;

    const updatedNfrData = await this.nfrDataRepository.save(nfrData);
    await this.makeActive(nfrData.dtid, nfrData.variant_name);

    // Update NFRDataProvision entities
    for (const provision of provisionArray) {
      const nfrDataProvision = nfrData.nfr_data_provisions.find(
        (p) => p.nfr_provision.id === provision.provision_id
      );
      const nfrProvision = nfrProvisions.find(
        (p) => p.id === provision.provision_id
      );

      if (
        nfrDataProvision &&
        nfrDataProvision.provision_free_text != nfrProvision.free_text
      ) {
        // Update an existing NFRDataProvision entry
        nfrDataProvision.provision_free_text = nfrProvision.free_text;
        await this.nfrDataProvisionRepository.save(nfrDataProvision);
      } else if (!nfrDataProvision) {
        // No data found for this specific provision so create a new entry in NFRDataProvision
        const nfrProvisionToAdd = await this.nfrProvisionRepository.findOneBy({
          id: provision.provision_id,
        });
        const newNfrDataProvision: NFRDataProvision =
          this.nfrDataProvisionRepository.create({
            nfr_provision: nfrProvisionToAdd,
            nfr_data: updatedNfrData,
            provision_free_text: nfrProvisionToAdd.free_text, // quick fix
          });
        await this.nfrDataProvisionRepository.save(newNfrDataProvision);
      }
    }

    // Update NFRDataVariable entities
    for (const variable of variableArray) {
      const nfrDataVariable = nfrData.nfr_data_variables.find(
        (v) => v.nfr_variable.id === variable.variable_id
      );

      if (
        nfrDataVariable &&
        nfrDataVariable.data_variable_value != variable.variable_value
      ) {
        // Update an existing NFRDataVariable entry
        nfrDataVariable.data_variable_value = variable.variable_value;
        await this.nfrDataVariableRepository.save(nfrDataVariable);
      } else if (!nfrDataVariable) {
        // No data found for this specific variable so create a new entry in NFRDataVariable
        const nfrVariable = await this.nfrProvisionVariableRepository.findOneBy(
          {
            id: variable.variable_id,
          }
        );
        const newNfrDataVariable: NFRDataVariable =
          this.nfrDataVariableRepository.create({
            nfr_variable: nfrVariable,
            nfr_data: updatedNfrData,
            data_variable_value: variable.variable_value,
          });
        await this.nfrDataVariableRepository.save(newNfrDataVariable);
      }
    }
    await this.deleteDataVarsAndProvs(nfrData, provisionArray, variableArray);

    return updatedNfrData;
  }

  async deleteDataVarsAndProvs(
    nfrData: NFRData,
    provisionArray: { provision_id: number; free_text: string }[],
    variableArray: { variable_id: number; variable_value: string }[]
  ) {
    // Delete data provisions that have been removed by the user
    const oldProvisionIds = nfrData
      ? nfrData.nfr_data_provisions.map(
          (dataProvision) => dataProvision.nfr_provision.id
        )
      : [];
    const newProvisionIds = provisionArray.map(
      ({ provision_id }) => provision_id
    );
    const provisionsToDelete = oldProvisionIds.filter(
      (item) => !newProvisionIds.includes(item)
    );
    const nfrDataProvisionsToDelete = nfrData.nfr_data_provisions
      .filter((dataProvision) =>
        provisionsToDelete.includes(dataProvision.nfr_provision.id)
      )
      .map((dataProvision) => dataProvision.id);
    if (nfrDataProvisionsToDelete.length > 0) {
      await this.nfrDataProvisionRepository.delete(nfrDataProvisionsToDelete);
    }

    // Delete data variables that have been removed by the user
    const oldVariableIds = nfrData
      ? nfrData.nfr_data_variables.map(
          (dataVariable) => dataVariable.nfr_variable.id
        )
      : [];
    const newVariableIds = variableArray.map(({ variable_id }) => variable_id);
    const variablesToDelete = oldVariableIds.filter(
      (item) => !newVariableIds.includes(item)
    );
    const nfrDataVariablesToDelete = nfrData.nfr_data_variables
      .filter((dataVariable) =>
        variablesToDelete.includes(dataVariable.nfr_variable.id)
      )
      .map((dataVariable) => dataVariable.id);
    if (nfrDataVariablesToDelete.length > 0) {
      await this.nfrDataVariableRepository.delete(nfrDataVariablesToDelete);
    }
    return null;
  }

  // Used by the search page.
  // Variant data is persisted so only return the active variant foreach dtid.
  async findAll(): Promise<NFRData[]> {
    return await this.nfrDataRepository.find({
      where: {
        active: true,
      },
    });
  }

  async findByNfrDataId(nfrDataId: number): Promise<{
    nfrData: NFRData;
    provisionIds: number[];
    variableIds: number[];
  }> {
    try {
      const nfrData = await this.nfrDataRepository.findOne({
        where: { id: nfrDataId },
        join: {
          alias: "nfr_data",
          leftJoinAndSelect: {
            nfr_data_provisions: "nfr_data.nfr_data_provisions",
            nfr_provision: "nfr_data_provisions.nfr_provision",
            nfr_data_variables: "nfr_data.nfr_data_variables",
            nfr_variable: "nfr_data_variables.nfr_variable",
          },
        },
      });
      const existingDataProvisions = nfrData.nfr_data_provisions;
      const provisionIds = existingDataProvisions.map(
        (dataProvision) => dataProvision.nfr_provision.id
      );
      const existingDataVariables = nfrData.nfr_data_variables;
      const variableIds = existingDataVariables.map(
        (dataVariable) => dataVariable.nfr_variable.id
      );
      return { nfrData, provisionIds, variableIds };
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async findActiveByDtid(dtid: number): Promise<{
    nfrData: NFRData;
    provisionIds: number[];
    variableIds: number[];
  }> {
    try {
      const nfrData = await this.nfrDataRepository.findOne({
        where: { dtid: dtid, active: true },
        join: {
          alias: "nfr_data",
          leftJoinAndSelect: {
            nfr_data_provisions: "nfr_data.nfr_data_provisions",
            nfr_provision: "nfr_data_provisions.nfr_provision",
            nfr_data_variables: "nfr_data.nfr_data_variables",
            nfr_variable: "nfr_data_variables.nfr_variable",
          },
        },
      });
      const provisionIds =
        nfrData && nfrData.nfr_data_provisions
          ? nfrData.nfr_data_provisions.map(
              (dataProvision) => dataProvision.nfr_provision.id
            )
          : [];
      const variableIds =
        nfrData && nfrData.nfr_data_variables
          ? nfrData.nfr_data_variables.map(
              (dataVariable) => dataVariable.nfr_variable.id
            )
          : [];
      return { nfrData, provisionIds, variableIds };
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async findViewByNFRDataId(nfrDataId: number): Promise<NFRDataView> {
    return this.dataSource.manager.findOneBy(NFRDataView, {
      NFRDataId: nfrDataId,
    });
  }

  async getVariablesByVariantAndDtid(variantName: string, dtid: number) {
    const nfrData: NFRData = await this.nfrDataRepository.findOne({
      where: { dtid: dtid, variant_name: variantName },
      join: {
        alias: "nfr_data",
        leftJoinAndSelect: {
          nfr_data_variables: "nfr_data.nfr_data_variables",
          nfr_variable: "nfr_data_variables.nfr_variable",
        },
      },
    });
    // if the nfrData doesn't exist yet, return null. This null value is caught elsewhere.
    if (!nfrData) {
      return null;
    }
    // saved variables attached to the nfrData entry
    const existingDataVariables: NFRDataVariable[] = nfrData.nfr_data_variables;
    // all variables associated with the variant
    const variables: NFRProvisionVariable[] =
      await this.nfrProvisionService.getVariablesByVariant(
        nfrData.variant_name
      );
    // inserting the existing variable_values to the set of all variables
    for (const variable of variables) {
      const existingDataVariable = existingDataVariables.find(
        (dataVariable) => dataVariable.nfr_variable.id === variable.id
      );
      if (existingDataVariable) {
        variable.variable_value = existingDataVariable.data_variable_value;
      }
    }
    const variableIds = existingDataVariables.map(
      (dataVariable) => dataVariable.nfr_variable.id
    );
    return { variables, variableIds };
  }

  async getProvisionsByVariantAndDtid(variantName: string, dtid: number) {
    const nfrData: NFRData = await this.nfrDataRepository.findOne({
      where: { dtid: dtid, variant_name: variantName },
      join: {
        alias: "nfr_data",
        leftJoinAndSelect: {
          nfr_data_provisions: "nfr_data.nfr_data_provisions",
          nfr_provision: "nfr_data_provisions.nfr_provision",
        },
      },
    });
    // if the nfrData doesn't exist yet, return null. This null value is caught elsewhere.
    if (!nfrData) {
      return null;
    }
    // nfrData for all variants of this dtid
    const fullNfrData: NFRData[] = await this.nfrDataRepository.find({
      where: { dtid: nfrData.dtid },
      join: {
        alias: "nfr_data",
        leftJoinAndSelect: {
          nfr_data_provisions: "nfr_data.nfr_data_provisions",
          nfr_provision: "nfr_data_provisions.nfr_provision",
        },
      },
    });

    // saved provisions attached to the dtid
    const existingDataProvisions: NFRDataProvision[] = [];
    fullNfrData.forEach((nfrData) => {
      existingDataProvisions.push(...nfrData.nfr_data_provisions);
    });
    // all provisions
    const provisions: NFRProvision[] =
      await this.nfrProvisionService.getAllProvisions();
    const provisionIds = existingDataProvisions.map(
      (dataProvision) => dataProvision.nfr_provision.id
    );
    return { provisions, provisionIds };
  }

  async getEnabledProvisionsByVariantAndDtid(
    variantName: string,
    dtid: number
  ) {
    const nfrData: NFRData = await this.nfrDataRepository.findOne({
      where: { variant_name: variantName, dtid: dtid },
      join: {
        alias: "nfr_data",
        leftJoinAndSelect: {
          nfr_data_provisions: "nfr_data.nfr_data_provisions",
          nfr_provision: "nfr_data_provisions.nfr_provision",
        },
      },
    });
    const provisionIds =
      nfrData && nfrData.nfr_data_provisions
        ? nfrData.nfr_data_provisions.map(
            (dataProvision) => dataProvision.nfr_provision.id
          )
        : [];
    return provisionIds;
  }

  async remove(dtid: number): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.nfrDataRepository.delete({ dtid: dtid });
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }

  async makeActive(dtid: number, variant_name: string): Promise<any> {
    await this.nfrDataRepository.update({ dtid: dtid }, { active: false });
    await this.nfrDataRepository.update(
      { dtid: dtid, variant_name: variant_name },
      { active: true }
    );
  }
}
