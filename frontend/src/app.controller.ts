import {
  Get,
  Controller,
  Render,
  Param,
  StreamableFile,
  Header,
  UseGuards,
  UseFilters,
  Session,
  Body,
  Post,
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
    const hostname = process.env.BACKEND_URL
      ? process.env.BACKEND_URL
      : `http://localhost`;
    const port = process.env.BACKEND_URL ? 3000 : 3001;
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
    const username = session.data
      ? session.data.activeAccount
        ? session.data.activeAccount.name
          ? session.data.activeAccount.name
          : ""
        : ""
      : "";
    const label = session.data
      ? session.data.activeAccount
        ? session.data.activeAccount.display_name
          ? session.data.activeAccount.display_name
          : ""
        : ""
      : "";
    //session.data.activeAccount !== null && session.data.activeAccount !== undefined
    //  ? session.data.activeAccount.label
    //  : session.data.accounts.length == 0
    //  ? '~'
    //  : '-';
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
    return process.env.ticdi_environment == "DEVELOPMENT"
      ? {
          title: "DEVELOPMENT - " + PAGE_TITLES.INDEX,
          username: username,
          label: label,
          displayAdmin: displayAdmin,
        }
      : {
          title: PAGE_TITLES.INDEX,
          username: username,
          label: label,
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
    const username = session.data
      ? session.data.activeAccount
        ? session.data.activeAccount.name
          ? session.data.activeAccount.name
          : ""
        : ""
      : "";
    const label = session.data
      ? session.data.activeAccount
        ? session.data.activeAccount.display_name
          ? session.data.activeAccount.display_name
          : ""
        : ""
      : "";
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
    let version = [];
    this.ttlsService.setId(id);
    await this.ttlsService.setWebadeToken();
    const response = await firstValueFrom(this.ttlsService.callHttp()).then(
      (res) => {
        return res;
      }
    );
    const ttlsJSON = await this.ttlsService.sendToBackend(response);
    const array = await this.ttlsService.getJSONsByDTID(ttlsJSON.dtid);
    const versions = await this.ttlsService.getTemplateVersions(
      "Land Use Report"
    );
    // this.ttlsService.setJSONDataFile(array); // probably unneeded as cdogs template is stored in a view now
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
    return process.env.ticdi_environment == "DEVELOPMENT"
      ? {
          title: "DEVELOPMENT - " + PAGE_TITLES.INDEX,
          username: username,
          label: label,
          displayAdmin: displayAdmin,
          message: ttlsJSON,
          data: array,
          version: versions,
          documentTypes: documentTypes,
          prdid: ttlsJSON.id,
        }
      : {
          title: PAGE_TITLES.INDEX,
          username: username,
          label: label,
          displayAdmin: displayAdmin,
          message: ttlsJSON,
          data: array,
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
    const username = session.data
      ? session.data.activeAccount
        ? session.data.activeAccount.name
          ? session.data.activeAccount.name
          : ""
        : ""
      : "";
    const label = session.data
      ? session.data.activeAccount
        ? session.data.activeAccount.display_name
          ? session.data.activeAccount.display_name
          : ""
        : ""
      : "";
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
    const documentTypes = [];
    for (let entry of data) {
      // entry.created_date = new Date(entry.created_date).toLocaleDateString();
      if (!documentTypes.includes(entry.comments)) {
        documentTypes.push(entry.comments);
      }
    }
    return process.env.ticdi_environment == "DEVELOPMENT"
      ? {
          title: "DEVELOPMENT - " + PAGE_TITLES.INDEX,
          username: username,
          label: label,
          displayAdmin: displayAdmin,
          data: data,
          documentTypes: documentTypes,
        }
      : {
          title: PAGE_TITLES.INDEX,
          username: username,
          label: label,
          displayAdmin: displayAdmin,
          data: data,
          documentTypes: documentTypes,
        };
  }

  @Get("getHello")
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("getHello2")
  getHello2(): string {
    return this.appService.getHello();
  }
}
