import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from "axios";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { URLSearchParams } from "url";
import * as dotenv from "dotenv";
import * as base64 from "base-64";
declare const Buffer;
const axios = require("axios");

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

  async setWebadeToken() {
    console.log("Getting a new webade token");
    this.webade_token = await this.getWebadeToken();
  }

  // sends json data to the backend to be inserted into the database
  async sendToBackend(jdf: any): Promise<any> {
    const url = `${hostname}:${port}/print-request-detail`;
    if (jdf) {
      const { ...printRequestDetail } = jdf;

      const tenure = [];
      for (let entry of printRequestDetail.interestParcel) {
        tenure.push({
          Area: entry.areaInHectares,
          LegalDescription: entry.legalDescription,
        });
      }
      const mappedData = {
        dtid: printRequestDetail.dtid,
        tenure_file_number: printRequestDetail.fileNum,
        incorporation_number: printRequestDetail.tenantAddr.incorporationNum,
        organization_unit: printRequestDetail.orgUnit,
        purpose_name: printRequestDetail.purpose,
        sub_purpose_name: printRequestDetail.subPurpose,
        type_name: printRequestDetail.type,
        sub_type_name: printRequestDetail.subType,
        first_name: printRequestDetail.tenantAddr.firstName,
        middle_name: printRequestDetail.tenantAddr.middleName,
        last_name: printRequestDetail.tenantAddr.lastName,
        legal_name: printRequestDetail.tenantAddr.legalName,
        licence_holder_name: this.getLicenceHolderName(
          printRequestDetail.tenantAddr
        ),
        email_address: printRequestDetail.tenantAddr.emailAddress,
        phone_number: this.formatPhoneNumber(
          printRequestDetail.tenantAddr.phoneNumber,
          printRequestDetail.tenantAddr.areaCode
        ),
        licence_holder: this.getLicenceHolder(printRequestDetail.tenantAddr),
        contact_agent: this.getContactAgent(
          printRequestDetail.contactFirstName,
          printRequestDetail.contactMiddleName,
          printRequestDetail.contactLastName
        ),
        contact_company_name: printRequestDetail.contactCompanyName,
        contact_first_name: printRequestDetail.contactFirstName,
        contact_middle_name: printRequestDetail.contactMiddleName,
        contact_last_name: printRequestDetail.contactLastName,
        contact_phone_number: this.formatPhoneNumber(
          printRequestDetail.contactPhoneNumber,
          null
        ),
        contact_email_address: printRequestDetail.contactEmail,
        inspected_date: printRequestDetail.inspectionDate,
        mailing_address: this.getMailingAddress(printRequestDetail.tenantAddr),
        mailing_address_line_1: printRequestDetail.tenantAddr.addrLine1,
        mailing_address_line_2: printRequestDetail.tenantAddr.addrLine2,
        mailing_address_line_3: printRequestDetail.tenantAddr.addrLine3,
        mailing_city: printRequestDetail.tenantAddr.city,
        mailing_province_state_code: printRequestDetail.tenantAddr.regionCd,
        mailing_postal_code: printRequestDetail.tenantAddr.postalCode,
        mailing_zip: printRequestDetail.tenantAddr.zipCode,
        mailing_country_code: printRequestDetail.tenantAddr.countryCd,
        mailing_country: printRequestDetail.tenantAddr.country,
        location_description: printRequestDetail.locLand,
        tenure: tenure ? JSON.stringify(tenure) : "",
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

  // returns the individual name and if there is none, then it returns the legal name
  getLicenceHolderName(tenantAddr: {
    firstName: string;
    middleName: string;
    lastName: string;
    legalName: string;
  }): string {
    if (tenantAddr.firstName || tenantAddr.middleName || tenantAddr.lastName) {
      let name = tenantAddr.firstName ? tenantAddr.firstName : "";
      name = tenantAddr.middleName
        ? name.concat(" " + tenantAddr.middleName)
        : name;
      name = tenantAddr.lastName
        ? name.concat(" " + tenantAddr.lastName)
        : name;
      return name;
    } else if (tenantAddr.legalName) {
      return tenantAddr.legalName;
    }
    return "";
  }

  // returns the individual name
  getLicenceHolder(tenantAddr: {
    firstName: string;
    middleName: string;
    lastName: string;
  }): string {
    if (tenantAddr.firstName || tenantAddr.middleName || tenantAddr.lastName) {
      let name = tenantAddr.firstName ? tenantAddr.firstName : "";
      name = tenantAddr.middleName
        ? name.concat(" " + tenantAddr.middleName)
        : name;
      name = tenantAddr.lastName
        ? name.concat(" " + tenantAddr.lastName)
        : name;
      return name;
    }
    return "";
  }

  // returns the individual name
  getContactAgent(
    firstName: string,
    middleName: string,
    lastName: string
  ): string {
    if (firstName || middleName || lastName) {
      let name = firstName ? firstName : "";
      name = middleName ? name.concat(" " + middleName) : name;
      name = lastName ? name.concat(" " + lastName) : name;
      return name;
    }
    return "";
  }

  // if there are multiple addresses, concatenate them
  getMailingAddress(tenantAddr: {
    addrLine1: string;
    addrLine2: string;
    addrLine3: string;
  }): string {
    let mailingAddress = "";
    if (tenantAddr.addrLine1) {
      mailingAddress = tenantAddr.addrLine1;
    }
    if (tenantAddr.addrLine2) {
      mailingAddress = mailingAddress.concat(", " + tenantAddr.addrLine2);
    }
    if (tenantAddr.addrLine3) {
      mailingAddress = mailingAddress.concat(", " + tenantAddr.addrLine3);
    }
    return mailingAddress;
  }

  formatInspectedDate(inspected_date: string): string {
    if (inspected_date && inspected_date.length == 8) {
      return (
        inspected_date.substring(0, 4) +
        "-" +
        inspected_date.substring(4, 6) +
        "-" +
        inspected_date.substring(6, 8)
      );
    }
    return inspected_date;
  }

  formatPhoneNumber(phone_number: string, area_code: string): string {
    if (phone_number && phone_number.length == 10) {
      return phone_number.replace(/(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
    } else if (
      phone_number &&
      area_code &&
      (phone_number + area_code).length == 10
    ) {
      return (area_code + phone_number).replace(
        /(\d{3})(\d{3})(\d{4})/,
        "($1)$2-$3"
      );
    } else {
      return "";
    }
  }

  callHttp(id: number): Observable<Array<Object>> {
    const bearerToken = this.webade_token;
    const url = process.env.ttls_url + id;
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
      "?grant_type=client_credentials&disableDeveloperFilter=true&scope=TTLS.*";
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

  /**
   * Generates a LUR report name using tenure file number
   * and a version number. The version number is incremented
   * each time someone generates a LUR report.
   *
   * @param tenureFileNumber
   * @returns
   */
  async generateReportName(tenureFileNumber: string) {
    const url =
      `${hostname}:${port}/print-request-log/version/` + tenureFileNumber;
    // grab the next version string for the dtid
    const version = await axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        return res.data;
      });
    return { reportName: "LUR_" + tenureFileNumber + "_" + version };
  }

  /**
   * Generates the Land use Report using CDOGS
   *
   * @param prdid
   * @param document_type
   * @param username
   * @returns
   */
  async generateLURReport(
    prdid: number,
    document_type: string,
    username: string
  ) {
    const url = `${hostname}:${port}/print-request-detail/view/` + prdid;
    const templateUrl =
      `${hostname}:${port}/document-template/get-active-report/` +
      encodeURI(document_type);
    const logUrl = `${hostname}:${port}/print-request-log/`;
    // get the view given the print request detail id
    const data = await axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        return res.data;
      });
    if (data.InspectionDate) {
      data["InspectionDate"] = this.formatInspectedDate(data.InspectionDate);
    }
    // get the document template
    const documentTemplateObject: { id: number; the_file: string } = await axios
      .get(templateUrl)
      .then((res) => {
        return res.data;
      });

    // log the request
    const document_template_id = documentTemplateObject.id;
    await axios.post(logUrl, {
      document_template_id: document_template_id,
      print_request_detail_id: prdid,
      dtid: data.DTID,
      request_app_user: username,
      request_json: JSON.stringify(data),
    });

    const cdogsToken = await this.callGetToken();
    let bufferBase64 = documentTemplateObject.the_file;
    const md = JSON.stringify({
      data,
      formatters:
        '{"myFormatter":"_function_myFormatter|function(data) { return data.slice(1); }","myOtherFormatter":"_function_myOtherFormatter|function(data) {return data.slice(2);}"}',
      options: {
        cacheReport: false,
        convertTo: "docx",
        overwrite: true,
        reportName: "lur-report",
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

  // TODO
  async generateNFRReport(
    prdid: number,
    templateId: number,
    variables: any,
    username: string
  ) {
    const url = `${hostname}:${port}/nfr-data/view/${prdid}`;
    const templateUrl = `${hostname}:${port}/document-template/find-one/${templateId}`;
    const logUrl = `${hostname}:${port}/print-request-log/`;
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // TODO get the view for specified prdid from the new NFR entity
    const data = await axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        return res.data;
      });
    if (data.InspectionDate) {
      data["InspectionDate"] = this.formatInspectedDate(data.InspectionDate);
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // get the document template
    const documentTemplateObject: { id: number; the_file: string } = await axios
      .get(templateUrl)
      .then((res) => {
        return res.data;
      });

    // log the request
    await axios.post(logUrl, {
      document_template_id: templateId,
      print_request_detail_id: prdid,
      dtid: data.DTID,
      request_app_user: username,
      request_json: JSON.stringify(data),
    });

    const cdogsToken = await this.callGetToken();
    let bufferBase64 = documentTemplateObject.the_file;
    const md = JSON.stringify({
      data,
      formatters:
        '{"myFormatter":"_function_myFormatter|function(data) { return data.slice(1); }","myOtherFormatter":"_function_myOtherFormatter|function(data) {return data.slice(2);}"}',
      options: {
        cacheReport: false,
        convertTo: "docx",
        overwrite: true,
        reportName: "nfr-report",
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
