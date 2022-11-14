import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import axios, { AxiosResponse } from "axios";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { URLSearchParams } from "url";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import * as base64 from "base-64";
declare const Buffer;

dotenv.config();
let hostname: string;
let port: number;

@Injectable()
export class TTLSService {
  private readonly webade_url: string;
  private readonly webade_username: string;
  private readonly webade_secret: string;
  private readonly tantalis_api: string;
  private webade_token: string;
  constructor(private readonly http: HttpService) {
    hostname = process.env.backend_url
      ? process.env.backend_url
      : `http://localhost`;
    // local development backend port is 3001, docker backend port is 3000
    port = process.env.backend_url ? 3000 : 3001;
    this.webade_url = process.env.WEBADE_AUTH_ENDPOINT;
    this.webade_username = process.env.WEBADE_USERNAME;
    this.webade_secret = process.env.WEBADE_PASSWORD;
    this.tantalis_api = process.env.TTLS_API_ENDPOINT;
  }

  private id: String;
  private jsonDataFile: {};
  private jsonDataArray: any[];

  setId(id: String) {
    this.id = id;
  }

  async setWebadeToken() {
    console.log("Getting a new webade token");
    this.webade_token = await this.getWebadeToken();
  }

  // probably unneeded as cdogs template is stored in a view now
  // convert the TTLS JSON package to a format that conforms to the CDOGS template
  setJSONDataFile(jsonDataFile: [{}]) {
    const formattedJsonArray = [];
    for (let s of jsonDataFile) {
      let string = JSON.stringify(s);
      let jsonFormatted = JSON.parse(string);
      formattedJsonArray.push(jsonFormatted);
    }
    this.jsonDataArray = formattedJsonArray;
    var jsonFormatted = formattedJsonArray[0];

    let legalName = "???";
    // if (typeof legalName === "undefined" || !legalName) {
    //   legalName =
    //     jsonFormatted.tenantAddr.firstName +
    //     " " +
    //     jsonFormatted.tenantAddr.lastName;
    // }

    this.jsonDataFile = {
      DataArray: formattedJsonArray,
      FileNum: jsonFormatted.tenure_file_number,
      OrganizationUnit: jsonFormatted.organization_unit,
      LicenceHolderName: legalName,
      MailingAddress: jsonFormatted.mailing_address_line_1,
      MailingCity: jsonFormatted.mailing_city,
      MailingProv: jsonFormatted.mailing_province_state_code,
      PostCode: jsonFormatted.mailing_postal_code,
      Purpose: jsonFormatted.purpose_name,
      SubPurpose: jsonFormatted.sub_purpose_name,
      TenureType: jsonFormatted.type_name,
      TenureSubType: jsonFormatted.sub_type_name,
      TenureArea: jsonFormatted.area_ha_number,
      Location: jsonFormatted.location_description,
      LegalDescription: jsonFormatted.legal_description,
    };
  }

  // sends json data to the backend to be inserted into the database
  async sendToBackend(jdf: any): Promise<any> {
    const url = `${hostname}:${port}/print-request-detail`;
    if (jdf) {
      const { ...printRequestDetail } = jdf;

      let interestedParty, interestParcel, subPurposeCodes, landUseSubTypeCodes;
      if (
        printRequestDetail.interestedParties &&
        printRequestDetail.interestedParties[0]
      ) {
        interestedParty = printRequestDetail.interestedParties[0];
      } else {
        console.log("null interestedParty");
        interestedParty = null;
      }
      if (
        printRequestDetail.interestParcels &&
        printRequestDetail.interestParcels[0]
      ) {
        interestParcel = printRequestDetail.interestParcels[0];
      } else {
        interestParcel = null;
      }
      if (
        printRequestDetail.purposeCode &&
        printRequestDetail.purposeCode.subPurposeCodes &&
        printRequestDetail.purposeCode.subPurposeCodes[0]
      ) {
        subPurposeCodes = printRequestDetail.purposeCode.subPurposeCodes[0];
      } else {
        subPurposeCodes = null;
      }
      if (
        printRequestDetail.landUseTypeCode &&
        printRequestDetail.landUseTypeCode.landUseSubTypeCodes &&
        printRequestDetail.landUseTypeCode.landUseSubTypeCodes[0]
      ) {
        landUseSubTypeCodes =
          printRequestDetail.landUseTypeCode.landUseSubTypeCodes[0];
      } else {
        landUseSubTypeCodes = null;
      }
      let individual, orgUnit;
      if (interestedParty && interestedParty.individual) {
        individual = interestedParty.individual;
      } else {
        individual = null;
      }
      if (interestedParty && interestedParty.organization) {
        orgUnit = interestedParty.organization.legalName;
      } else {
        orgUnit = null;
      }

      const mappedData = {
        dtid: printRequestDetail.landUseApplicationId,
        tenure_file_number: parseInt(printRequestDetail.fileNumber),
        organization_unit: orgUnit,
        purpose_name: printRequestDetail.purposeCode.description,
        sub_purpose_name: subPurposeCodes.description
          ? subPurposeCodes.description
          : null,
        type_name: printRequestDetail.landUseTypeCode.description,
        sub_type_name: landUseSubTypeCodes.description
          ? landUseSubTypeCodes.description
          : null,
        area_ha_number: interestParcel.areaInHectares
          ? interestParcel.areaInHectares
          : null,
        first_name: individual
          ? individual.firstname
            ? individual.firstname
            : null
          : null,
        middle_name: individual
          ? individual.middlename
            ? individual.middlename
            : null
          : null,
        last_name: individual
          ? individual.lastname
            ? individual.lastname
            : null
          : null,
        mailing_address_line_1: interestedParty
          ? interestedParty.addressLine1
            ? interestedParty.addressLine1
            : null
          : null,
        mailing_address_line_2: interestedParty
          ? interestedParty.addressLine2
            ? interestedParty.addressLine2
            : null
          : null,
        mailing_address_line_3: interestedParty
          ? interestedParty.addressLine3
            ? interestedParty.addressLine3
            : null
          : null,
        mailing_city: interestedParty
          ? interestedParty.city
            ? interestedParty.city
            : null
          : null,
        mailing_province_state_code: interestedParty
          ? interestedParty.province
            ? interestedParty.province
            : null
          : null,
        mailing_postal_code: interestedParty
          ? interestedParty.postalCode
            ? interestedParty.postalCode
            : null
          : null,
        mailing_zip: interestedParty
          ? interestedParty.zipCode
            ? interestedParty.zipCode
            : null
          : null,
        mailing_country_code: null,
        mailing_country: interestedParty
          ? interestedParty.country
            ? interestedParty.country
            : null
          : null,
        location_description: printRequestDetail.locationDescription,
        legal_description: interestParcel
          ? interestParcel.legalDescription
            ? interestParcel.legalDescription
            : null
          : null,
      };

      return axios
        .post(
          url,
          { printRequestDetail: mappedData },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          return res.data;
        });
    } else {
      console.log("Error");
      return { message: "No data found" };
    }
  }

  // get a ticdi json object from the backend using a dtid
  async getJSONsByDTID(dtid: number): Promise<any> {
    const url = `${hostname}:${port}/print-request-detail/${dtid}`;
    return axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        return res.data;
      });
  }

  async getTemplateVersions(comments: string): Promise<string[]> {
    const url = `${hostname}:${port}/document-template`;
    const templates = await axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        return res.data;
      });
    const versions = [];
    for (let t of templates) {
      if (t.comments == comments) {
        versions.push(t.template_version);
      }
    }
    return versions;
  }

  callHttp(): Observable<Array<Object>> {
    const bearerToken = this.webade_token;
    // const bearerToken = process.env.ttls_api_key;

    // const url = process.env.ttls_url + this.id;
    const url = this.tantalis_api + "landUseApplications/" + this.id;

    return this.http
      .get(url, { headers: { Authorization: "Bearer " + bearerToken } })
      .pipe(
        map((axiosResponse: AxiosResponse) => {
          return axiosResponse.data;
        })
      );
  }

  // grab a CDOGS token for future requests
  callGetToken(): Promise<Object> {
    let url = process.env.cdogs_token_endpoint;
    let service_client_id = process.env.cdogs_service_client_id;
    let service_client_secret = process.env.cdogs_service_client_secret;

    const token = `${service_client_id}:${service_client_secret}`;
    const encodedToken = Buffer.from(token).toString("base64");
    let config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + encodedToken,
      },
    };

    const grantTypeParam = new URLSearchParams();
    grantTypeParam.append("grant_type", "client_credentials");

    return axios
      .post(url, grantTypeParam, config)
      .then((response) => {
        return response.data.access_token;
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  async getWebadeToken(): Promise<string> {
    const url =
      this.webade_url +
      "oauth/token?grant_type=client_credentials&disableDeveloperFilter=true&scope=TTLS.*";
    const authorization = base64.encode(
      this.webade_username + ":" + this.webade_secret
    );
    const config = {
      headers: {
        Authorization: `Basic ${authorization}`,
      },
    };
    return axios
      .get(url, config)
      .then((res) => {
        return res.data.access_token;
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log("Response:");
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log("Request:");
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log("Error config:");
        console.log(error.config);
        console.log(error);
      });
  }

  // generate the Land use Report via CDOGS
  async generateLURReport(prdid: number, version: number, comments: string) {
    const url = `${hostname}:${port}/print-request-detail/view/` + prdid;
    const templateUrl = `${hostname}:${port}/document-template/get-one`;
    const data = await axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        return res.data;
      });
    const documentTemplateObject: { data: { the_file: string } } =
      await axios.post(templateUrl, {
        version: version,
        comments: comments,
      });
    const cdogsToken = await this.callGetToken();
    let bufferBase64 = documentTemplateObject.data.the_file;

    const md = JSON.stringify({
      data,
      formatters:
        '{"myFormatter":"_function_myFormatter|function(data) { return data.slice(1); }","myOtherFormatter":"_function_myOtherFormatter|function(data) {return data.slice(2);}"}',
      options: {
        cacheReport: false,
        convertTo: "docx",
        overwrite: true,
        reportName: "test-report",
      },
      template: {
        content: `${bufferBase64}`,
        encodingType: "base64",
        fileType: "docx",
      },
    });

    const conf = {
      method: "post",
      url: process.env.cdogs_url,
      headers: {
        Authorization: `Bearer ${cdogsToken}`,
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
      data: md,
    };
    const ax = require("axios");
    const response = await ax(conf).catch((error) => {
      console.log(error.response);
    });
    return response.data;
  }
}
