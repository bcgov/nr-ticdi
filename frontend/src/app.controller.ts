import {
  Get,
  Controller,
  Render,
  Param,
  UseGuards,
  UseFilters,
  Session,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { PAGE_TITLES } from "utils/constants";
import { SessionData } from "utils/types";
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
    const displayAdmin = isAdmin ? "Template Administration" : "-";
    const title =
      process.env.ticdi_environment == "DEVELOPMENT"
        ? "DEVELOPMENT - " + PAGE_TITLES.INDEX
        : PAGE_TITLES.INDEX;
    return {
      title: title,
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
    const displayAdmin = isAdmin ? "Template Administration" : "-";
    await this.ttlsService.setWebadeToken();
    const response: any = await firstValueFrom(
      this.ttlsService.callHttp(id)
    ).then((res) => {
      return res;
    });
    const ttlsJSON = await this.ttlsService.sendToBackend(response);
    if (ttlsJSON.inspected_date) {
      ttlsJSON["inspected_date"] = this.ttlsService.formatInspectedDate(
        ttlsJSON.inspected_date.toString()
      );
    }
    const versions = await this.ttlsService.getTemplateVersions(
      "Land Use Report"
    );
    const documentTypes = [];
    const documents = await lastValueFrom(
      this.httpService
        .get(requestUrl, requestConfig)
        .pipe(map((response) => response.data))
    );
    for (let entry of documents) {
      if (!documentTypes.includes(entry.comments)) {
        documentTypes.push(entry.comments);
      }
    }
    const primaryContactName = ttlsJSON.licence_holder_name;
    ttlsJSON["parcels"] = JSON.parse(ttlsJSON.parcels);
    const title =
      process.env.ticdi_environment == "DEVELOPMENT"
        ? "DEVELOPMENT - " + PAGE_TITLES.INDEX
        : PAGE_TITLES.INDEX;
    return {
      title: title,
      primaryContactName: primaryContactName,
      displayAdmin: displayAdmin,
      message: ttlsJSON,
      version: versions,
      documentTypes: documentTypes,
      prdid: ttlsJSON.id,
    };
  }

  @Get("template-admin")
  @Render("template-admin")
  @UseFilters(AuthenticationFilter)
  @UseGuards(AuthenticationGuard)
  @UseGuards(AdminGuard)
  async adminPage(@Session() session: { data?: SessionData }) {
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
    const displayAdmin = isAdmin ? "Template Administration" : "-";
    const data = await lastValueFrom(
      this.httpService
        .get(requestUrl, requestConfig)
        .pipe(map((response) => response.data))
    );
    const documentTypes = ["Land Use Report"];
    for (let entry of data) {
      if (!documentTypes.includes(entry.comments)) {
        documentTypes.push(entry.comments);
      }
    }
    const title =
      process.env.ticdi_environment == "DEVELOPMENT"
        ? "DEVELOPMENT - " + PAGE_TITLES.ADMIN
        : PAGE_TITLES.ADMIN;
    return {
      title: title,
      primaryContactName: "",
      displayAdmin: displayAdmin,
      data: data,
      documentTypes: documentTypes,
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
