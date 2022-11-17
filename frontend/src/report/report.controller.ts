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

let requestUrl: string;
let requestConfig: AxiosRequestConfig;

@Controller("report")
export class ReportController {
  constructor(private readonly ttlsService: TTLSService) {
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

  @Get("getReportName/:dtid")
  getReportName(@Param("dtid") dtid: string): Promise<{ reportName: string }> {
    return this.ttlsService.generateReportName(+dtid);
  }

  @UseFilters(AuthenticationFilter)
  @UseGuards(AuthenticationGuard)
  @Post("generateReport")
  @Header(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
  @Header("Content-Disposition", "attachment; filename=landusereport.docx")
  async generateReport(
    @Session() session: { data: SessionData },
    @Body() data: { prdid: string; version: string; comments: string }
  ) {
    // this should eventually check permissions and prevent unauthorized users from generating documents
    let idir_username = "";
    console.log(session.data);
    if (session.data.activeAccount) {
      idir_username = session.data.activeAccount.idir_username;
      console.log("active account found");
    } else {
      console.log("no active account found");
    }
    return new StreamableFile(
      await this.ttlsService.generateLURReport(
        +data.prdid,
        +data.version,
        data.comments,
        idir_username
      )
    );
  }
}
