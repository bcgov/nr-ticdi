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
import { SessionData } from "utils/types";
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
    return this.ttlsService.generateReportName(tenureFileNumber);
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
      await this.ttlsService.generateLURReport(
        +data.prdid,
        data.document_type,
        idir_username
      )
    );
  }

  // TODO generate-nfr-report

  @UseGuards(AdminGuard)
  @Post("generate-specific-report")
  async generateSpecificReport(
    @Body() data: { prdid: string; documentType: string; templateId: number }
  ) {
    console.log(data);
    return "";
    // return new StreamableFile(
    //   await this.reportService.generateSpecificReport()
    // );
  }
}
