import {
  Get,
  Controller,
  Render,
  Param,
  UseGuards,
  UseFilters,
  Session,
  Query,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { AdminService } from "./admin/admin.service";
import { PAGE_TITLES, REPORT_TYPES } from "utils/constants";
import { SessionData, UserObject } from "utils/types";
import { AuthenticationGuard } from "./authentication/authentication.guard";
import { AuthenticationFilter } from "./authentication/authentication.filter";
import { TTLSService } from "./ttls/ttls.service";
import { AdminGuard } from "./admin/admin.guard";
import { AxiosRequestConfig } from "axios";
import { firstValueFrom, lastValueFrom, map } from "rxjs";
import { HttpService } from "@nestjs/axios";

let requestUrl: string;
let requestConfig: AxiosRequestConfig;

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly adminService: AdminService,
    private readonly ttlsService: TTLSService,
    private readonly httpService: HttpService
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

  @Get()
  @Render("index")
  @UseFilters(AuthenticationFilter)
  @UseGuards(AuthenticationGuard)
  async root(@Session() session: { data?: SessionData }) {
    let isAdmin = false;
    if (
      session.data &&
      session.data.activeAccount &&
      session.data.activeAccount.client_roles
    ) {
      for (let role of session.data.activeAccount.client_roles) {
        if (role == "ticdi_admin") {
          isAdmin = true;
        }
      }
    }
    const displayAdmin = isAdmin ? "Administration" : "-";
    const title =
      process.env.ticdi_environment == "DEVELOPMENT"
        ? "DEVELOPMENT - " + PAGE_TITLES.INDEX
        : PAGE_TITLES.INDEX;
    return {
      title: title,
      idirUsername: session.data.activeAccount
        ? session.data.activeAccount.idir_username
        : "",
      primaryContactName: "",
      displayAdmin: displayAdmin,
    };
  }

  @Get("dtid/:id/:docname")
  @UseFilters(AuthenticationFilter)
  @UseGuards(AuthenticationGuard)
  @Render("index")
  async findOne(
    @Session() session: { data?: SessionData },
    @Param("id") id,
    @Param("docname") docname: string
  ) {
    let isAdmin = false;
    if (
      session.data &&
      session.data.activeAccount &&
      session.data.activeAccount.client_roles
    ) {
      for (let role of session.data.activeAccount.client_roles) {
        if (role == "ticdi_admin") {
          isAdmin = true;
        }
      }
    }
    const title =
      process.env.ticdi_environment == "DEVELOPMENT"
        ? "DEVELOPMENT - " + PAGE_TITLES.INDEX
        : PAGE_TITLES.INDEX;
    const displayAdmin = isAdmin ? "Administration" : "-";
    await this.ttlsService.setWebadeToken();
    let ttlsJSON, primaryContactName;
    try {
      const response: any = await firstValueFrom(this.ttlsService.callHttp(id))
        .then((res) => {
          return res;
        })
        .catch((err) => {
          console.log(err);
        });
      ttlsJSON = await this.ttlsService.sendToBackend(response);
      if (ttlsJSON.inspected_date) {
        ttlsJSON["inspected_date"] = this.ttlsService.formatInspectedDate(
          ttlsJSON.inspected_date.toString()
        );
      }
      primaryContactName = ttlsJSON.licence_holder_name;
      return {
        title: title,
        idirUsername: session.data.activeAccount
          ? session.data.activeAccount.idir_username
          : "",
        primaryContactName: primaryContactName,
        displayAdmin: displayAdmin,
        message: ttlsJSON,
        documentTypes: ["Land Use Report", "Notice of Final Review"],
        prdid: ttlsJSON.id,
      };
    } catch (err) {
      console.log(err);
      return {
        title: title,
        idirUsername: session.data.activeAccount
          ? session.data.activeAccount.idir_username
          : "",
        primaryContactName: primaryContactName ? primaryContactName : null,
        displayAdmin: displayAdmin,
        message: ttlsJSON ? ttlsJSON : null,
        documentTypes: ["Land Use Report", "Notice of Final Review"],
        prdid: ttlsJSON ? ttlsJSON.id : null,
        error: err,
      };
    }
  }

  @Get("system-admin")
  @Render("system-admin")
  @UseFilters(AuthenticationFilter)
  @UseGuards(AuthenticationGuard)
  @UseGuards(AdminGuard)
  async systemAdminPage(@Session() session: { data?: SessionData }) {
    let isAdmin = false;
    if (
      session.data &&
      session.data.activeAccount &&
      session.data.activeAccount.client_roles
    ) {
      for (let role of session.data.activeAccount.client_roles) {
        if (role == "ticdi_admin") {
          isAdmin = true;
        }
      }
    }
    const displayAdmin = isAdmin ? "Administration" : "-";
    const title =
      process.env.ticdi_environment == "DEVELOPMENT"
        ? "DEVELOPMENT - " + PAGE_TITLES.ADMIN
        : PAGE_TITLES.ADMIN;
    return {
      title: title,
      idirUsername: session.data.activeAccount
        ? session.data.activeAccount.idir_username
        : "",
      displayAdmin: displayAdmin,
      reportTypes: [
        { reportType: REPORT_TYPES[1], reportIndex: 1 },
        { reportType: REPORT_TYPES[2], reportIndex: 2 },
      ],
    };
  }

  @Get("manage-templates")
  @Render("manage-templates")
  @UseFilters(AuthenticationFilter)
  @UseGuards(AuthenticationGuard)
  @UseGuards(AdminGuard)
  async adminPage(
    @Session() session: { data?: SessionData },
    @Query("report") reportIndex
  ) {
    let reportType = REPORT_TYPES[reportIndex];
    let isAdmin = false;
    let data = [];
    if (
      session.data &&
      session.data.activeAccount &&
      session.data.activeAccount.client_roles
    ) {
      for (let role of session.data.activeAccount.client_roles) {
        if (role == "ticdi_admin") {
          isAdmin = true;
        }
      }
    }
    const displayAdmin = isAdmin ? "Administration" : "-";
    if (reportType && reportType != "") {
      const documentData = await lastValueFrom(
        this.httpService
          .get(requestUrl + `${encodeURI(reportType)}`, requestConfig)
          .pipe(map((response) => response.data))
      );
      for (let entry of documentData) {
        let dataEntry = {};
        dataEntry["id"] = entry.id;
        dataEntry["document_type"] = entry.document_type;
        dataEntry["template_version"] = entry.template_version;
        dataEntry["template_name"] = entry.file_name.replace(".docx", "");
        dataEntry["uploaded_date"] = entry.create_timestamp.split("T")[0];
        dataEntry["active_flag"] = entry.active_flag;
        data.push(dataEntry);
      }
    }
    const title =
      process.env.ticdi_environment == "DEVELOPMENT"
        ? "DEVELOPMENT - " + PAGE_TITLES.MANAGE_TEMPLATES
        : PAGE_TITLES.MANAGE_TEMPLATES;
    return {
      title: title,
      idirUsername: session.data.activeAccount
        ? session.data.activeAccount.idir_username
        : "",
      primaryContactName: "",
      displayAdmin: displayAdmin,
      data: data,
    };
  }

  @Get("getHello")
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  getHello2(): string {
    return this.appService.getHello();
  }
}
