import { Body, Controller, Get, Param, Post, Session } from '@nestjs/common';
import { CreateProvisionDto } from './dto/create-provision.dto';
import { ProvisionService } from './provision.service';
import { ManageDocTypeProvision, SessionData } from 'src/types';

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

  @Get()
  findAll() {
    return this.provisionService.findAll();
  }

  @Get('variables')
  findAllVariables() {
    return this.provisionService.findAllVariables();
  }

  @Post('add')
  addProvision(
    @Body()
    provisionParams: {
      provision: string;
      free_text: string;
      help_text: string;
      category: string;
    },
    @Session() session: { data?: SessionData }
  ) {
    const create_userid = session?.data?.activeAccount.idir_username;
    return this.provisionService.create({ ...provisionParams, create_userid });
  }

  @Post('update')
  updateProvision(
    @Body()
    provisionParams: {
      id: number;
      provision: string;
      free_text: string;
      help_text: string;
      category: string;
    },
    @Session() session: { data?: SessionData }
  ) {
    const update_userid = session?.data?.activeAccount.idir_username;
    const { id, ...paramsMinusId } = provisionParams;
    return this.provisionService.update(id, {
      ...paramsMinusId,
      update_userid,
    });
  }

  @Get('remove/:id')
  removeProvision(@Param('id') id: number) {
    return this.provisionService.remove(id);
  }

  @Post('add-variable')
  async addVariable(
    @Body()
    variable: {
      variable_name: string;
      variable_value: string;
      help_text: string;
      provision_id: number;
    },
    @Session() session: { data?: SessionData }
  ) {
    const create_userid = session?.data?.activeAccount.idir_username;
    return this.provisionService.addVariable({ ...variable, create_userid });
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
    },
    @Session() session: { data?: SessionData }
  ) {
    const update_userid = session?.data?.activeAccount.idir_username;
    return this.provisionService.updateVariable({ ...variable, update_userid });
  }

  @Get('remove-variable/:id')
  async removeVariable(@Param('id') id: number) {
    return this.provisionService.removeVariable(id);
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

  /**
   * Document Type Provisions
   */
  @Get('get-all-mandatory-provisions/:id')
  getMandatoryProvisions(@Param('id') document_type_id: number) {
    return this.provisionService.getMandatoryProvisionsByDocumentTypeId(document_type_id);
  }

  @Get('get-manage-doc-type-provisions/:id')
  getManageDocTypeProvisions(@Param('id') document_type_id: number) {
    console.log('getManageDocTypeProvisions');
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

  @Post('update-manage-doc-type-provisions')
  updateManageDocTypeProvisions(@Body() data: { document_type_id: number; provisions: ManageDocTypeProvision[] }) {
    console.log('~~~~~~');
    console.log(data.document_type_id);
    console.log(data.provisions);
    console.log('~~~~~~');
    return this.provisionService.updateManageDocTypeProvisions(data.document_type_id, data.provisions);
  }
}
