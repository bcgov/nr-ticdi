import {
  Get,
  Controller,
  StreamableFile,
  Header,
  Body,
  Post,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { IdirObject, ProvisionJSON, VariableJSON } from 'src/types';
import { TTLSService } from '../ttls/ttls.service';
import { AxiosRequestConfig } from 'axios';
import { ReportService } from './report.service';
import { firstValueFrom } from 'rxjs';
import { User } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwtauth.guard';
import { JwtRoleGuard } from 'src/auth/jwtrole.guard';
import { Role } from 'src/enum/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorator';

let requestUrl: string;
let requestConfig: AxiosRequestConfig;
//
@UseGuards(JwtAuthGuard)
@Controller('report')
export class ReportController {
  constructor(private readonly ttlsService: TTLSService, private readonly reportService: ReportService) {
    const hostname = process.env.backend_url ? process.env.backend_url : `http://localhost`;
    const port = process.env.backend_url ? 3000 : 3001;
    requestUrl = `${hostname}:${port}/document-template/`;
    requestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  // Gets data from ttls route for displaying on report page
  @Get('get-data/:dtid')
  async getData(@Param('dtid') dtid: number) {
    await this.ttlsService.setWebadeToken();
    const response: any = await firstValueFrom(this.ttlsService.callHttp(dtid))
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log('callHttp failed');
        console.log(err);
        console.log(err.response.data);
        const errorMessage = `Disposition Transaction not found with id ${dtid}`;
        throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
      });
    return response;
  }

  @Get('get-document-data/:document_type_id/:dtid')
  getDocumentDataByDocTypeIdAndDtid(@Param('document_type_id') document_type_id: number, @Param('dtid') dtid: number) {
    return this.reportService.getDocumentDataByDocTypeIdAndDtid(document_type_id, dtid);
  }

  @Get('get-report-name/:dtid/:tfn/:document_type_id')
  getReportNameNew(
    @Param('dtid') dtid: number,
    @Param('tfn') tenure_file_number: string,
    @Param('document_type_id') document_type_id: number
  ): Promise<{ reportName: string }> {
    return this.reportService.generateReportName(dtid, tenure_file_number, document_type_id);
  }

  // remember to update
  @Post('generate-report')
  @UseGuards(JwtRoleGuard)
  @Roles(Role.GENERATE_DOCUMENTS)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  @Header('Content-Disposition', 'attachment; filename=report.docx')
  async generateReport(
    @User() user: IdirObject,
    @Body()
    data: {
      dtid: number;
      document_type_id: number;
      variableJson: VariableJSON[];
      provisionJson: ProvisionJSON[];
    }
  ) {
    const idir_username = user && user.idir_username ? user.idir_username : '';
    const idir_full_name = user && user.given_name && user.family_name ? `${user.given_name} ${user.family_name}` : '';
    return new StreamableFile(
      await this.reportService.generateReport(
        data.dtid,
        data.document_type_id,
        idir_username,
        idir_full_name,
        data.variableJson,
        data.provisionJson
      )
    );
  }

  @Get('get-group-max/:document_type_id')
  getGroupMaxByVariant(@Param('document_type_id') document_type_id: number) {
    return this.reportService.getGroupMaxByDocTypeId(document_type_id);
  }

  @Get('get-all-groups')
  getAllGroups() {
    return this.reportService.getAllGroups();
  }

  @Get('provisions/:document_type_id/:dtid')
  getDocumentProvisionsByDocumentTypeId(
    @Param('document_type_id') document_type_id: number,
    @Param('dtid') dtid: number
  ): any {
    return this.reportService.getDocumentProvisionsByDocTypeIdAndDtid(document_type_id, dtid);
  }

  @Get('get-provision-variables/:document_type_id/:dtid')
  async getDocumentVariablesByDocumentTypeIdAndDtid(
    @Param('document_type_id') document_type_id: number,
    @Param('dtid') dtid: number
  ) {
    const variables = await this.reportService.getDocumentVariablesByDocumentTypeIdAndDtid(document_type_id, dtid);
    return variables;
  }

  @Post('save-document')
  saveDocument(
    @User() user: IdirObject,
    @Body()
    data: {
      dtid: number;
      document_type_id: number;
      status: string;
      provisionArray: { provision_id: number; doc_type_provision_id: number }[];
      variableArray: VariableJSON[];
    }
  ) {
    let idir_username = user && user.idir_username ? user.idir_username : '';
    return this.reportService.saveDocument(
      data.dtid,
      data.document_type_id,
      data.status,
      data.provisionArray,
      data.variableArray,
      idir_username
    );
  }

  @Get('enabled-provisions/:document_type_id')
  getEnabledProvisionsByDocTypeId(@Param('document_type_id') document_type_id: number) {
    return this.reportService.getEnabledProvisionsByDocTypeId(document_type_id);
  }

  @Get('enabled-provisions2/:document_type_id/:dtid')
  getEnabledProvisionsByDocumentTypeIdDtid(
    @Param('document_type_id') document_type_id: number,
    @Param('dtid') dtid: number
  ) {
    return this.reportService.getEnabledProvisionsByDocTypeIdDtid(document_type_id, dtid);
  }

  @Get('search-document-data')
  getDocumentData() {
    return this.reportService.getDocumentData();
  }

  @Get('get-mandatory-provisions-by-document-type-id/:document_type_id')
  getMandatoryProvisionsByDocumentTypeId(@Param('document_type_id') document_type_id: number) {
    return this.reportService.getMandatoryProvisionsByDocumentTypeId(document_type_id);
  }

  @Get('healthcheck')
  @Public()
  getHealthCheck() {
    return '';
  }
}
