import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { URLSearchParams } from 'url';
import * as dotenv from 'dotenv';
import * as base64 from 'base-64';
import { formatPostalCode, getNFRMailingAddress } from 'utils/util';
declare const Buffer;
const axios = require('axios');

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
    hostname = process.env.backend_url ? process.env.backend_url : `http://localhost`;
    // local development backend port is 3001, docker backend port is 3000
    port = process.env.backend_url ? 3000 : 3001;
    this.webade_url = process.env.WEBADE_AUTH_ENDPOINT;
    this.webade_username = process.env.WEBADE_USERNAME;
    this.webade_secret = process.env.WEBADE_PASSWORD;
    this.tantalis_api = process.env.TTLS_API_ENDPOINT;
  }

  async setWebadeToken() {
    console.log('Getting a new webade token');
    this.webade_token = await this.getWebadeToken();
  }

  formatNFRData(ttlsData: any): any {
    const tenantAddr = ttlsData.tenantAddr ? (ttlsData.tenantAddr[0] ? ttlsData.tenantAddr[0] : null) : null;
    const mappedData = {
      dtid: ttlsData.dtid,
      fileNum: ttlsData.fileNum,
      incorporationNum: tenantAddr ? tenantAddr.incorporationNum : '',
      orgUnit: ttlsData.orgUnit,
      purpose: ttlsData.purpose,
      subPurpose: ttlsData.subPurpose,
      type: ttlsData.type,
      subType: ttlsData.subType,
      firstName: tenantAddr ? tenantAddr.firstName : '',
      middleName: tenantAddr ? tenantAddr.middleName : '',
      lastName: tenantAddr ? tenantAddr.lastName : '',
      legalName: tenantAddr ? tenantAddr.legalName : '',
      licenceHolderName: this.getLicenceHolderName(tenantAddr),
      emailAddress: tenantAddr ? tenantAddr.emailAddress : '',
      phoneNumber: this.formatPhoneNumber(
        tenantAddr ? tenantAddr.phoneNumber : '',
        tenantAddr ? tenantAddr.areaCode : ''
      ),
      licenceHolder: this.getLicenceHolder(tenantAddr),
      contactAgent: this.getContactAgent(
        ttlsData.contactFirstName,
        ttlsData.contactMiddleName,
        ttlsData.contactLastName
      ),
      contactCompanyName: ttlsData.contactCompanyName,
      contactFirstName: ttlsData.contactFirstName,
      contactMiddleName: ttlsData.contactMiddleName,
      contactLastName: ttlsData.contactLastName,
      contactPhoneNumber: this.formatPhoneNumber(ttlsData.contactPhoneNumber, null),
      contactEmail: ttlsData.contactEmail,
      inspectionDate: ttlsData.inspectionDate,
      mailingAddress: getNFRMailingAddress(tenantAddr),
      addrLine1: tenantAddr ? tenantAddr.addrLine1 : '',
      addrLine2: tenantAddr ? tenantAddr.addrLine2 : '',
      addrLine3: tenantAddr ? tenantAddr.addrLine3 : '',
      city: tenantAddr ? tenantAddr.city : '',
      regionCd: tenantAddr ? tenantAddr.regionCd : '',
      postalCode: tenantAddr ? formatPostalCode(tenantAddr.postalCode) : '',
      cityProvPostal: this.concatCityProvPostal(tenantAddr),
      zipCode: tenantAddr ? tenantAddr.zipCode : '',
      countryCd: tenantAddr ? tenantAddr.countryCd : '',
      country: tenantAddr ? tenantAddr.country : '',
      locLand: ttlsData.locLand,
    };
    return mappedData;
  }

  // sends json data to the backend to be inserted into the database
  async sendToBackend(ttlsData: any): Promise<any> {
    const url = `${hostname}:${port}/print-request-detail`;
    if (ttlsData) {
      const tenantAddr = ttlsData.tenantAddr[0];

      const tenure = [];
      for (let entry of ttlsData.interestParcel) {
        tenure.push({
          Area: entry.areaInHectares,
          LegalDescription: entry.legalDescription,
        });
      }
      const mappedData = {
        dtid: ttlsData.dtid,
        tenure_file_number: ttlsData.fileNum,
        incorporation_number: tenantAddr ? tenantAddr.incorporationNum : '',
        organization_unit: ttlsData.orgUnit,
        purpose_name: ttlsData.purpose,
        sub_purpose_name: ttlsData.subPurpose,
        type_name: ttlsData.type,
        sub_type_name: ttlsData.subType,
        first_name: tenantAddr ? tenantAddr.firstName : '',
        middle_name: tenantAddr ? tenantAddr.middleName : '',
        last_name: tenantAddr ? tenantAddr.lastName : '',
        legal_name: tenantAddr ? tenantAddr.legalName : '',
        licence_holder_name: this.getLicenceHolderName(tenantAddr),
        email_address: tenantAddr ? tenantAddr.emailAddress : '',
        phone_number: this.formatPhoneNumber(
          tenantAddr ? tenantAddr.phoneNumber : '',
          tenantAddr ? tenantAddr.areaCode : ''
        ),
        licence_holder: this.getLicenceHolder(tenantAddr),
        contact_agent: this.getContactAgent(
          ttlsData.contactFirstName,
          ttlsData.contactMiddleName,
          ttlsData.contactLastName
        ),
        contact_company_name: ttlsData.contactCompanyName,
        contact_first_name: ttlsData.contactFirstName,
        contact_middle_name: ttlsData.contactMiddleName,
        contact_last_name: ttlsData.contactLastName,
        contact_phone_number: this.formatPhoneNumber(ttlsData.contactPhoneNumber, null),
        contact_email_address: ttlsData.contactEmail,
        inspected_date: ttlsData.inspectionDate,
        mailing_address: getNFRMailingAddress(tenantAddr),
        mailing_address_line_1: tenantAddr ? tenantAddr.addrLine1 : '',
        mailing_address_line_2: tenantAddr ? tenantAddr.addrLine2 : '',
        mailing_address_line_3: tenantAddr ? tenantAddr.addrLine3 : '',
        mailing_city: tenantAddr ? tenantAddr.city : '',
        mailing_province_state_code: tenantAddr ? tenantAddr.regionCd : '',
        mailing_postal_code: tenantAddr ? formatPostalCode(tenantAddr.postalCode) : '',
        mailing_zip: tenantAddr ? tenantAddr.zipCode : '',
        mailing_country_code: tenantAddr ? tenantAddr.countryCd : '',
        mailing_country: tenantAddr ? tenantAddr.country : '',
        location_description: ttlsData.locLand,
        tenure: tenure ? JSON.stringify(tenure) : '',
      };

      return axios
        .post(
          url,
          { printRequestDetail: mappedData },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then((res) => {
          return res.data;
        });
    } else {
      console.log('Error');
      return { message: 'No data found' };
    }
  }

  // get a ticdi json object from the backend using a dtid
  async getJSONsByDTID(dtid: number): Promise<any> {
    const url = `${hostname}:${port}/print-request-detail/${dtid}`;
    return axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
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
          'Content-Type': 'application/json',
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
    return tenantAddr
      ? tenantAddr.legalName
        ? tenantAddr.legalName
        : [tenantAddr.firstName, tenantAddr.middleName, tenantAddr.lastName].filter(Boolean).join(' ')
      : '';
  }

  // returns the individual name
  getLicenceHolder(tenantAddr: { firstName: string; middleName: string; lastName: string }): string {
    if (tenantAddr && (tenantAddr.firstName || tenantAddr.middleName || tenantAddr.lastName)) {
      let name = tenantAddr.firstName ? tenantAddr.firstName : '';
      name = tenantAddr.middleName ? name.concat(' ' + tenantAddr.middleName) : name;
      name = tenantAddr.lastName ? name.concat(' ' + tenantAddr.lastName) : name;
      return name;
    }
    return '';
  }

  // returns the individual name
  getContactAgent(firstName: string, middleName: string, lastName: string): string {
    if (firstName || middleName || lastName) {
      let name = firstName ? firstName : '';
      name = middleName ? name.concat(' ' + middleName) : name;
      name = lastName ? name.concat(' ' + lastName) : name;
      return name;
    }
    return '';
  }

  concatCityProvPostal(tenantAddr: { city: string; provAbbr: string; postalCode: string }): string {
    const addressParts = [];
    if (tenantAddr) {
      if (tenantAddr.city) {
        addressParts.push(tenantAddr.city);
      }

      if (tenantAddr.provAbbr) {
        addressParts.push(tenantAddr.provAbbr);
      }

      if (tenantAddr.postalCode) {
        addressParts.push(formatPostalCode(tenantAddr.postalCode));
      }
    }

    return addressParts.join(' ');
  }

  formatInspectedDate(inspected_date: string): string {
    if (inspected_date && inspected_date.length == 8) {
      return (
        inspected_date.substring(0, 4) + '-' + inspected_date.substring(4, 6) + '-' + inspected_date.substring(6, 8)
      );
    }
    return inspected_date;
  }

  formatPhoneNumber(phone_number: string, area_code: string): string {
    if (phone_number && phone_number.length == 10) {
      return phone_number.replace(/(\d{3})(\d{3})(\d{4})/, '($1)$2-$3');
    } else if (phone_number && area_code && (phone_number + area_code).length == 10) {
      return (area_code + phone_number).replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else {
      return '';
    }
  }

  callHttp(id: number): Observable<Array<Object>> {
    const bearerToken = this.webade_token;
    const url = process.env.ttls_url + id;
    return this.http.get(url, { headers: { Authorization: 'Bearer ' + bearerToken } }).pipe(
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
    const encodedToken = Buffer.from(token).toString('base64');
    let config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + encodedToken,
      },
    };

    const grantTypeParam = new URLSearchParams();
    grantTypeParam.append('grant_type', 'client_credentials');

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
    const url = this.webade_url + '?grant_type=client_credentials&disableDeveloperFilter=true&scope=TTLS.*';
    const authorization = base64.encode(this.webade_username + ':' + this.webade_secret);
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
          console.log('Response:');
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log('Request:');
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log('Error config:');
        console.log(error.config);
        console.log(error);
      });
  }

  // TODO
  async generateNFRReport(prdid: number, templateId: number, variables: any, username: string) {
    const url = `${hostname}:${port}/document-data/view/${prdid}`;
    const templateUrl = `${hostname}:${port}/document-template/find-one/${templateId}`;
    const logUrl = `${hostname}:${port}/print-request-log/`;
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // TODO get the view for specified prdid from the new NFR entity
    const data = await axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        return res.data;
      });
    if (data.InspectionDate) {
      data['InspectionDate'] = this.formatInspectedDate(data.InspectionDate);
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // get the document template
    const documentTemplateObject: { id: number; the_file: string } = await axios.get(templateUrl).then((res) => {
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
        convertTo: 'docx',
        overwrite: true,
        reportName: 'nfr-report',
      },
      template: {
        content: `${bufferBase64}`,
        encodingType: 'base64',
        fileType: 'docx',
      },
    });

    const conf = {
      method: 'post',
      url: process.env.cdogs_url,
      headers: {
        Authorization: `Bearer ${cdogsToken}`,
        'Content-Type': 'application/json',
      },
      responseType: 'arraybuffer',
      data: md,
    };
    const ax = require('axios');
    const response = await ax(conf).catch((error) => {
      console.log(error.response);
    });
    return response.data;
  }
}
