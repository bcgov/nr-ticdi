import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";
import { firstValueFrom } from "rxjs";
import { TTLSService } from "src/ttls/ttls.service";
import { REPORT_TYPES, numberWords } from "utils/constants";
import { ProvisionJSON, VariableJSON } from "utils/types";
import {
  convertToSpecialCamelCase,
  formatMoney,
  formatPostalCode,
  nfrAddressBuilder,
} from "utils/util";
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
    const documentType = REPORT_TYPES[0]; // Land Use Report
    const url = `${hostname}:${port}/print-request-detail/view/` + prdid;
    const templateUrl = `${hostname}:${port}/document-template/get-active-report/${documentType}`;
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
    idirName: string,
    variableJson: VariableJSON[],
    provisionJson: ProvisionJSON[]
  ) {
    const templateUrl = `${hostname}:${port}/document-template/get-active-report/${variantName}`;
    const logUrl = `${hostname}:${port}/nfr-data-log/`;

    // get raw ttls data for later
    await this.ttlsService.setWebadeToken();
    const rawData: any = await firstValueFrom(this.ttlsService.callHttp(dtid))
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });

    // get the document template
    const documentTemplateObject: {
      id: number;
      the_file: string;
      document_template: string;
    } = await axios.get(templateUrl).then((res) => {
      return res.data;
    });

    // Format variables with names that the document template expects
    const variables: any = {};
    variableJson.forEach(({ variable_name, variable_value }) => {
      const newVariableName = variable_name
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (match) => match.toUpperCase())
        .replace(/\s/g, "_")
        .replace(/^(\w)/, (match) => match.toUpperCase());

      if (variable_value.includes("«")) {
        // regex which converts «DB_TENURE_TYPE» to {d.DB_Tenure_Type}, also works for VAR_
        variable_value = variable_value.replace(
          /«([^»]+)»/g,
          function (match, innerText) {
            innerText = convertToSpecialCamelCase(innerText);
            return "{d." + innerText + "}";
          }
        );
      }

      variables[`VAR_${newVariableName}`] = variable_value;
      variables[`${variable_name}`] = variable_value;
      // workaround for template formatting
      if (
        newVariableName == "Occ_Rent_Details" ||
        newVariableName == "Replacement_Tenure_Type" ||
        newVariableName == "Why_Land_Differs" ||
        newVariableName == "Sect5_Free_Field"
      ) {
        variables[`VAR_${newVariableName}`] =
          variables[`VAR_${newVariableName}`] + "\r\n\r\n";
        variables[`${variable_name}`] =
          variables[`${variable_name}`] + "\r\n\r\n";
      }
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
      if (provision.free_text.includes("«")) {
        // regex which converts «DB_TENURE_TYPE» to {d.DB_Tenure_Type}, also works for VAR_
        provision.free_text = provision.free_text.replace(
          /«([^»]+)»/g,
          function (match, innerText) {
            innerText = convertToSpecialCamelCase(innerText);
            return "{d." + innerText + "}";
          }
        );
      }
      showProvisionSections[varName] = provision.free_text;
      // workaround for template formatting
      if (
        showProvisionSections[varName] != "" &&
        varName != "SectionFifteen_1_Text" &&
        varName != "SectionFive_1_Text" &&
        varName != "SectionFive_2_Text" &&
        varName != "SectionFive_3_Text"
      ) {
        showProvisionSections[varName] =
          showProvisionSections[varName] + "\r\n\r\n";
      }

      const showVarName = `showSection${groupText}_${index}`;
      showProvisionSections[showVarName] = 1;
    });

    // Format the raw ttls data
    const tenantAddr = rawData.tenantAddr[0];
    const interestParcel = rawData.interestParcel[0];
    const DB_Address_Mailing_Tenant = tenantAddr
      ? nfrAddressBuilder(tenantAddr)
      : "";

    // Update the formatting of certain money variables
    const VAR_Fee_Documentation_Amount: number =
      variables && variables.VAR_Fee_Documentation_Amount
        ? !isNaN(variables.VAR_Fee_Documentation_Amount)
          ? parseFloat(variables.VAR_Fee_Documentation_Amount)
          : 0
        : 0;
    if (variables && variables.VAR_Fee_Documentation_Amount) {
      !isNaN(variables.VAR_Fee_Documentation_Amount)
        ? (variables.VAR_Fee_Documentation_Amount = formatMoney(
            parseFloat(variables.VAR_Fee_Documentation_Amount)
          ))
        : (variables.VAR_Fee_Documentation_Amount = "0.00");
    }

    const VAR_Fee_Application_Amount: number =
      variables && variables.VAR_Fee_Application_Amount
        ? !isNaN(variables.VAR_Fee_Application_Amount)
          ? parseFloat(variables.VAR_Fee_Application_Amount)
          : 0
        : 0;
    if (variables && variables.VAR_Fee_Application_Amount) {
      !isNaN(variables.VAR_Fee_Application_Amount)
        ? (variables.VAR_Fee_Application_Amount = formatMoney(
            parseFloat(variables.VAR_Fee_Application_Amount)
          ))
        : (variables.VAR_Fee_Application_Amount = "0.00");
    }

    const VAR_Fee_Occupational_Rental_Amount: number =
      variables && variables.VAR_Fee_Occupational_Rental_Amount
        ? !isNaN(variables.VAR_Fee_Occupational_Rental_Amount)
          ? parseFloat(variables.VAR_Fee_Occupational_Rental_Amount)
          : 0
        : 0;
    if (variables && variables.VAR_Fee_Occupational_Rental_Amount) {
      if (
        !isNaN(variables.VAR_Fee_Occupational_Rental_Amount) &&
        parseFloat(variables.VAR_Fee_Occupational_Rental_Amount) != 0
      ) {
        variables.VAR_Fee_Occupational_Rental_Amount = formatMoney(
          parseFloat(variables.VAR_Fee_Occupational_Rental_Amount)
        );
      } else {
        variables.VAR_Fee_Occupational_Rental_Amount = "0.00";
      }
    }

    const VAR_Fee_Other_Credit_Amount: number =
      variables && variables.VAR_Fee_Other_Credit_Amount
        ? !isNaN(variables.VAR_Fee_Other_Credit_Amount)
          ? parseFloat(variables.VAR_Fee_Other_Credit_Amount)
          : 0
        : 0;
    if (variables && variables.VAR_Fee_Other_Credit_Amount) {
      !isNaN(variables.VAR_Fee_Other_Credit_Amount)
        ? (variables.VAR_Fee_Other_Credit_Amount = formatMoney(
            parseFloat(variables.VAR_Fee_Other_Credit_Amount)
          ))
        : (variables.VAR_Fee_Other_Credit_Amount = "0.00");
    }

    const GST_Rate: number = rawData && rawData.gstRate ? rawData.gstRate : 0;
    const DB_Fee_Payable_Type: number = rawData.feePayableType;
    const DB_Fee_Payable_Amount: number = rawData.feePayableAmount
      ? rawData.feePayableAmount
      : 0;
    const DB_Fee_Payable_Amount_GST: number = rawData.feePayableAmountGst
      ? rawData.feePayableAmountGst
      : 0;
    const DB_GST_Exempt: string = rawData.gstExempt ? rawData.gstExempt : "N";
    // unused right now
    const DB_GST_Exempt_Area: number = rawData.gstExemptArea
      ? rawData.gstExemptArea
      : 0;
    let DB_Total_GST_Amount: number;

    if (DB_GST_Exempt === "Y") {
      DB_Total_GST_Amount =
        ((DB_Fee_Payable_Amount_GST +
          VAR_Fee_Documentation_Amount +
          VAR_Fee_Application_Amount) *
          GST_Rate) /
        100.0;
    } else {
      DB_Total_GST_Amount =
        ((DB_Fee_Payable_Amount_GST +
          VAR_Fee_Documentation_Amount +
          VAR_Fee_Occupational_Rental_Amount +
          VAR_Fee_Application_Amount) *
          GST_Rate) /
        100.0;
    }

    const DB_Total_Monies_Payable: number =
      DB_Total_GST_Amount +
      DB_Fee_Payable_Amount_GST +
      DB_Fee_Payable_Amount +
      VAR_Fee_Documentation_Amount +
      VAR_Fee_Occupational_Rental_Amount +
      VAR_Fee_Application_Amount -
      VAR_Fee_Other_Credit_Amount;

    const ttlsData = {
      DB_Address_Regional_Office: nfrAddressBuilder({
        addrLine1: rawData.regOfficeStreet,
        city: rawData.regOfficeCity,
        provAbbr: rawData.regOfficeProv,
        postalCode: rawData.regOfficePostalCode,
      }),
      DB_Name_BCAL_Contact: idirName,
      DB_File_Number: rawData.fileNum,
      DB_Address_Mailing_Tenant: DB_Address_Mailing_Tenant,
      DB_Tenure_Type: rawData.type // convert a tenure type like LICENSE to License
        ? rawData.type.toLowerCase().charAt(0).toUpperCase() +
          rawData.type.toLowerCase().slice(1)
        : "",
      DB_Legal_Description: interestParcel
        ? interestParcel.legalDescription
        : "",
      DB_Fee_Payable_Type: DB_Fee_Payable_Type,
      DB_Fee_Payable_Amount_GST:
        DB_Fee_Payable_Amount_GST == 0
          ? ""
          : formatMoney(DB_Fee_Payable_Amount_GST),
      DB_Fee_Payable_Amount: formatMoney(DB_Fee_Payable_Amount),
      DB_FP_Asterisk: "*",
      DB_Total_GST_Amount: formatMoney(DB_Total_GST_Amount),
      DB_Total_Monies_Payable: formatMoney(DB_Total_Monies_Payable),
      DB_Address_Line_Regional_Office: nfrAddressBuilder({
        addrLine1: rawData.regOfficeStreet,
        city: rawData.regOfficeCity,
        provAbbr: rawData.regOfficeProv,
        postalCode: rawData.regOfficePostalCode,
      }),
    }; // parse out the rawData, variableJson, and provisionJson into something useable

    // combine the formatted TTLS data, variables, and provision sections
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
    let cdogsData = {
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
    };
    const md = JSON.stringify(cdogsData);

    let conf = {
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
    // response.data is the docx file after the first insertions
    const firstFile = response.data;
    // convert the docx file buffer to base64 for a second cdogs conversion
    const base64File = Buffer.from(firstFile).toString("base64");
    cdogsData.template.content = base64File;
    const md2 = JSON.stringify(cdogsData);
    conf.data = md2;
    const response2 = await ax(conf).catch((error) => {
      console.log(error.response);
    });
    // response2.data is the docx file after the second insertions
    // (anything nested in a variable or provision should be inserted at this point)
    return response2.data;
  }

  async getNFRProvisionsByVariantAndDtid(
    variantName: string,
    dtid: number
  ): Promise<any> {
    const returnItems = [
      "type",
      "provision_name",
      "help_text",
      "free_text",
      "category",
      "provision_group",
      "id",
      "mandatory",
    ];
    let reduced, provisions;
    // nfrDataId exists so return a list of provisions with pre-existing free_text data inserted, certain provisions preselected
    const url = `${hostname}:${port}/nfr-data/provisions/${variantName}/${dtid}`;
    const nfrProvisions = await axios
      .get(url)
      .then((res) => {
        return res.data;
      })
      .catch((err) => console.log(err.response.data));
    if (nfrProvisions) {
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
      const url2 = `${hostname}:${port}/nfr-provision/variant/${variantName}`;
      provisions = await axios
        .get(url2)
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

  async getNFRVariablesByVariantAndDtid(
    variantName: string,
    dtid: number
  ): Promise<any> {
    // if an nfrId is provided, get the variables with any existing user specified values
    const url = `${hostname}:${port}/nfr-data/variables/${variantName}/${dtid}`;
    const variables = await axios
      .get(url)
      .then((res) => {
        return res.data.variables;
      })
      .catch((err) => console.log(err.response.data));
    if (variables) {
      return variables;
    } else {
      // grab the basic variable list corresponding to the variant
      const url2 = `${hostname}:${port}/nfr-provision/get-provision-variables/variant/${variantName}`;
      return axios.get(url2).then((res) => {
        return res.data;
      });
    }
  }

  async getMandatoryProvisions() {
    const url = `${hostname}:${port}/nfr-provision/get-all-mandatory-provisions/0`;
    return await axios.get(url).then((res) => {
      return res.data;
    });
  }

  async getMandatoryProvisionsByVariant(variantName: string) {
    const url = `${hostname}:${port}/nfr-provision/get-mandatory-provisions/variant/${variantName}`;
    return await axios.get(url).then((res) => {
      return res.data;
    });
  }

  async getNFRData() {
    const nfrDataUrl = `${hostname}:${port}/nfr-data`;
    const templateUrl = `${hostname}:${port}/document-template/nfr-template-info`;
    const nfrData = await axios
      .get(nfrDataUrl)
      .then((res) => {
        return res.data;
      })
      .catch((err) => console.log(err.response.data));
    const templateIds = [];
    for (let entry of nfrData) {
      templateIds.push(entry.template_id);
    }
    const allTemplates: {
      id: number;
      file_name: string;
      active_flag: boolean;
      is_deleted: boolean;
      template_version: number;
    }[] = await axios
      .post(templateUrl, templateIds)
      .then((res) => {
        return res.data;
      })
      .catch((err) => console.log(err.response.data));

    // Combine the corresponding templates with the nfr data.
    const combinedArray = [];

    let i = 0;
    let j = 0;

    while (i < allTemplates.length && j < nfrData.length) {
      const template = allTemplates[i];
      const nfr = nfrData[j];

      if (template.id === nfr.template_id) {
        if (!template.is_deleted) {
          combinedArray.push({
            dtid: nfr.dtid,
            version: template.template_version,
            file_name: template.file_name,
            updated_date: nfr.update_timestamp.split("T")[0],
            status: nfr.status,
            active: template.active_flag,
            nfr_id: nfr.id,
            variant_name: nfr.variant_name,
          });
        }
        j++;
      } else if (template.id < nfr.template_id) {
        i++;
      } else {
        j++;
      }
    }
    return combinedArray;
  }

  async getActiveNfrDataByDtid(dtid: number): Promise<any> {
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
    const templateUrl = `${hostname}:${port}/document-template/get-active-report/${variant_name}`;
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

  async getEnabledProvisionsByVariant(variantName: string) {
    const url = `${hostname}:${port}/nfr-provision/get-mandatory-provisions/variant/${variantName}`;
    return axios.get(url).then((res) => {
      return res.data;
    });
  }

  async getEnabledProvisionsByVariantAndDtid(
    variantName: string,
    dtid: number
  ) {
    const url = `${hostname}:${port}/nfr-data/get-enabled-provisions/${variantName}/${dtid}`;
    return axios.get(url).then((res) => {
      return res.data;
    });
  }

  async getVariantsWithIds() {
    const url = `${hostname}:${port}/nfr-provision/get-variants-with-ids/0`;
    return axios.get(url).then((res) => {
      return res.data;
    });
  }
}
