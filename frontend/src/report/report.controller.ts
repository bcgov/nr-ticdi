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
} from "@nestjs/common";
import { ProvisionJSON, SessionData, VariableJSON } from "utils/types";
import { TTLSService } from "../ttls/ttls.service";
import { AxiosRequestConfig } from "axios";
import { AuthenticationFilter } from "src/authentication/authentication.filter";
import { AuthenticationGuard } from "src/authentication/authentication.guard";
import { GenerateReportGuard } from "src/authentication/generate-report.guard";
import { AdminGuard } from "src/admin/admin.guard";
import { ReportService } from "./report.service";

let requestUrl: string;
let requestConfig: AxiosRequestConfig;

@UseFilters(AuthenticationFilter)
@UseGuards(AuthenticationGuard)
@UseGuards(GenerateReportGuard)
@Controller("report")
export class ReportController {
  constructor(
    private readonly ttlsService: TTLSService,
    private readonly reportService: ReportService
  ) {
    const hostname = process.env.backend_url
      ? process.env.backend_url
      : `http://localhost`;
    const port = process.env.backend_url ? 3000 : 3001;
    requestUrl = `${hostname}:${port}/document-template/`;
    requestConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  @Get("get-report-name/:tfn")
  getReportName(
    @Param("tfn") tenureFileNumber: string
  ): Promise<{ reportName: string }> {
    return this.reportService.generateReportName(tenureFileNumber);
  }

  @Get("get-nfr-report-name/:tfn")
  getNFRReportName(
    @Param("tfn") tenureFileNumber: string
  ): Promise<{ reportName: string }> {
    return this.reportService.generateNFRReportName(tenureFileNumber);
  }

  @Post("generate-lur-report")
  @Header(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
  @Header("Content-Disposition", "attachment; filename=landusereport.docx")
  async generateReport(
    @Session() session: { data: SessionData },
    @Body() data: { prdid: string; document_type: string }
  ) {
    // this should eventually check permissions and prevent unauthorized users from generating documents
    let idir_username = "";
    if (session.data.activeAccount) {
      idir_username = session.data.activeAccount.idir_username;
      console.log("active account found");
    } else {
      console.log("no active account found");
    }
    return new StreamableFile(
      await this.reportService.generateLURReport(
        +data.prdid,
        data.document_type,
        idir_username
      )
    );
  }

  @Post("generate-nfr-report")
  @Header(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
  @Header("Content-Disposition", "attachment; filename=landusereport.docx")
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
    let idir_username = "";
    if (session.data.activeAccount) {
      idir_username = session.data.activeAccount.idir_username;
      console.log("active account found");
    } else {
      console.log("no active account found");
    }
    return new StreamableFile(
      await this.reportService.generateNFRReport(
        data.dtid,
        data.variantName,
        idir_username,
        data.variableJson,
        data.provisionJson
      )
    );
  }

  @Get("get-group-max/:variant")
  getGroupMaxByVariant(@Param("variant") variantName: string) {
    return this.reportService.getGroupMaxByVariant(variantName);
  }

  @Get("get-provision-variables/:variant")
  getVariablesByVariant(@Param("variant") variantName: string) {
    return this.reportService.getVariablesByVariant(variantName);
  }

  @Get("nfr-provisions/:variant/:nfrId")
  getNFRProvisionsByVariant(
    @Param("variant") variantName: string,
    @Param("nfrId") nfrId: number
  ): any {
    // TODO, if nfrId != -1 (displaying a report that was saved for later), use a separate function that will grab free_text values
    return this.reportService.getNFRProvisionsByVariant(variantName, nfrId);
  }

  @Get("enabled-provisions/:nfrDataId")
  getEnabledProvisions(@Param("nfrDataId") nfrDataId: number) {
    return this.reportService.getEnabledProvisions(nfrDataId);
  }

  @Post("save-nfr")
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
    let idir_username = "";
    if (session.data.activeAccount) {
      idir_username = session.data.activeAccount.idir_username;
      console.log("active account found");
    } else {
      console.log("no active account found");
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
}
