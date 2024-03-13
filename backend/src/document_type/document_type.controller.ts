import { Controller, Get, Param, UseFilters, UseGuards } from '@nestjs/common';
import { AuthenticationFilter } from 'src/authentication/authentication.filter';
import { AuthenticationGuard } from 'src/authentication/authentication.guard';
import { GenerateReportGuard } from 'src/authentication/generate-report.guard';
import { DocumentTypeService } from './document_type.service';

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

  @Get()
  findAll() {
    return this.documentTypeService.findAll();
  }
}
