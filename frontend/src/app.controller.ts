import {
  Get,
  Controller,
  Render,
  Param,
  UseGuards,
  UseFilters,
  Session,
  Query,
  Res,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { AdminService } from "./admin/admin.service";
import {
  NFR_VARIANTS,
  NFR_VARIANTS_ARRAY,
  PAGE_TITLES,
  REPORT_TYPES,
} from "utils/constants";
import { SessionData } from "utils/types";
import { AuthenticationGuard } from "./authentication/authentication.guard";
import { AuthenticationFilter } from "./authentication/authentication.filter";
import { TTLSService } from "./ttls/ttls.service";
import { AdminGuard } from "./admin/admin.guard";
import { AxiosRequestConfig } from "axios";
import { firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { Req } from "@nestjs/common/decorators/http/route-params.decorator";
import { Request, Response } from "express";
import { ReportService } from "./report/report.service";

let requestUrl: string;
let requestConfig: AxiosRequestConfig;

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly reportService: ReportService,
    private readonly ttlsService: TTLSService
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

  /**
   * Renders the LUR report page
   *
   * @param session
   * @param id
   * @param docname
   * @returns
   */
  @Get("dtid/:id")
  @UseFilters(AuthenticationFilter)
  @UseGuards(AuthenticationGuard)
  @Render("index")
  async findOne(
    @Session() session: { data?: SessionData },
    @Param("id") id,
    @Req() request: Request,
    @Res() response: Response
  ) {
    const hasParams = request.originalUrl.includes("?session_state");
    if (hasParams) {
      const urlWithoutParams = request.path;
      response.redirect(301, urlWithoutParams);
    } else {
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
        const response: any = await firstValueFrom(
          this.ttlsService.callHttp(id)
        )
          .then((res) => {
            return res;
          })
          .catch((err) => {
            console.log("callHttp failed");
            console.log(err);
            console.log(err.response.data);
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
  }

  /**
   * Renders the NFR report page
   *
   * @param session
   * @param id
   * @param docname
   * @returns
   */
  @Get("dtid/:dtid/:variant")
  @UseFilters(AuthenticationFilter)
  @UseGuards(AuthenticationGuard)
  @Render("nfr")
  async findNofr(
    @Session() session: { data?: SessionData },
    @Param("dtid") dtid: number,
    @Param("variant") variantName: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const hasParams = req.originalUrl.includes("?session_state");
    if (hasParams) {
      const urlWithoutParams = req.path;
      res.redirect(301, urlWithoutParams);
    } else if (!NFR_VARIANTS_ARRAY.includes(variantName)) {
      const redirectUrl = `/dtid/${dtid}`;
      res.redirect(301, redirectUrl);
    } else {
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
          ? "DEVELOPMENT - " + PAGE_TITLES.NOFR
          : PAGE_TITLES.NOFR;
      const displayAdmin = isAdmin ? "Administration" : "-";
      const groupMaxJsonArray = await this.reportService.getGroupMaxByVariant(
        variantName
      );
      let ttlsJSON, primaryContactName, nfrData;
      try {
        const nfrDataObject = await this.reportService.getNfrDataByDtid(dtid);
        nfrData = nfrDataObject.nfrData;
        const provisionIds = nfrDataObject.provisionIds
          ? nfrDataObject.provisionIds
          : [];
        const variableIds = nfrDataObject.variableIds
          ? nfrDataObject.variableIds
          : [];
        const mandatoryProvisionIds =
          await this.reportService.getMandatoryProvisionsByVariant(variantName);
        const combinedProvisions = provisionIds.concat(mandatoryProvisionIds);
        const enabledProvisions = combinedProvisions.filter(
          (item, index) => combinedProvisions.indexOf(item) === index
        );
        await this.ttlsService.setWebadeToken();
        const response: any = await firstValueFrom(
          this.ttlsService.callHttp(dtid)
        )
          .then((res) => {
            return res;
          })
          .catch((err) => {
            console.log(err);
          });
        ttlsJSON = await this.ttlsService.formatNFRData(response);
        primaryContactName = ttlsJSON.licenceHolderName;
        ttlsJSON["interestedParties"] = [
          {
            firstName: "First",
            middleName: "Middle",
            lastName: "Last",
            address: "123 fake street",
          },
          {
            firstName: "First2",
            middleName: "Middle2",
            lastName: "Last2",
            address: "346 Miron Drive",
          },
        ];
        let selectedVariant = 0;
        switch (variantName) {
          case NFR_VARIANTS.default: {
            selectedVariant = 0;
            break;
          }
          case NFR_VARIANTS.delayed: {
            selectedVariant = 1;
            break;
          }
          case NFR_VARIANTS.no_fees: {
            selectedVariant = 2;
            break;
          }
          case NFR_VARIANTS.survey_required: {
            selectedVariant = 3;
            break;
          }
          case NFR_VARIANTS.to_obtain_survey: {
            selectedVariant = 4;
            break;
          }
        }
        return {
          title: title,
          idirUsername: session.data.activeAccount
            ? session.data.activeAccount.idir_username
            : "",
          primaryContactName: primaryContactName,
          displayAdmin: displayAdmin,
          message: ttlsJSON,
          groupMaxJsonArray: groupMaxJsonArray,
          documentTypes: NFR_VARIANTS_ARRAY,
          nfrDataId: nfrData ? nfrData.id : -1,
          selectedVariant: selectedVariant,
          mandatoryProvisionList: mandatoryProvisionIds,
          enabledProvisionList: enabledProvisions,
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
          groupMaxJsonArray: groupMaxJsonArray,
          documentTypes: NFR_VARIANTS_ARRAY,
          nfrDataId: -1,
          enabledProvisionList: [],
          error: err,
        };
      }
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
        { reportType: REPORT_TYPES[0], reportIndex: 1 },
        { reportType: REPORT_TYPES[1], reportIndex: 2 },
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
        ? "DEVELOPMENT - " + PAGE_TITLES.MANAGE_TEMPLATES
        : PAGE_TITLES.MANAGE_TEMPLATES;
    let variantJsonArray = [];
    if (reportIndex == 2) {
      variantJsonArray = await this.reportService.getVariantsWithIds();
    }
    return {
      title: title,
      idirUsername: session.data.activeAccount
        ? session.data.activeAccount.idir_username
        : "",
      primaryContactName: "",
      displayAdmin: displayAdmin,
      variantJsonArray: variantJsonArray,
    };
  }

  @Get("search")
  @Render("search")
  @UseFilters(AuthenticationFilter)
  @UseGuards(AuthenticationGuard)
  @UseGuards(AdminGuard)
  async searchPage(@Session() session: { data?: SessionData }) {
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
        ? "DEVELOPMENT - " + PAGE_TITLES.SEARCH
        : PAGE_TITLES.SEARCH;
    return {
      title: title,
      idirUsername: session.data.activeAccount
        ? session.data.activeAccount.idir_username
        : "",
      displayAdmin: displayAdmin,
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

  @Get("/nfr/dtid/:dtid")
  @Render("nfr")
  @UseFilters(AuthenticationFilter)
  @UseGuards(AuthenticationGuard)
  redirectNFR(@Res() res: Response, @Param("dtid") dtid: number) {
    res.redirect(`/nfr/dtid/${dtid}/${encodeURI(NFR_VARIANTS.default)}`);
    return {};
  }

  @Get("/404")
  @Render("404")
  @UseFilters(AuthenticationFilter)
  @UseGuards(AuthenticationGuard)
  notFound(@Session() session: { data?: SessionData }) {
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
    return {
      title: "404 Not Found",
      message: "Sorry, that page does not exist.",
      displayAdmin: displayAdmin,
    };
  }
}
