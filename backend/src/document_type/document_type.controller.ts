import { Body, Controller, Get, Param, Post, Session, UseFilters, UseGuards } from '@nestjs/common';
import { AuthenticationFilter } from 'src/authentication/authentication.filter';
import { AuthenticationGuard } from 'src/authentication/authentication.guard';
import { GenerateReportGuard } from 'src/authentication/generate-report.guard';
import { DocumentTypeService } from './document_type.service';
import { SessionData } from 'utils/types';
import { ProvisionGroup } from './entities/provision_group.entity';

// @UseFilters(AuthenticationFilter)
// @UseGuards(AuthenticationGuard)
// @UseGuards(GenerateReportGuard)
@Controller('document-type')
export class DocumentTypeController {
  constructor(private documentTypeService: DocumentTypeService) {}

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.documentTypeService.findById(id);
  }

  // Add is done through Admin controller due to circular dependency issues

  @Post('update')
  update(
    @Body() data: { id: number; name: string; created_by: string; created_date: string },
    @Session() session: SessionData
  ) {
    const update_userid = session?.activeAccount?.idir_username;
    return this.documentTypeService.update(data.id, data.name, data.created_by, data.created_date, update_userid);
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

  @Get('remove-provision-group/:provision_group_id')
  removeProvisionGroup(@Param('provision_group_id') provision_group_id: number) {
    return this.documentTypeService.removeProvisionGroup(provision_group_id);
  }
}
