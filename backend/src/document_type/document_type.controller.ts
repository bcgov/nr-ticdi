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
}