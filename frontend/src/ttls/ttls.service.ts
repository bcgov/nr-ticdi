import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import axios, { AxiosResponse } from "axios";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { URLSearchParams } from "url";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
declare const Buffer;

dotenv.config();
let hostname: string;
let port: number;

@Injectable()
export class TTLSService {
  constructor(private readonly http: HttpService) {
    hostname = process.env.BACKEND_URL
      ? process.env.BACKEND_URL
      : `http://localhost`;
    // local development backend port is 3001, docker backend port is 3000
    port = process.env.BACKEND_URL ? 3000 : 3001;
  }

  private id: String;
  private jsonDataFile: {};
  private jsonDataArray: any[];

  setId(id: String) {
    this.id = id;
  }

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

    let legalName = jsonFormatted.tenantAddr.legalName;
    if (typeof legalName === "undefined" || !legalName) {
      legalName =
        jsonFormatted.tenantAddr.firstName +
        " " +
        jsonFormatted.tenantAddr.lastName;
    }

    this.jsonDataFile = {
      DataArray: formattedJsonArray,
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

  // sends json data to the backend to be inserted into the database
  async sendToBackend(jsonDataFile: any): Promise<any> {
    const url = `${hostname}:${port}/ticdijson`;
    const { tenantAddr, ...ticdiJson } = jsonDataFile;

    // if these are needed I will update the entities for them later
    delete tenantAddr["@type"];
    delete tenantAddr["links"];
    delete ticdiJson["@type"];
    delete ticdiJson["links"];

    return axios
      .post(
        url,
        { ticdijson: ticdiJson, tenantAddr: tenantAddr },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        return res.data;
      });
  }

  // get a ticdi json object from the backend using a dtid
  async getJSONsByDTID(dtid: number): Promise<any> {
    const url = `${hostname}:${port}/ticdijson/${dtid}`;
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
