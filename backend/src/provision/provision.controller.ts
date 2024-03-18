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

  // nestjs gets upset when there is no parameter, id is unused
  @Get('get-group-max/:id')
  getGroupMax(@Param('id') id: number) {
    return this.provisionService.getGroupMax();
  }

  @Get('get-all-mandatory-provisions/:id')
  getMandatoryProvisions() {
    return this.provisionService.getMandatoryProvisions();
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.provisionService.remove(id);
  }
}
