import {
  Get,
  Controller,
  StreamableFile,
  Header,
  Session,
  Body,
  Post,
  Param,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { ProvisionJSON, SessionData, VariableJSON } from 'utils/types';
import { TTLSService } from '../ttls/ttls.service';
import { AxiosRequestConfig } from 'axios';
import { AuthenticationFilter } from 'src/authentication/authentication.filter';
import { AuthenticationGuard } from 'src/authentication/authentication.guard';
import { GenerateReportGuard } from 'src/authentication/generate-report.guard';
import { ReportService } from './report.service';
import { firstValueFrom } from 'rxjs';

let requestUrl: string;
let requestConfig: AxiosRequestConfig;

// @UseFilters(AuthenticationFilter)
// @UseGuards(AuthenticationGuard)
// @UseGuards(GenerateReportGuard)
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
  async getData(@Session() session: { data?: SessionData }, @Param('dtid') dtid: number) {
    await this.ttlsService.setWebadeToken();
    const response: any = await firstValueFrom(this.ttlsService.callHttp(dtid))
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log('callHttp failed');
        console.log(err);
        console.log(err.response.data);
      });
    return response;
  }

  @Get('get-document-data/:document_type_id/:dtid')
  getDocumentDataByDocTypeIdAndDtid(
    @Session() session: { data?: SessionData },
    @Param('document_type_id') document_type_id: number,
    @Param('dtid') dtid: number
  ) {
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
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  @Header('Content-Disposition', 'attachment; filename=report.docx')
  async generateReport(
    @Session() session: { data: SessionData },
    @Body()
    data: {
      dtid: number;
      document_type_id: number;
      variableJson: VariableJSON[];
      provisionJson: ProvisionJSON[];
    }
  ) {
    let idir_username = '';
    let idir_full_name = '';
    if (session?.data?.activeAccount) {
      idir_username = session?.data?.activeAccount.idir_username;
      idir_full_name = session?.data?.activeAccount.full_name;
      console.log('active account found');
    } else {
      console.log('no active account found');
    }
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
    console.log(variables);
    return variables;
  }

  @Post('save-document')
  saveDocument(
    @Session() session: { data: SessionData },
    @Body()
    data: {
      dtid: number;
      document_type_id: number;
      status: string;
      provisionArray: ProvisionJSON[];
      variableArray: VariableJSON[];
    }
  ) {
    let idir_username = '';
    if (session?.data?.activeAccount) {
      idir_username = session?.data?.activeAccount.idir_username;
      console.log('active account found');
    } else {
      console.log('no active account found');
    }
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
}
