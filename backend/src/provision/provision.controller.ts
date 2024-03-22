import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateProvisionDto } from './dto/create-provision.dto';
import { ProvisionService } from './provision.service';

@Controller('provision')
export class ProvisionController {
  constructor(private readonly provisionService: ProvisionService) {}

  @Post()
  async create(
    @Body()
    provision: CreateProvisionDto
  ) {
    return this.provisionService.create(provision);
  }

  // @Post('update')
  // async update(@Body() provision: CreateProvisionDto & { id: number }) {
  //   const id = provision.id;
  //   delete provision['id'];
  //   return this.provisionService.update(id, provision);
  // }

  @Post('add-variable')
  async addVariable(
    @Body()
    variable: {
      variable_name: string;
      variable_value: string;
      help_text: string;
      provision_id: number;
      create_userid: string;
    }
  ) {
    return this.provisionService.addVariable(variable);
  }

  @Post('update-variable')
  async updateVariable(
    @Body()
    variable: {
      variable_name: string;
      variable_value: string;
      help_text: string;
      provision_id: number;
      id: number;
      update_userid: string;
    }
  ) {
    return this.provisionService.updateVariable(variable);
  }

  @Get('remove-variable/:id')
  async removeVariable(@Param('id') id: number) {
    return this.provisionService.removeVariable(id);
  }

  @Get()
  findAll() {
    return this.provisionService.findAll();
  }

  @Get('variables')
  findAllVariables() {
    return this.provisionService.findAllVariables();
  }

  @Get(':provisionId')
  findById(@Param('provisionId') provisionId: number) {
    if (provisionId && provisionId != 0) {
      return this.provisionService.findById(provisionId);
    } else {
      return null;
    }
  }

  @Get('enable/:id')
  enableProvision(@Param('id') id: number) {
    return this.provisionService.enable(id);
  }

  @Get('disable/:id')
  disableProvision(@Param('id') id: number) {
    return this.provisionService.disable(id);
  }

  @Get('get-group-max/:document_type_id')
  getGroupMax(@Param('document_type_id') document_type_id: number) {
    return this.provisionService.getGroupMaxByDocTypeId(document_type_id);
  }

  @Get('get-all-mandatory-provisions/:id')
  getMandatoryProvisions() {
    return this.provisionService.getMandatoryProvisions();
  }

  @Get('remove/:id')
  remove(@Param('id') id: number) {
    return this.provisionService.remove(id);
  }

  @Get('get-manage-doc-type-provisions/:document_type_id')
  getManageDocTypeProvisions(@Param('document_type_id') document_type_id: number) {
    return this.provisionService.getManageDocTypeProvisions(document_type_id);
  }

  @Get('associate-doc-type/:provision_id/:document_type_id')
  associateDocType(@Param('provision_id') provision_id: number, @Param('document_type_id') document_type_id: number) {
    return this.provisionService.associateDocType(provision_id, document_type_id);
  }

  @Get('disassociate-doc-type/:provision_id/:document_type_id')
  disassociateDocType(
    @Param('provision_id') provision_id: number,
    @Param('document_type_id') document_type_id: number
  ) {
    return this.provisionService.disassociateDocType(+provision_id, document_type_id);
  }
}
