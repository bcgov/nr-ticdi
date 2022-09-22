import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import axios, { AxiosResponse } from "axios";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { URLSearchParams } from "url";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

@Injectable()
export class TTLSService {
  constructor(private readonly http: HttpService) {}

  private id: String;
  private jsonDataFile: {};

  setId(id: String) {
    this.id = id;
  }

  // convert the TTLS JSON package to a format that conforms to the CDOGS template
  setJSONDataFile(jsonDataFile: {}) {
    console.log(jsonDataFile);

    var string = JSON.stringify(jsonDataFile);
    var jsonFormatted = JSON.parse(string);

    let legalName = jsonFormatted.tenantAddr.legalName;
    if (typeof legalName === "undefined" || !legalName) {
      legalName =
        jsonFormatted.tenantAddr.firstName +
        " " +
        jsonFormatted.tenantAddr.lastName;
    }

    this.jsonDataFile = {
      FileNum: jsonFormatted.fileNum,
      OrganizationUnit: jsonFormatted.orgUnit,
      LicenceHolderName: legalName,
      MailingAddress: jsonFormatted.tenantAddr.addrLine1,
      MailingCity: jsonFormatted.tenantAddr.city,
      MailingProv: jsonFormatted.tenantAddr.regionCd,
      PostCode: jsonFormatted.tenantAddr.postalCode,
      Purpose: jsonFormatted.purpose,
      SubPurpose: jsonFormatted.subPurpose,
      TenureType: jsonFormatted.type,
      TenureSubType: jsonFormatted.subType,
      TenureArea: jsonFormatted.area,
      Location: jsonFormatted.locLand,
      LegalDescription: jsonFormatted.legalDesc,
    };
  }

  callHttp(): Observable<Array<Object>> {
    let bearerToken = process.env.ttls_api_key;

    let url = process.env.ttls_url + this.id;

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
    let service_client_secret = process.env.cdogs_service_client_secret

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

  // generate the Land use Report via CDOGS
  async generateLURReport() {
    let cdogsToken = await this.callGetToken();

    const buffer = fs.readFileSync(
      path.resolve(__dirname, "./public/" + "LUR_Template.docx")
    );

    const bufferBase64 = await Buffer.from(buffer).toString("base64");

    var data = JSON.stringify({
      data: this.jsonDataFile,
      formatters:
        '{"myFormatter":"_function_myFormatter|function(data) { return data.slice(1); }","myOtherFormatter":"_function_myOtherFormatter|function(data) {return data.slice(2);}"}',
      options: {
        cacheReport: true,
        overwrite: true,
        reportName: "landusereport.docx",
      },
      template: {
        encodingType: "base64",
        fileType: "docx",
        content: bufferBase64,
      },
    });

    let config = {
      method: "post",
      url: process.env.cdogs_url,
      responseType: "arraybuffer",
      headers: {
        Authorization: "Bearer " + cdogsToken,
        "Content-Type": "application/json",
      },
      data: data,
    };
    const axios = require("axios");
    return axios(config)
      .then((response) => {
        console.log("Generated File");
        return response.data;
      })
      .catch((error) => {
        console.log(error.response);
      });
  }
}
