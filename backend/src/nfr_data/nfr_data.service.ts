import { Injectable } from "@nestjs/common";
import { NotFoundException } from "@nestjs/common/exceptions";
import { InjectRepository } from "@nestjs/typeorm";
import { NFRProvision } from "src/nfr_provision/entities/nfr_provision.entity";
import { NFRProvisionVariable } from "src/nfr_provision/entities/nfr_provision_variable.entity";
import { DataSource, In, Repository } from "typeorm";
import { CreateNFRDataDto } from "./dto/create-nfr_data.dto";
import { NFRData } from "./entities/nfr_data.entity";
import { NFRDataProvision } from "./entities/nfr_data_provision.entity";
import { NFRDataVariable } from "./entities/nfr_data_variable.entity";
import { NFRDataView } from "./entities/nfr_data_vw";

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
    private dataSource: DataSource
  ) {}

  async createOrUpdate(
    nfrDataDto: CreateNFRDataDto,
    provisionArray: { provision_id: number; free_text: string }[],
    variableArray: { variable_id: number; variable_value: string }[]
  ): Promise<NFRData> {
    const { dtid } = nfrDataDto;
    let nfrData: NFRData = await this.nfrDataRepository.findOneBy({ dtid });
    if (nfrData) {
      return await this.updateNfrData(
        dtid,
        nfrDataDto,
        provisionArray,
        variableArray
      );
    }
    const newNfrData: NFRData = this.nfrDataRepository.create(nfrDataDto);
    nfrData = await this.nfrDataRepository.save(newNfrData);

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

    const nfrDataProvisions = provisionArray.map(
      ({ provision_id, free_text }) => {
        const nfrProvision = nfrProvisions.find(
          (provision) => provision.id === provision_id
        );
        const nfrDataProvision = new NFRDataProvision();
        nfrDataProvision.nfr_data = nfrData;
        nfrDataProvision.nfr_provision = nfrProvision;
        nfrDataProvision.provision_free_text = free_text;
        return nfrDataProvision;
      }
    );
    const nfrDataVariables = variableArray.map(
      ({ variable_id, variable_value }) => {
        const nfrVariable = nfrVariables.find(
          (variable) => variable.id === variable_id
        );
        const nfrDataVariable = new NFRDataVariable();
        nfrDataVariable.nfr_data = nfrData;
        nfrDataVariable.nfr_variable = nfrVariable;
        nfrDataVariable.data_variable_value = variable_value;
        return nfrDataVariable;
      }
    );

    await this.nfrDataProvisionRepository.save(nfrDataProvisions);
    await this.nfrDataVariableRepository.save(nfrDataVariables);

    return nfrData;
  }

  async updateNfrData(
    dtid: number,
    nfrDataDto: CreateNFRDataDto,
    provisionArray: { provision_id: number; free_text: string }[],
    variableArray: { variable_id: number; variable_value: string }[]
  ): Promise<NFRData> {
    const nfrData = await this.nfrDataRepository.findOne({
      where: { dtid },
      relations: [
        "nfr_data_variables",
        "nfr_data_provisions",
        "nfr_data_variables.nfr_variable",
        "nfr_data_provisions.nfr_provision",
      ],
    });

    if (!nfrData) {
      throw new NotFoundException(`NFRData with dtid ${dtid} not found`);
    }

    // Update NFRData entity
    nfrData.variant_name = nfrDataDto.variant_name;
    nfrData.template_id = nfrDataDto.template_id;
    nfrData.status = nfrDataDto.status;
    nfrData.update_userid = nfrDataDto.create_userid;

    // Update NFRDataProvision entities
    for (const provision of provisionArray) {
      const nfrDataProvision = nfrData.nfr_data_provisions.find(
        (p) => p.nfr_provision.id === provision.provision_id
      );

      if (
        nfrDataProvision &&
        nfrDataProvision.provision_free_text != provision.free_text
      ) {
        nfrDataProvision.provision_free_text = provision.free_text;
        await this.nfrDataProvisionRepository.save(nfrDataProvision);
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
        nfrDataVariable.data_variable_value = variable.variable_value;
        await this.nfrDataVariableRepository.save(nfrDataVariable);
      }
    }

    return this.nfrDataRepository.save(nfrData);
  }

  async findAll(): Promise<NFRData[]> {
    return await this.nfrDataRepository.find();
  }

  async findByNfrDataId(nfrDataId: number): Promise<NFRData> {
    try {
      return this.nfrDataRepository.findOneBy({
        id: nfrDataId,
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async findByDtid(dtid: number): Promise<NFRData> {
    try {
      return dtid != null
        ? this.nfrDataRepository.findOneBy({ dtid: dtid })
        : null;
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

  // TODO - enabled provisions logic has changed, this will need to be changed
  async getEnabledProvisions(id: number): Promise<number[]> {
    const nfrData = await this.nfrDataRepository.findOne({
      where: { id: id },
      relations: ["nfr_data_provisions"],
    });
    // return nfrData.enabled_provisions;
    return null;
  }

  async remove(dtid: number): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.nfrDataRepository.delete({ dtid: dtid });
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
