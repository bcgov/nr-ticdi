import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DocumentTypeService } from './document_type.service';
import { IdirObject } from 'src/types';
import { ProvisionGroup } from './entities/provision_group.entity';
import { User } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwtauth.guard';

@UseGuards(JwtAuthGuard)
@Controller('document-type')
export class DocumentTypeController {
  constructor(private documentTypeService: DocumentTypeService) {}

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.documentTypeService.findById(id);
  }

  @Post('update')
  update(
    @Body() data: { id: number; name: string; created_by: string; created_date: string },
    @User() user: IdirObject
  ) {
    return this.documentTypeService.update(data.id, data.name, data.created_by, data.created_date, user.idir_username);
  }

  @Get()
  findAll() {
    return this.documentTypeService.findAll();
  }

  @Get('get-group-max/:document_type_id')
  getGroupMaxByDocTypeId(@Param('document_type_id') document_type_id: number) {
    return this.documentTypeService.getGroupMaxByDocTypeId(document_type_id);
  }

  @Post('add-provision-group')
  addProvisionGroup(
    @Body() data: { provision_group: number; provision_group_text: string; max: number; document_type_id: number }
  ) {
    return this.documentTypeService.addProvisionGroup(
      data.provision_group,
      data.provision_group_text,
      data.max,
      data.document_type_id
    );
  }

  @Post('update-provision-groups')
  updateProvisionGroups(@Body() data: { document_type_id: number; provision_groups: ProvisionGroup[] }) {
    return this.documentTypeService.updateProvisionGroups(data.document_type_id, data.provision_groups);
  }

  @Post('remove-provision-group')
  removeProvisionGroup(@Body() data: { provision_group_id: number }) {
    console.log('provision_group_id: ' + data.provision_group_id);
    return this.documentTypeService.removeProvisionGroup(data.provision_group_id);
  }
}
