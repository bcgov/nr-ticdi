import { Body, Controller, Delete, Get, Param, Post, Session } from '@nestjs/common';
import { CreateProvisionDto } from './dto/create-provision.dto';
import { ProvisionService } from './provision.service';
import { SessionData } from 'utils/types';

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
}
