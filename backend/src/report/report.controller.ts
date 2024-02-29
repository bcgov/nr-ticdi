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

  @Get('get-data/:dtid')
  async getData(@Session() session: { data?: SessionData }, @Param('dtid') dtid: number) {
    console.log(dtid);
    console.log(session);
    await this.reportService.getActiveNfrDataByDtid(dtid);
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

  @Get('get-nfr-data/:dtid')
  getNfrData(@Session() session: { data?: SessionData }, @Param('dtid') dtid: number) {
    console.log('get-nfr-data ~ ' + dtid);
    return this.reportService.getActiveNfrDataByDtid(dtid);
  }

  @Get('get-report-name/:dtid/:tfn/:documentType')
  getReportName(
    @Param('dtid') dtid: number,
    @Param('tfn') tenureFileNumber: string,
    @Param('documentType') documentType: string
  ): Promise<{ reportName: string }> {
    return this.reportService.generateReportName(dtid, tenureFileNumber, documentType);
  }

  @Get('get-nfr-report-name/:dtid/:tfn')
  getNFRReportName(
    @Param('dtid') dtid: number,
    @Param('tfn') tenureFileNumber: string
  ): Promise<{ reportName: string }> {
    return this.reportService.generateNFRReportName(dtid, tenureFileNumber);
  }

  @Post('generate-report')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  @Header('Content-Disposition', 'attachment; filename=landusereport.docx')
  async generateReport(
    @Session() session: { data: SessionData },
    @Body() data: { prdid: string; document_type: string; dtid: number }
  ) {
    // this should eventually check permissions and prevent unauthorized users from generating documents
    let idir_username = '';
    session = {
      data: {
        activeAccount: {
          idir_username: 'mtennant',
          name: '',
          full_name: '',
          client_roles: [''],
        },
      },
      ...session,
    };
    if (session.data.activeAccount) {
      idir_username = session.data.activeAccount.idir_username;
      console.log('active account found');
    } else {
      console.log('no active account found');
    }
    if (data.document_type == 'GL') {
      return new StreamableFile(await this.reportService.generateGLReport(+data.dtid, idir_username));
    } else {
      return new StreamableFile(await this.reportService.generateLURReport(+data.prdid, idir_username));
    }
  }

  @Post('generate-nfr-report')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  @Header('Content-Disposition', 'attachment; filename=nfr-report.docx')
  async generateNFRReport(
    @Session() session: { data: SessionData },
    @Body()
    data: {
      dtid: number;
      variantName: string;
      variableJson: VariableJSON[];
      provisionJson: ProvisionJSON[];
    }
  ) {
    // this should eventually check permissions and prevent unauthorized users from generating documents
    let idir_username = '';
    let idir_full_name = '';
    if (session?.data?.activeAccount) {
      idir_username = session.data.activeAccount.idir_username;
      idir_full_name = session.data.activeAccount.full_name;
      console.log('active account found');
    } else {
      console.log('no active account found');
    }
    return new StreamableFile(
      await this.reportService.generateNFRReport(
        data.dtid,
        data.variantName,
        idir_username,
        idir_full_name,
        data.variableJson,
        data.provisionJson
      )
    );
  }

  @Get('get-group-max/:variant')
  getGroupMaxByVariant(@Param('variant') variantName: string) {
    console.log('variantName: ' + variantName);
    return this.reportService.getGroupMaxByVariant(variantName);
  }

  @Get('nfr-provisions/:variantName/:dtid')
  getNFRProvisionsByVariant(@Param('variantName') variantName: string, @Param('dtid') dtid: number): any {
    return this.reportService.getNFRProvisionsByVariantAndDtid(variantName, dtid);
  }

  @Get('get-provision-variables/:variantName/:dtid')
  async getNFRVariablesByVariant(@Param('variantName') variantName: string, @Param('dtid') dtid: number) {
    console.log('getting variables for NFR');
    const variables = await this.reportService.getNFRVariablesByVariantAndDtid(variantName, dtid);
    return variables;
  }

  @Post('save-nfr')
  saveNFR(
    @Session() session: { data: SessionData },
    @Body()
    data: {
      dtid: number;
      variant_name: string;
      status: string;
      provisionArray: ProvisionJSON[];
      variableArray: VariableJSON[];
    }
  ) {
    let idir_username = '';
    if (session?.data?.activeAccount) {
      idir_username = session.data.activeAccount.idir_username;
      console.log('active account found');
    } else {
      console.log('no active account found');
    }
    return this.reportService.saveNFR(
      data.dtid,
      data.variant_name,
      data.status,
      data.provisionArray,
      data.variableArray,
      idir_username
    );
  }

  @Get('enabled-provisions/:variantName')
  getEnabledProvisionsByVariant(@Param('variantName') variantName: string) {
    return this.reportService.getEnabledProvisionsByVariant(variantName);
  }

  @Get('enabled-provisions2/:variantName/:dtid')
  getEnabledProvisionsByVariantAndDtid(@Param('variantName') variantName: string, @Param('dtid') dtid: number) {
    return this.reportService.getEnabledProvisionsByVariantAndDtid(variantName, dtid);
  }

  @Get('search-nfr-data')
  getNFRData() {
    return this.reportService.getNFRData();
  }

  @Get('get-mandatory-provisions-by-variant/:variant')
  getMandatoryProvisionsByVariant(@Param('variant') variant: string) {
    return this.reportService.getMandatoryProvisionsByVariant(variant);
  }
}
