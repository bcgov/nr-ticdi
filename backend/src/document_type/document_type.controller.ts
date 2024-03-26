import { Body, Controller, Get, Param, Post, Session, UseFilters, UseGuards } from '@nestjs/common';
import { AuthenticationFilter } from 'src/authentication/authentication.filter';
import { AuthenticationGuard } from 'src/authentication/authentication.guard';
import { GenerateReportGuard } from 'src/authentication/generate-report.guard';
import { DocumentTypeService } from './document_type.service';
import { SessionData } from 'utils/types';

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

  @Post('add')
  add(@Body() data: { name: string; created_by: string; created_date: string }, @Session() session: SessionData) {
    const create_userid = session?.activeAccount?.idir_username;
    console.log(data);
    return this.documentTypeService.add(data.name, data.created_by, data.created_date, create_userid);
  }

  @Post('update')
  update(
    @Body() data: { id: number; name: string; created_by: string; created_date: string },
    @Session() session: SessionData
  ) {
    const update_userid = session?.activeAccount?.idir_username;
    return this.documentTypeService.update(data.id, data.name, data.created_by, data.created_date, update_userid);
  }

  @Get('remove/:id')
  remove(@Param('id') id: number) {
    console.log('in remove');
    return this.documentTypeService.remove(id);
  }

  @Get()
  findAll() {
    return this.documentTypeService.findAll();
  }

  @Get('associate-doc-type/:provision_id/:document_type_id')
  associateDocType(@Param('provision_id') provision_id: number, @Param('document_type_id') document_type_id: number) {
    return this.documentTypeService.associateDocType(provision_id, document_type_id);
  }

  @Get('disassociate-doc-type/:provision_id/:document_type_id')
  disassociateDocType(
    @Param('provision_id') provision_id: number,
    @Param('document_type_id') document_type_id: number
  ) {
    return this.documentTypeService.disassociateDocType(+provision_id, document_type_id);
  }

  @Get('get-group-max/:document_type_id')
  getGroupMax(@Param('document_type_id') document_type_id: number) {
    return this.documentTypeService.getGroupMaxByDocTypeId(document_type_id);
  }

  @Get('get-all-mandatory-provisions/:id')
  getMandatoryProvisions() {
    return this.documentTypeService.getMandatoryProvisions();
  }

  @Get('get-manage-doc-type-provisions/:document_type_id')
  getManageDocTypeProvisions(@Param('document_type_id') document_type_id: number) {
    console.log('getManageDocTypeProvisions');
    return this.documentTypeService.getManageDocTypeProvisions(document_type_id);
  }
}
