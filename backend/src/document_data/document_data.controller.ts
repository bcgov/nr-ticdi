import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProvisionJSON, VariableJSON } from 'src/types';
import { CreateDocumentDataDto } from './dto/create-document_data.dto';
import { DocumentDataService } from './document_data.service';
import { JwtAuthGuard } from 'src/auth/jwtauth.guard';

@Controller('document-data')
@UseGuards(JwtAuthGuard)
export class DocumentDataController {
  constructor(private readonly documentDataService: DocumentDataService) {}

  @Get()
  findAll() {
    return this.documentDataService.findAll();
  }

  @Get(':documentDataId')
  findById(@Param('documentDataId') documentDataId: number) {
    if (documentDataId && documentDataId != 0) {
      return this.documentDataService.findByDocumentDataId(documentDataId);
    } else {
      return null;
    }
  }

  @Get('dtid/:document_type_id/:dtid')
  findActiveByDtid(@Param('dtid') dtid: number, @Param('document_type_id') document_type_id: number) {
    return this.documentDataService.findDocumentDataByDocTypeIdAndDtid(document_type_id, dtid);
  }

  @Get('view/:documentDataId')
  findViewByPRDID(@Param('documentDataId') documentDataId: string) {
    return this.documentDataService.findViewByDocumentDataId(+documentDataId);
  }

  @Get('variables/:dtid/:document_type_id')
  getVariablesByDtidAndDocType(@Param('document_type_id') document_type_id: number, @Param('dtid') dtid: number) {
    return this.documentDataService.getVariablesByDtidAndDocType(dtid, document_type_id);
  }

  @Get('provisions/:document_type_id/:dtid')
  getProvisionsByDocTypeIdAndDtid(@Param('document_type_id') document_type_id: number, @Param('dtid') dtid: number) {
    return this.documentDataService.getProvisionsByDocTypeIdAndDtid(document_type_id, dtid);
  }

  @Get('get-enabled-provisions/:document_type_id/:dtid')
  getEnabledProvisionsByDocTypeIdAndDtid(
    @Param('document_type_id') document_type_id: number,
    @Param('dtid') dtid: number
  ) {
    return this.documentDataService.getEnabledProvisionsByDocTypeIdAndDtid(document_type_id, dtid);
  }

  @Delete(':dtid')
  remove(@Param('dtid') dtid: string) {
    return this.documentDataService.remove(+dtid);
  }
}
