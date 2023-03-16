import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";
import { firstValueFrom } from "rxjs";
import { TTLSService } from "src/ttls/ttls.service";
import { numberWords } from "utils/constants";
import { ProvisionJSON, VariableJSON } from "utils/types";
const axios = require("axios");

dotenv.config();
let hostname: string;
let port: number;

@Injectable()
export class ReportService {
  constructor(
    private readonly httpService: HttpService,
    private readonly ttlsService: TTLSService
  ) {
    hostname = process.env.backend_url
      ? process.env.backend_url
      : `http://localhost`;
    // local development backend port is 3001, docker backend port is 3000
    port = process.env.backend_url ? 3000 : 3001;
  }

  /**
   * Generates a LUR report name using tenure file number
   * and a version number. The version number is incremented
   * each time someone generates a LUR report.
   *
   * @param tenureFileNumber
   * @returns
   */
  async generateReportName(dtid: number, tenureFileNumber: string) {
    const url = `${hostname}:${port}/print-request-log/version/` + dtid;
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
    const templateUrl = `${hostname}:${port}/document-template/get-active-report/1`;
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
      data["InspectionDate"] = this.ttlsService.formatInspectedDate(
        data.InspectionDate
      );
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

    const cdogsToken = await this.ttlsService.callGetToken();
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

  /**
   * Generates an NFR report name using tenure file number
   * and a version number. The version number is incremented
   * each time someone generates a NFR report.
   *
   * @param tenureFileNumber
   * @returns
   */
  async generateNFRReportName(dtid: number, tenureFileNumber: string) {
    const url = `${hostname}:${port}/nfr-data-log/version/` + dtid;
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
    return { reportName: "NFR_" + tenureFileNumber + "_" + version };
  }

  async generateNFRReport(
    dtid: number,
    variantName: string,
    idirUsername: string,
    variableJson: VariableJSON[],
    provisionJson: ProvisionJSON[]
  ) {
    const templateUrl = `${hostname}:${port}/document-template/get-active-report/2`;
    const logUrl = `${hostname}:${port}/nfr-data-log/`;
    await this.ttlsService.setWebadeToken();
    const rawData: any = await firstValueFrom(this.ttlsService.callHttp(dtid))
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
    const tenantAddr = rawData.tenantAddr[0];
    const interestParcel = rawData.interestParcel[0];
    const DB_Address_Mailing_Tenant = `${
      tenantAddr ? tenantAddr.legalName : ""
    },\r\n ${tenantAddr ? tenantAddr.addrLine1 : ""},\r\n ${
      tenantAddr ? tenantAddr.city : ""
    }, ${tenantAddr ? tenantAddr.provAbbr : ""},\r\n ${
      tenantAddr ? tenantAddr.postalCode : ""
    },\r\n`;
    const ttlsData = {
      DB_Address_Regional_Office: `${rawData.regOfficeStreet},\r\n ${rawData.regOfficeCity},\r\n ${rawData.regOfficeProv},\r\n ${rawData.regOfficePostalCode}`,
      DB_Name_BCAL_Contact: this.ttlsService.getContactAgent(
        rawData.contactFirstName,
        rawData.contactMiddleName,
        rawData.contactLastName
      ),
      DB_File_Number: rawData.fileNum,
      DB_Address_Mailing_Tenant: DB_Address_Mailing_Tenant,
      DB_Tenure_Type: rawData.type,
      DB_Legal_Description: interestParcel
        ? interestParcel.legalDescription
        : "",
      DB_Fee_Payable_Type: rawData.feePayableType,
      DB_Fee_Payable_Amount_GST: rawData.feePayableAmountGst,
      DB_Fee_Payable_Amount: rawData.feePayableAmount,
      DB_FP_Asterisk: "*",
      DB_Total_GST_Amount: (rawData.gstRate / 100) * rawData.feePayableAmount,
      DB_Total_Monies_Payable:
        (rawData.gstRate / 100) * rawData.feePayableAmount +
        rawData.feePayableAmount,
      DB_Address_Line_Regional_Office: `${rawData.regOfficeStreet},\r\n ${rawData.regOfficeCity},\r\n ${rawData.regOfficeProv},\r\n ${rawData.regOfficePostalCode}`,
    }; // parse out the rawData, variableJson, and provisionJson into something useable
    // get the document template
    const documentTemplateObject: { id: number; the_file: string } = await axios
      .get(templateUrl)
      .then((res) => {
        return res.data;
      });

    // Format variables with names that the document template expects
    const variables = {};
    variableJson.forEach(({ variable_name, variable_value }) => {
      const newVariableName = variable_name
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (match) => match.toUpperCase())
        .replace(/\s/g, "_")
        .replace(/^(\w)/, (match) => match.toUpperCase());
      variables[`VAR_${newVariableName}`] = variable_value;
    });

    // Format provisions in a way that the document template expects
    const groupIndexMap = new Map<number, number>();
    const showProvisionSections: Record<string, any> = {};
    provisionJson.forEach((provision) => {
      const group = provision.provision_group;
      const index = (groupIndexMap.get(group) ?? 0) + 1;
      groupIndexMap.set(group, index);

      const groupText = numberWords[group];
      const varName = `Section${groupText}_${index}_Text`;
      showProvisionSections[varName] = provision.free_text;

      const showVarName = `showSection${groupText}_${index}`;
      showProvisionSections[showVarName] = 1;
    });
    const data = Object.assign({}, ttlsData, variables, showProvisionSections);

    // Log the request
    const document_template_id = documentTemplateObject.id;
    await axios.post(logUrl, {
      document_template_id: document_template_id,
      dtid: dtid,
      request_app_user: idirUsername,
      request_json: JSON.stringify(data),
    });

    // Save the NFR Data
    await this.saveNFR(
      dtid,
      variantName,
      "Complete",
      provisionJson,
      variableJson,
      idirUsername
    );

    // Generate the report
    const cdogsToken = await this.ttlsService.callGetToken();
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

  async getNFRProvisionsByVariant(
    variantName: string,
    nfrId: number
  ): Promise<any> {
    const returnItems = [
      "type",
      "provision_name",
      "help_text",
      "free_text",
      "category",
      "provision_group",
      "id",
    ];
    let reduced, provisions;
    if (nfrId != -1) {
      // nfrDataId exists so return a list of provisions with pre-existing free_text data inserted, certain provisions preselected
      const url = `${hostname}:${port}/nfr-data/provisions/${nfrId}`;
      const nfrProvisions = await axios
        .get(url)
        .then((res) => {
          return res.data;
        })
        .catch((err) => console.log(err.response.data));
      const provisionIds = nfrProvisions.provisionIds;
      provisions = nfrProvisions.provisions;
      reduced = provisions.map((obj) => {
        if (provisionIds.includes(obj.id)) {
          obj.select = true;
        } else {
          obj.select = false;
        }
        return obj;
      });
    } else {
      // no nfrDataId so just return generic provisions with all of them deselected by default
      const url = `${hostname}:${port}/nfr-provision/variant/${variantName}`;
      provisions = await axios
        .get(url)
        .then((res) => {
          return res.data;
        })
        .catch((err) => console.log(err.response.data));
      reduced = provisions.map((obj) =>
        Object.keys(obj)
          .filter((key) => returnItems.includes(key))
          .reduce(
            (acc, key) => {
              acc[key] = obj[key];
              return acc;
            },
            { select: false }
          )
      );
    }
    // make the returned data readable for the ajax request
    return reduced.map((obj) => {
      const groupObj = obj.provision_group;
      delete obj["provision_group"];
      obj["max"] = groupObj.max;
      obj["provision_group"] = groupObj.provision_group;
      return obj;
    });
  }

  async getGroupMaxByVariant(variantName: string): Promise<any> {
    const url = `${hostname}:${port}/nfr-provision/get-group-max/variant/${variantName}`;
    return await axios.get(url).then((res) => {
      return res.data;
    });
  }

  async getNFRVariablesByVariant(
    variantName: string,
    nfrId: number
  ): Promise<any> {
    if (nfrId != -1) {
      // if an nfrId is provided, get the variables with any existing user specified values
      const url = `${hostname}:${port}/nfr-data/variables/${nfrId}`;
      return axios
        .get(url)
        .then((res) => {
          return res.data.variables;
        })
        .catch((err) => console.log(err.response.data));
    } else {
      // grab the basic variable list corresponding to the variant
      const url = `${hostname}:${port}/nfr-provision/get-provision-variables/variant/${variantName}`;
      return axios.get(url).then((res) => {
        return res.data;
      });
    }
  }

  async getMandatoryProvisionsByVariant(variantName: string) {
    const url = `${hostname}:${port}/nfr-provision/get-mandatory-provisions/variant/${variantName}`;
    return await axios.get(url).then((res) => {
      return res.data;
    });
  }

  async getNfrData(nfrDataId: number): Promise<any> {
    const url = `${hostname}:${port}/nfr-data/${nfrDataId}`;
    const data = await axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        return res.data;
      });
    return data;
  }

  async getNfrDataByDtid(dtid: number): Promise<any> {
    const url = `${hostname}:${port}/nfr-data/dtid/${dtid}`;
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

  async saveNFR(
    dtid: number,
    variant_name: string,
    status: string,
    provisionJsonArray: ProvisionJSON[],
    variableJsonArray: VariableJSON[],
    idir_username: string
  ) {
    const templateUrl = `${hostname}:${port}/document-template/get-active-report/${encodeURI(
      "Notice of Final Review"
    )}`;
    const documentTemplate = await axios.get(templateUrl).then((res) => {
      return res.data;
    });
    const url = `${hostname}:${port}/nfr-data`;
    const data = {
      dtid: dtid,
      variant_name: variant_name,
      template_id: documentTemplate.id,
      status: status,
      create_userid: idir_username,
      ttls_data: [],
      provisionJsonArray,
      variableJsonArray,
    };
    await axios
      .post(url, {
        body: data,
      })
      .then((res) => {
        return res.data;
      });
  }
}
