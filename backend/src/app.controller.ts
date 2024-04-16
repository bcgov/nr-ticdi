import { Get, Controller, Render, Param, UseGuards, UseFilters, Session, Query, Res } from '@nestjs/common';
import { NFR_VARIANTS, NFR_VARIANTS_ARRAY, PAGE_TITLES, REPORT_TYPES } from 'src/constants';
import { SessionData } from 'src/types';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { AuthenticationFilter } from './authentication/authentication.filter';
import { TTLSService } from './ttls/ttls.service';
import { AdminGuard } from './admin/admin.guard';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { Req } from '@nestjs/common/decorators/http/route-params.decorator';
import { Request, Response } from 'express';
import { ReportService } from './report/report.service';
import { nfrInterestedParties } from 'src/util';
import { JwtAuthGuard } from './auth/jwtauth.guard';

// unused, to be cleaned up
let requestUrl: string;
let requestConfig: AxiosRequestConfig;

@Controller()
export class AppController {
  constructor(private readonly reportService: ReportService, private readonly ttlsService: TTLSService) {
    const hostname = process.env.backend_url ? process.env.backend_url : `http://localhost`;
    const port = process.env.backend_url ? 3000 : 3001;
    requestUrl = `${hostname}:${port}/document-template/`;
    requestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  @Get()
  @Render('index')
  //  @UseFilters(AuthenticationFilter)
  //  @UseGuards(AuthenticationGuard)
  @UseGuards(JwtAuthGuard)
  async root(@Session() session: { data?: SessionData }) {
    let isAdmin = false;
    if (session.data && session.data.activeAccount && session.data.activeAccount.client_roles) {
      for (let role of session.data.activeAccount.client_roles) {
        if (role == 'ticdi_admin') {
          isAdmin = true;
        }
      }
    }
    const displayAdmin = isAdmin ? 'Administration' : '-';
    const title =
      process.env.ticdi_environment == 'DEVELOPMENT' ? 'DEVELOPMENT - ' + PAGE_TITLES.INDEX : PAGE_TITLES.INDEX;
    return {
      title: title,
      idirUsername: session.data.activeAccount ? session.data.activeAccount.idir_username : '',
      primaryContactName: '',
      displayAdmin: displayAdmin,
    };
  }

  /**
   * Renders the non-LUR report pages
   *
   * @param session
   * @param dtid
   * @param documentType
   * @returns
   */
  @Get('dtid/:dtid/:documentType')
  //  @UseFilters(AuthenticationFilter)
  //  @UseGuards(AuthenticationGuard)
  @UseGuards(JwtAuthGuard)
  async reportPage(
    @Session() session: { data?: SessionData },
    @Param('dtid') dtid: number,
    @Param('documentType') documentType,
    @Req() req: Request,
    @Res() res: Response
  ) {
    console.log('Report page document type: ' + documentType);
    let decodedDocumentType = decodeURIComponent(documentType);
    decodedDocumentType = decodedDocumentType.toUpperCase().replace(/\s+/g, '').replace(/-/g, '').replace(/–/g, '');
    console.log(decodedDocumentType);
    if (decodedDocumentType == 'GRAZINGLEASE' || decodedDocumentType == 'AGRICULTURALLEASEUGRAZINGMP') {
      return this.getGrazingLeaseDisplayData(session, dtid, res);
    } else if (decodedDocumentType.includes('NOTICEOFFINALREVIEW')) {
      return this.getNfrDisplayData(session, dtid, documentType, res);
    } else {
      return this.landUseReportPage(session, dtid, req, res);
    }
  }

  /**
   * Renders the LUR report page
   *
   * @param session
   * @param id
   * @returns
   */
  @Get('dtid/:dtid')
  //  @UseFilters(AuthenticationFilter)
  //  @UseGuards(AuthenticationGuard)
  @UseGuards(JwtAuthGuard)
  async landUserReportRedirect(
    @Session() session: { data?: SessionData },
    @Param('dtid') dtid,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return this.landUseReportPage(session, dtid, req, res);
  }

  //  @UseFilters(AuthenticationFilter)
  //  @UseGuards(AuthenticationGuard)
  @UseGuards(JwtAuthGuard)
  async landUseReportPage(
    @Session() session: { data?: SessionData },
    @Param('dtid') dtid,
    @Req() req: Request,
    @Res() res: Response
  ) {
    console.log('LUR report!');
    let isAdmin = false;
    if (session.data && session.data.activeAccount && session.data.activeAccount.client_roles) {
      for (let role of session.data.activeAccount.client_roles) {
        if (role == 'ticdi_admin') {
          isAdmin = true;
        }
      }
    }
    const title =
      process.env.ticdi_environment == 'DEVELOPMENT' ? 'DEVELOPMENT - ' + PAGE_TITLES.INDEX : PAGE_TITLES.INDEX;
    const displayAdmin = isAdmin ? 'Administration' : '-';
    await this.ttlsService.setWebadeToken();
    let ttlsJSON, primaryContactName;
    try {
      const response: any = await firstValueFrom(this.ttlsService.callHttp(dtid))
        .then((res) => {
          return res;
        })
        .catch((err) => {
          console.log('callHttp failed');
          console.log(err);
          console.log(err.response.data);
        });
      ttlsJSON = await this.ttlsService.sendToBackend(response);
      ttlsJSON['cityProvPostal'] = this.ttlsService.concatCityProvPostal(
        response.tenantAddr ? response.tenantAddr[0] : null
      );
      if (ttlsJSON.inspected_date) {
        ttlsJSON['inspected_date'] = this.ttlsService.formatInspectedDate(ttlsJSON.inspected_date.toString());
      }
      primaryContactName = ttlsJSON.licence_holder_name;
      return res.render('index', {
        title: title,
        idirUsername: session.data.activeAccount ? session.data.activeAccount.idir_username : '',
        primaryContactName: primaryContactName,
        displayAdmin: displayAdmin,
        message: ttlsJSON,
        documentTypes: ['Land Use Report', 'Notice of Final Review', 'Grazing Lease'],
        prdid: ttlsJSON.id,
      });
    } catch (err) {
      console.log(err);
      return res.render('index', {
        title: title,
        idirUsername: session.data.activeAccount ? session.data.activeAccount.idir_username : '',
        primaryContactName: primaryContactName ? primaryContactName : null,
        displayAdmin: displayAdmin,
        message: ttlsJSON ? ttlsJSON : null,
        documentTypes: ['Land Use Report', 'Notice of Final Review', 'Grazing Lease'],
        prdid: ttlsJSON ? ttlsJSON.id : null,
        error: err,
      });
    }
  }

  @Get('system-admin')
  @Render('system-admin')
  //  @UseFilters(AuthenticationFilter)
  //  @UseGuards(AuthenticationGuard)
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  async systemAdminPage(@Session() session: { data?: SessionData }) {
    let isAdmin = false;
    if (session.data && session.data.activeAccount && session.data.activeAccount.client_roles) {
      for (let role of session.data.activeAccount.client_roles) {
        if (role == 'ticdi_admin') {
          isAdmin = true;
        }
      }
    }
    const displayAdmin = isAdmin ? 'Administration' : '-';
    const title =
      process.env.ticdi_environment == 'DEVELOPMENT' ? 'DEVELOPMENT - ' + PAGE_TITLES.ADMIN : PAGE_TITLES.ADMIN;
    return {
      title: title,
      idirUsername: session.data.activeAccount ? session.data.activeAccount.idir_username : '',
      displayAdmin: displayAdmin,
      reportTypes: [
        { reportType: REPORT_TYPES[0], reportIndex: 1 },
        { reportType: REPORT_TYPES[1], reportIndex: 2 },
        { reportType: REPORT_TYPES[2], reportIndex: 3 },
      ],
    };
  }

  @Get('manage-templates')
  @Render('manage-templates')
  //  @UseFilters(AuthenticationFilter)
  //  @UseGuards(AuthenticationGuard)
  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  async adminPage(@Session() session: { data?: SessionData }, @Query('report') reportIndex) {
    let isAdmin = false;
    if (session.data && session.data.activeAccount && session.data.activeAccount.client_roles) {
      for (let role of session.data.activeAccount.client_roles) {
        if (role == 'ticdi_admin') {
          isAdmin = true;
        }
      }
    }
    const displayAdmin = isAdmin ? 'Administration' : '-';
    const title =
      process.env.ticdi_environment == 'DEVELOPMENT'
        ? 'DEVELOPMENT - ' + PAGE_TITLES.MANAGE_TEMPLATES
        : PAGE_TITLES.MANAGE_TEMPLATES;
    let variantJsonArray = [];
    if (reportIndex == 2) {
      // variantJsonArray = await this.reportService.getVariantsWithIds();
      variantJsonArray = [];
    }
    return {
      title: title,
      idirUsername: session.data.activeAccount ? session.data.activeAccount.idir_username : '',
      primaryContactName: '',
      displayAdmin: displayAdmin,
      variantJsonArray: variantJsonArray,
    };
  }

  @Get('search')
  @Render('search')
  //  @UseFilters(AuthenticationFilter)
  //  @UseGuards(AuthenticationGuard)
  @UseGuards(JwtAuthGuard)
  async searchPage(@Session() session: { data?: SessionData }) {
    let isAdmin = false;
    if (session.data && session.data.activeAccount && session.data.activeAccount.client_roles) {
      for (let role of session.data.activeAccount.client_roles) {
        if (role == 'ticdi_admin') {
          isAdmin = true;
        }
      }
    }
    const displayAdmin = isAdmin ? 'Administration' : '-';
    const title =
      process.env.ticdi_environment == 'DEVELOPMENT' ? 'DEVELOPMENT - ' + PAGE_TITLES.SEARCH : PAGE_TITLES.SEARCH;
    return {
      title: title,
      idirUsername: session.data.activeAccount ? session.data.activeAccount.idir_username : '',
      displayAdmin: displayAdmin,
    };
  }

  @Get('/nfr/dtid/:dtid')
  @Render('nfr')
  //  @UseFilters(AuthenticationFilter)
  //  @UseGuards(AuthenticationGuard)
  @UseGuards(JwtAuthGuard)
  redirectNFR(@Res() res: Response, @Param('dtid') dtid: number) {
    res.redirect(`/nfr/dtid/${dtid}/${encodeURI(NFR_VARIANTS.default)}`);
    return {};
  }

  @Get('/404')
  @Render('404')
  //  @UseFilters(AuthenticationFilter)
  //  @UseGuards(AuthenticationGuard)
  @UseGuards(JwtAuthGuard)
  notFound(@Session() session: { data?: SessionData }) {
    let isAdmin = false;
    if (session.data && session.data.activeAccount && session.data.activeAccount.client_roles) {
      for (let role of session.data.activeAccount.client_roles) {
        if (role == 'ticdi_admin') {
          isAdmin = true;
        }
      }
    }
    const displayAdmin = isAdmin ? 'Administration' : '-';
    return {
      title: '404 Not Found',
      message: 'Sorry, that page does not exist.',
      displayAdmin: displayAdmin,
    };
  }

  // grabs Grazing Lease display data and displays the grazing lease report page
  async getGrazingLeaseDisplayData(session, dtid, res) {
    console.log('grazing lease');
    let isAdmin = false;
    if (session.data && session.data.activeAccount && session.data.activeAccount.client_roles) {
      for (let role of session.data.activeAccount.client_roles) {
        if (role == 'ticdi_admin') {
          isAdmin = true;
        }
      }
    }
    const title =
      process.env.ticdi_environment == 'DEVELOPMENT'
        ? 'DEVELOPMENT - ' + PAGE_TITLES.GRAZING_LEASE
        : PAGE_TITLES.GRAZING_LEASE;
    const displayAdmin = isAdmin ? 'Administration' : '-';
    await this.ttlsService.setWebadeToken();
    let ttlsJSON, primaryContactName;
    try {
      const response: any = await firstValueFrom(this.ttlsService.callHttp(dtid))
        .then((res) => {
          return res;
        })
        .catch((err) => {
          console.log('callHttp failed');
          console.log(err);
          console.log(err.response.data);
        });
      ttlsJSON = await this.ttlsService.formatNFRData(response);
      primaryContactName = ttlsJSON.licenceHolderName;
      const interestedParties = nfrInterestedParties(response.tenantAddr);
      ttlsJSON['interestedParties'] = interestedParties;
      return res.render('grazing-lease', {
        title: title,
        idirUsername: session.data.activeAccount ? session.data.activeAccount.idir_username : '',
        primaryContactName: primaryContactName,
        displayAdmin: displayAdmin,
        message: ttlsJSON,
        prdid: ttlsJSON.id,
      });
    } catch (err) {
      console.log(err);
      return res.render('grazing-lease', {
        title: title,
        idirUsername: session.data.activeAccount ? session.data.activeAccount.idir_username : '',
        primaryContactName: primaryContactName ? primaryContactName : null,
        displayAdmin: displayAdmin,
        message: ttlsJSON ? ttlsJSON : null,
        prdid: ttlsJSON ? ttlsJSON.id : null,
        error: err,
      });
    }
  }

  // grabs NFR data and displays the correct NFR page
  async getNfrDisplayData(session, dtid, variantName, res) {
    let ttlsJSON, primaryContactName, nfrData;
    let isAdmin = false;
    if (session.data && session.data.activeAccount && session.data.activeAccount.client_roles) {
      for (let role of session.data.activeAccount.client_roles) {
        if (role == 'ticdi_admin') {
          isAdmin = true;
        }
      }
    }
    const title =
      process.env.ticdi_environment == 'DEVELOPMENT' ? 'DEVELOPMENT - ' + PAGE_TITLES.NOFR : PAGE_TITLES.NOFR;
    const displayAdmin = isAdmin ? 'Administration' : '-';
    // const groupMaxJsonArray = await this.reportService.getGroupMaxByVariant('NOTICE OF FINAL REVIEW');
    const groupMaxJsonArray = [];
    try {
      const nfrDataObject = await this.reportService.getDocumentDataByDocTypeIdAndDtid(1, dtid);
      nfrData = nfrDataObject.nfrData;
      const provisionIds = nfrDataObject.provisionIds ? nfrDataObject.provisionIds : [];
      // const mandatoryProvisionIds = await this.reportService.getMandatoryProvisionsByVariant(variantName);
      const mandatoryProvisionIds = [];
      await this.ttlsService.setWebadeToken();
      const response: any = await firstValueFrom(this.ttlsService.callHttp(dtid))
        .then((res) => {
          return res;
        })
        .catch((err) => {
          console.log(err.response.data);
        });
      ttlsJSON = await this.ttlsService.formatNFRData(response);
      primaryContactName = ttlsJSON.licenceHolderName;
      const interestedParties = nfrInterestedParties(response.tenantAddr);
      ttlsJSON['interestedParties'] = interestedParties;
      let selectedVariant = 0;
      switch (variantName.toLowerCase()) {
        case NFR_VARIANTS.default.toLowerCase(): {
          selectedVariant = 0;
          break;
        }
        case NFR_VARIANTS.delayed.toLowerCase(): {
          selectedVariant = 1;
          break;
        }
        case NFR_VARIANTS.no_fees.toLowerCase(): {
          selectedVariant = 2;
          break;
        }
        case NFR_VARIANTS.survey_required.toLowerCase(): {
          selectedVariant = 3;
          break;
        }
        case NFR_VARIANTS.to_obtain_survey.toLowerCase(): {
          selectedVariant = 4;
          break;
        }
      }
      return res.render('nfr', {
        title: title,
        idirUsername: session.data.activeAccount ? session.data.activeAccount.idir_username : '',
        primaryContactName: primaryContactName,
        displayAdmin: displayAdmin,
        message: ttlsJSON,
        groupMaxJsonArray: groupMaxJsonArray,
        documentTypes: NFR_VARIANTS_ARRAY,
        nfrDataId: nfrData ? nfrData.id : -1,
        selectedVariant: selectedVariant,
        mandatoryProvisionList: mandatoryProvisionIds,
        enabledProvisionList: provisionIds,
      });
    } catch (err) {
      console.log(err);
      return res.render('nfr', {
        title: title,
        idirUsername: session.data.activeAccount ? session.data.activeAccount.idir_username : '',
        primaryContactName: primaryContactName ? primaryContactName : null,
        displayAdmin: displayAdmin,
        message: ttlsJSON ? ttlsJSON : null,
        groupMaxJsonArray: groupMaxJsonArray,
        documentTypes: NFR_VARIANTS_ARRAY,
        nfrDataId: -1,
        enabledProvisionList: [],
        error: err,
      });
    }
  }
}
