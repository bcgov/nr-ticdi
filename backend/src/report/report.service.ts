import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { firstValueFrom } from 'rxjs';
import { DocumentTemplateService } from 'src/document_template/document_template.service';
import { ProvisionService } from 'src/provision/provision.service';
import { TTLSService } from 'src/ttls/ttls.service';
import { GL_REPORT_TYPE, LUR_REPORT_TYPE, numberWords, sectionTitles } from 'utils/constants';
import { ProvisionJSON, VariableJSON } from 'utils/types';
import { convertToSpecialCamelCase, formatMoney, grazingLeaseVariables, nfrAddressBuilder } from 'utils/util';
import { DocumentDataService } from 'src/document_data/document_data.service';
import { DocumentTemplate } from 'src/document_template/entities/document_template.entity';
import { DocumentDataLogService } from 'src/document_data_log/document_data_log.service';
import { DocumentTypeService } from 'src/document_type/document_type.service';
import { Provision } from 'src/provision/entities/provision.entity';
const axios = require('axios');

// generate report needs to be consolidated which is impossible until we figure out how provisions & variables will be dynamically inserted into the docx files

dotenv.config();
let hostname: string;
let port: number;

@Injectable()
export class ReportService {
  constructor(
    private readonly ttlsService: TTLSService,
    private readonly documentTemplateService: DocumentTemplateService,
    private readonly documentDataLogService: DocumentDataLogService,
    private readonly provisionService: ProvisionService,
    private readonly documentDataService: DocumentDataService,
    private readonly documentTypeService: DocumentTypeService
  ) {
    hostname = process.env.backend_url ? process.env.backend_url : `http://localhost`;
    // local development backend port is 3001, docker backend port is 3000
    port = process.env.backend_url ? 3000 : 3001;
  }

  // /**
  //  * Generates a LUR report name using tenure file number
  //  * and a version number. The version number is incremented
  //  * each time someone generates a LUR report.
  //  *
  //  * @param tenureFileNumber
  //  * @returns
  //  */
  // async generateReportName(dtid: number, tenureFileNumber: string, documentType: string) {
  //   const url = `${hostname}:${port}/print-request-log/version/${dtid}/${documentType}`;
  //   // grab the next version string for the dtid
  //   const version = await axios
  //     .get(url, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     })
  //     .then((res) => {
  //       return res.data;
  //     });
  //   return {
  //     reportName: documentType + '_' + tenureFileNumber + '_' + version + '.docx',
  //   };
  // }

  async generateReportName(dtid: number, tenure_file_number: string, document_type_id: number) {
    const version = await this.documentDataLogService.findNextVersion(dtid, document_type_id);
    const documentType = await this.documentTypeService.findById(document_type_id);
    // probably a better way of doing this
    let prefix = 'report';
    if (documentType) {
      if (documentType.name.toLowerCase().includes('notice of final review')) {
        prefix = 'NFR';
      } else if (documentType.name.toLowerCase().includes('land use report')) {
        prefix = 'LUR';
      } else if (documentType.name.toLowerCase().includes('grazing')) {
        prefix = 'GL';
      }
    }
    return {
      reportName: prefix + '_' + tenure_file_number + '_' + version + '.docx',
    };
  }

  async generateReport(
    dtid: number,
    document_type_id: number,
    idirUsername: string,
    idirName: string,
    variableJson: VariableJSON[],
    provisionJson: ProvisionJSON[]
  ) {
    // For now, hardcode this to call the different static report routes based on document type
    const documentType = await this.documentTypeService.findById(document_type_id);
    if (documentType) {
      if (documentType.name.toLowerCase().includes('notice of final review')) {
        return this.generateNFRReport(dtid, document_type_id, idirUsername, idirName, variableJson, provisionJson);
      } else if (documentType.name.toLowerCase().includes('land use report')) {
        return this.generateLURReport(dtid, idirUsername);
      } else if (documentType.name.toLowerCase().includes('grazing')) {
        return this.generateGLReport(dtid, idirUsername);
      }
    }
  }

  /**
   * Generates the Land Use Report using CDOGS
   *
   * @param prdid
   * @param username
   * @returns
   */
  // needs a rewrite as prdid is being removed...
  async generateLURReport(prdid: number, username: string) {
    prdid = 1;
    const documentType = LUR_REPORT_TYPE;
    const url = `${hostname}:${port}/print-request-detail/view/${prdid}`;
    const templateUrl = `${hostname}:${port}/document-template/get-active-report/${documentType}`;
    const logUrl = `${hostname}:${port}/print-request-log/`;

    // get the view given the print request detail id
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
      data['InspectionDate'] = this.ttlsService.formatInspectedDate(data.InspectionDate);
    }
    // get the document template
    const documentTemplateObject: { id: number; the_file: string } = await axios.get(templateUrl).then((res) => {
      return res.data;
    });

    // log the request
    const document_template_id = documentTemplateObject.id;
    await axios.post(logUrl, {
      document_template_id: document_template_id,
      print_request_detail_id: prdid,
      document_type: documentType,
      dtid: data.DTID,
      request_app_user: username,
      request_json: JSON.stringify(data),
    });

    const cdogsToken = await this.ttlsService.callGetToken();
    const bufferBase64 = documentTemplateObject.the_file;
    const md = JSON.stringify({
      data,
      formatters:
        '{"myFormatter":"_function_myFormatter|function(data) { return data.slice(1); }","myOtherFormatter":"_function_myOtherFormatter|function(data) {return data.slice(2);}"}',
      options: {
        cacheReport: false,
        convertTo: 'docx',
        overwrite: true,
        reportName: 'ticdi-report',
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
    console.log('time - ' + Date.now());
    return response.data;
  }

  /**
   * Generates the Grazing Lease Use Report using CDOGS
   *
   * @param prdid
   * @param username
   * @returns
   */
  async generateGLReport(dtid: number, username: string) {
    const documentType = GL_REPORT_TYPE;
    const templateUrl = `${hostname}:${port}/document-template/get-active-report/${documentType}`;
    const logUrl = `${hostname}:${port}/print-request-log/`;

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
    const documentTemplateObject: { id: number; the_file: string } = await axios.get(templateUrl).then((res) => {
      return res.data;
    });
    const interestParcel = rawData.interestParcel;
    const tenantAddr = rawData.tenantAddr;
    const regVars = {
      regOfficeStreet: rawData && rawData.regOfficeStreet ? rawData.regOfficeStreet : '',
      regOfficeCity: rawData && rawData.regOfficeCity ? rawData.regOfficeCity : '',
      regOfficeProv: rawData && rawData.regOfficeProv ? rawData.regOfficeProv : '',
      regOfficePostalCode: rawData && rawData.regOfficePostalCode ? rawData.regOfficePostalCode : '',
    };
    const glVariables = grazingLeaseVariables(tenantAddr, interestParcel, regVars);

    const data = {
      DB_File_Number: rawData.fileNum,
      DB_Document_Number: dtid,
      DB_Address_Street_Tenant: glVariables.glStreetAddress || glVariables.glMailingAddress,
      DB_Address_Regional_Office: glVariables.addressRegionalOffice,
      DB_Address_Mailing_Tenant: glVariables.glMailingAddress || glVariables.glStreetAddress,
      DB_Name_Tenant: glVariables.mailingName,
      DB_Name_Tenant_List: glVariables.mailingNameList,
      DB_Name_Corporation: glVariables.mailingCorp,
      DB_Legal_Description: glVariables.legalDescription,
    };

    // log the request
    const document_template_id = documentTemplateObject.id;
    await axios.post(logUrl, {
      document_template_id: document_template_id,
      print_request_detail_id: null,
      document_type: documentType,
      dtid: dtid,
      request_app_user: username,
      request_json: JSON.stringify(data),
    });

    const cdogsToken = await this.ttlsService.callGetToken();
    const bufferBase64 = documentTemplateObject.the_file;
    const md = JSON.stringify({
      data,
      formatters:
        '{"myFormatter":"_function_myFormatter|function(data) { return data.slice(1); }","myOtherFormatter":"_function_myOtherFormatter|function(data) {return data.slice(2);}"}',
      options: {
        cacheReport: false,
        convertTo: 'docx',
        overwrite: true,
        reportName: 'ticdi-report',
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

  // /**
  //  *
  //  * @param dtid
  //  * @param idir_username
  //  * @param reportType - id of the report type used to get report type & active template
  //  */
  // async generateReportNew(
  //   dtid: number,
  //   idir_username: string,
  //   reportId: number
  // ) {
  //   const documentTemplateObject: { id: number; the_file: string; document_type: string } = await this.documentTemplateService.getReportTemplate(reportId);

  //   const data = {};

  //   // log the request
  //   const logData = {
  //     document_template_id: documentTemplateObject.id,
  //     print_request_detail_id: null,
  //     document_type: documentTemplateObject.document_type,
  //     dtid: dtid,
  //     request_app_user: idir_username,
  //     request_json: JSON.stringify(data),
  //     create_userid: idir_username,
  //   };
  //   await this.printRequestLogService.create(logData);

  //   const bufferBase64 = documentTemplateObject.the_file;
  //   return await this.callCdogs(bufferBase64, data)
  // }

  // async callCdogs(base64Template: string, data: any) {
  //   const cdogsToken = await this.ttlsService.callGetToken();
  //   const md = JSON.stringify({
  //     data,
  //     formatters:
  //       '{"myFormatter":"_function_myFormatter|function(data) { return data.slice(1); }","myOtherFormatter":"_function_myOtherFormatter|function(data) {return data.slice(2);}"}',
  //     options: {
  //       cacheReport: false,
  //       convertTo: "docx",
  //       overwrite: true,
  //       reportName: "ticdi-report",
  //     },
  //     template: {
  //       content: `${base64Template}`,
  //       encodingType: "base64",
  //       fileType: "docx",
  //     },
  //   });

  //   const conf = {
  //     method: "post",
  //     url: process.env.cdogs_url,
  //     headers: {
  //       Authorization: `Bearer ${cdogsToken}`,
  //       "Content-Type": "application/json",
  //     },
  //     responseType: "arraybuffer",
  //     data: md,
  //   };
  //   const ax = require("axios");
  //   const response = await ax(conf).catch((error) => {
  //     console.log(error.response);
  //   });
  //   return response.data;
  // }

  // /**
  //  * Generates an NFR report name using tenure file number
  //  * and a version number. The version number is incremented
  //  * each time someone generates a NFR report.
  //  *
  //  * @param tenureFileNumber
  //  * @returns
  //  */
  // async generateNFRReportName(dtid: number, tenureFileNumber: string) {
  //   const url = `${hostname}:${port}/document-data-log/version/` + dtid;
  //   // grab the next version string for the dtid
  //   const version = await axios
  //     .get(url, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     })
  //     .then((res) => {
  //       return res.data;
  //     });
  //   return { reportName: 'NFR_' + tenureFileNumber + '_' + version + '.docx' };
  // }

  async generateNFRReport(
    dtid: number,
    document_type_id: number,
    idirUsername: string,
    idirName: string,
    variableJson: VariableJSON[],
    provisionJson: ProvisionJSON[]
  ) {
    // get raw ttls data for later
    await this.ttlsService.setWebadeToken();
    const rawData: any = await firstValueFrom(this.ttlsService.callHttp(dtid))
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });

    const documentTemplateObject = await this.documentTemplateService.findActiveByDocumentType(document_type_id);

    // Format variables with names that the document template expects
    const variables: any = {};
    variableJson.forEach(({ variable_name, variable_value }) => {
      const newVariableName = variable_name
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (match) => match.toUpperCase())
        .replace(/\s/g, '_')
        .replace(/^(\w)/, (match) => match.toUpperCase());

      if (variable_value.includes('«')) {
        // regex which converts «DB_TENURE_TYPE» to {d.DB_Tenure_Type}, also works for VAR_
        variable_value = variable_value.replace(/<<([^>>]+)>>/g, function (match, innerText) {
          innerText = convertToSpecialCamelCase(innerText);
          return '{d.' + innerText + '}';
        });
      } else if (variable_value.includes('<<')) {
        // regex which converts <<DB_TENURE_TYPE>> to {d.DB_Tenure_Type}, also works for VAR_
        variable_value = variable_value.replace(/<<([^>>]+)>>/g, function (match, innerText) {
          innerText = convertToSpecialCamelCase(innerText);
          return '{d.' + innerText + '}';
        });
      }

      variables[`VAR_${newVariableName}`] = variable_value;
      variables[`${variable_name}`] = variable_value;
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
      if (provision.free_text.includes('«')) {
        // regex which converts «DB_TENURE_TYPE» to {d.DB_Tenure_Type}, also works for VAR_
        provision.free_text = provision.free_text.replace(/«([^»]+)»/g, function (match, innerText) {
          innerText = convertToSpecialCamelCase(innerText);
          return '{d.' + innerText + '}';
        });
      } else if (provision.free_text.includes('<<')) {
        // regex which converts <<DB_TENURE_TYPE>> to {d.DB_Tenure_Type}, also works for VAR_
        provision.free_text = provision.free_text.replace(/<<([^>>]+)>>/g, function (match, innerText) {
          innerText = convertToSpecialCamelCase(innerText);
          return '{d.' + innerText + '}';
        });
      }
      showProvisionSections[varName] = provision.free_text;
      // workaround for template formatting
      if (showProvisionSections[varName] != '') {
        showProvisionSections[varName] = showProvisionSections[varName] + '\r\n\r\n';
      }

      const showVarName = `showSection${groupText}_${index}`;
      showProvisionSections[showVarName] = 1;
    });

    // Logic for including section titles based on which sections are displaying information
    for (const key in showProvisionSections) {
      if (key.startsWith('showSection')) {
        const number = key.match(/Section(\w+)_\d+/)[1];
        if (number === 'Twenty' || number === 'TwentyFive' || number === 'TwentySeven') {
          const titleKey = `Section${number}_Title`; // titleKey = Section<Number>_Title
          showProvisionSections[key] = showProvisionSections[key]; // key = showSection<Number>_<#>
          showProvisionSections[titleKey] = sectionTitles[number]; // set title text
          showProvisionSections[`show${titleKey}`] = 1; // set show title to true
        }
      }
    }

    // Format the raw ttls data
    const tenantAddr = rawData.tenantAddr;
    const interestParcels = rawData.interestParcel;
    let concatLegalDescriptions = '';
    if (interestParcels && interestParcels.length > 0) {
      interestParcels.sort((a, b) => b.interestParcelId - a.interestParcelId);
      let legalDescArray = [];
      for (let ip of interestParcels) {
        if (ip.legalDescription && ip.legalDescription != '') {
          legalDescArray.push(ip.legalDescription);
        }
      }
      if (legalDescArray.length > 0) {
        concatLegalDescriptions = legalDescArray.join('\n');
      }
    }

    const DB_Address_Mailing_Tenant = tenantAddr[0] ? nfrAddressBuilder(tenantAddr) : '';

    const VAR_Fee_Documentation_Amount: number =
      variables && variables.VAR_Fee_Documentation_Amount
        ? !isNaN(variables.VAR_Fee_Documentation_Amount)
          ? parseFloat(variables.VAR_Fee_Documentation_Amount)
          : 0
        : 0;
    if (variables && variables.VAR_Fee_Documentation_Amount) {
      !isNaN(variables.VAR_Fee_Documentation_Amount)
        ? (variables.VAR_Fee_Documentation_Amount = formatMoney(parseFloat(variables.VAR_Fee_Documentation_Amount)))
        : (variables.VAR_Fee_Documentation_Amount = '0.00');
    }

    const VAR_Fee_Application_Amount: number =
      variables && variables.VAR_Fee_Application_Amount
        ? !isNaN(variables.VAR_Fee_Application_Amount)
          ? parseFloat(variables.VAR_Fee_Application_Amount)
          : 0
        : 0;
    if (variables && variables.VAR_Fee_Application_Amount) {
      !isNaN(variables.VAR_Fee_Application_Amount)
        ? (variables.VAR_Fee_Application_Amount = formatMoney(parseFloat(variables.VAR_Fee_Application_Amount)))
        : (variables.VAR_Fee_Application_Amount = '0.00');
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
        variables.VAR_Fee_Occupational_Rental_Amount = '0.00';
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
        ? (variables.VAR_Fee_Other_Credit_Amount = formatMoney(parseFloat(variables.VAR_Fee_Other_Credit_Amount)))
        : (variables.VAR_Fee_Other_Credit_Amount = '0.00');
    }

    const GST_Rate: number = rawData && rawData.gstRate ? rawData.gstRate : 0;
    const DB_Fee_Payable_Type: string = rawData.feePayableType;
    const DB_Fee_Payable_Amount: number = rawData.feePayableAmount ? rawData.feePayableAmount : 0;
    const DB_Fee_Payable_Amount_GST: number = rawData.feePayableAmountGst ? rawData.feePayableAmountGst : 0;
    const DB_GST_Exempt: string = rawData.gstExempt ? rawData.gstExempt : 'N';
    const DB_GST_Exempt_Area: number = rawData.gstExemptArea ? rawData.gstExemptArea : 0;
    let DB_Total_GST_Amount: number;
    const DB_FP_Asterisk: string = DB_GST_Exempt === 'Y' ? '' : '*';

    let totalArea = 0;
    if (rawData.interestParcel && rawData.interestParcel[0]) {
      for (let parcel of rawData.interestParcel) {
        totalArea += parcel.areaInHectares;
      }
    }
    // Take the total area in hectares and subtract the exempt amount to get the taxable area
    const taxableArea = totalArea - DB_GST_Exempt_Area;
    // Get the ratio of the taxable are to the totalArea
    const areaRatio = totalArea !== 0 ? taxableArea / totalArea : 0;

    if (DB_GST_Exempt === 'Y') {
      DB_Total_GST_Amount =
        ((DB_Fee_Payable_Amount_GST * areaRatio + VAR_Fee_Documentation_Amount + VAR_Fee_Application_Amount) *
          GST_Rate) /
        100.0;
    } else {
      DB_Total_GST_Amount =
        ((DB_Fee_Payable_Amount_GST * areaRatio +
          VAR_Fee_Occupational_Rental_Amount +
          VAR_Fee_Documentation_Amount +
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

    let monies = [];
    const Show_Fee_Payable_Amount_GST = DB_Fee_Payable_Amount_GST ? (DB_Fee_Payable_Amount_GST > 0 ? 1 : 0) : 0;
    if (Show_Fee_Payable_Amount_GST === 1) {
      monies.push({
        description: DB_Fee_Payable_Type,
        dollarSign: '*$',
        value: formatMoney(DB_Fee_Payable_Amount_GST),
      });
    }
    const Show_Fee_Payable_Amount = DB_Fee_Payable_Amount ? (DB_Fee_Payable_Amount > 0 ? 1 : 0) : 0;
    if (Show_Fee_Payable_Amount === 1) {
      monies.push({
        description: DB_Fee_Payable_Type,
        dollarSign: '$',
        value: formatMoney(DB_Fee_Payable_Amount),
      });
    }
    const Show_Fee_Occupational_Rental_Amount = VAR_Fee_Occupational_Rental_Amount
      ? VAR_Fee_Occupational_Rental_Amount > 0
        ? 1
        : 0
      : 0;
    if (Show_Fee_Occupational_Rental_Amount === 1) {
      monies.push({
        description: 'Occupational Rental Amount',
        dollarSign: `${DB_FP_Asterisk}$`,
        value: formatMoney(VAR_Fee_Occupational_Rental_Amount),
      });
    }
    const Show_Fee_Documentation_Amount = VAR_Fee_Documentation_Amount ? (VAR_Fee_Documentation_Amount > 0 ? 1 : 0) : 0;
    if (Show_Fee_Documentation_Amount === 1) {
      monies.push({
        description: 'Documentation Amount',
        dollarSign: '*$',
        value: formatMoney(VAR_Fee_Documentation_Amount),
      });
    }
    const Show_Fee_Application_Amount = VAR_Fee_Application_Amount ? (VAR_Fee_Application_Amount > 0 ? 1 : 0) : 0;
    if (Show_Fee_Application_Amount === 1) {
      monies.push({
        description: 'Application Amount',
        dollarSign: '*$',
        value: formatMoney(VAR_Fee_Application_Amount),
      });
    }
    const Show_Fee_Other_Credit_Amount = VAR_Fee_Other_Credit_Amount ? (VAR_Fee_Other_Credit_Amount > 0 ? 1 : 0) : 0;
    if (Show_Fee_Other_Credit_Amount === 1) {
      monies.push({
        description: 'Other (credit)',
        dollarSign: '$',
        value: formatMoney(VAR_Fee_Other_Credit_Amount),
      });
    }
    monies.push({
      description: 'GST Total',
      dollarSign: '$',
      value: formatMoney(DB_Total_GST_Amount),
    });
    const moniesTotal = {
      description: 'Total Fees Payable',
      dollarSign: '$',
      value: formatMoney(DB_Total_Monies_Payable),
    };

    const ttlsData = {
      monies: monies,
      moniesTotal: moniesTotal,
      DB_Address_Regional_Office: nfrAddressBuilder([
        {
          addrLine1: rawData.regOfficeStreet,
          city: rawData.regOfficeCity,
          provAbbr: rawData.regOfficeProv,
          postalCode: rawData.regOfficePostalCode,
        },
      ]),
      DB_Name_BCAL_Contact: idirName,
      DB_File_Number: rawData.fileNum,
      DB_Address_Mailing_Tenant: DB_Address_Mailing_Tenant,
      DB_Tenure_Type: rawData.type // convert a tenure type like LICENSE to License
        ? rawData.type.toLowerCase().charAt(0).toUpperCase() + rawData.type.toLowerCase().slice(1)
        : '',
      DB_Legal_Description: concatLegalDescriptions,
      DB_Fee_Payable_Type: DB_Fee_Payable_Type,
      DB_Fee_Payable_Amount_GST: DB_Fee_Payable_Amount_GST == 0 ? '' : formatMoney(DB_Fee_Payable_Amount_GST),
      DB_Fee_Payable_Amount: formatMoney(DB_Fee_Payable_Amount),
      DB_FP_Asterisk: DB_FP_Asterisk,
      DB_Total_GST_Amount: formatMoney(DB_Total_GST_Amount),
      DB_Total_Monies_Payable: formatMoney(DB_Total_Monies_Payable),
      DB_Address_Line_Regional_Office: nfrAddressBuilder([
        {
          addrLine1: rawData.regOfficeStreet,
          city: rawData.regOfficeCity,
          provAbbr: rawData.regOfficeProv,
          postalCode: rawData.regOfficePostalCode,
        },
      ]),
    }; // parse out the rawData, variableJson, and provisionJson into something useable

    // combine the formatted TTLS data, variables, and provision sections
    const data = Object.assign({}, ttlsData, variables, showProvisionSections);

    // Save the NFR Data
    const documentData = await this.saveDocument(
      dtid,
      document_type_id,
      'Complete',
      provisionJson,
      variableJson,
      idirUsername
    );

    // Log the request
    await this.documentDataLogService.create({
      dtid: dtid,
      document_type_id: document_type_id,
      document_data_id: documentData.id,
      document_template_id: documentTemplateObject?.id,
      request_app_user: idirUsername,
      request_json: JSON.stringify(data),
      create_userid: idirUsername,
    });

    // Generate the report
    const cdogsToken = await this.ttlsService.callGetToken();
    let bufferBase64 = documentTemplateObject.the_file;
    let cdogsData = {
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
    };
    const md = JSON.stringify(cdogsData);

    let conf = {
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
    // response.data is the docx file after the first insertions
    const firstFile = response.data;
    // convert the docx file buffer to base64 for a second cdogs conversion
    const base64File = Buffer.from(firstFile).toString('base64');
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

  async getDocumentProvisionsByDocTypeIdAndDtid(
    document_type_id: number,
    dtid: number
  ): Promise<{ provisions: Provision[]; provisionIds: number[] }> {
    return this.documentDataService.getProvisionsByDocTypeIdAndDtid(document_type_id, dtid);
  }

  getGroupMaxByDocTypeId(document_type_id: number): Promise<any> {
    return this.provisionService.getGroupMaxByDocTypeId(document_type_id);
  }

  async getDocumentVariablesByDocumentTypeIdAndDtid(document_type_id: number, dtid: number): Promise<any> {
    // if a dtid & document_type_id are provided, get the variables with any existing user specified values
    const variables = await this.documentDataService.getVariablesByDtidAndDocType(dtid, document_type_id);
    if (variables) {
      return variables;
    } else {
      // grab the basic variable list corresponding to the document type
      const basicVariables = await this.provisionService.getVariablesByDocumentTypeId(document_type_id);
      return { variables: basicVariables, variableIds: [] };
    }
  }

  getMandatoryProvisions() {
    return this.provisionService.getMandatoryProvisions();
  }

  getMandatoryProvisionsByDocumentTypeId(document_type_id: number) {
    return this.provisionService.getMandatoryProvisionsByDocumentTypeId(document_type_id);
  }

  async getDocumentData() {
    const documentData = await this.documentDataService.findAll();
    const templateIds = documentData.map((d) => d.template_id);
    const allTemplates = await this.documentTemplateService.getTemplatesInfoByIds(templateIds);

    // filter out deleted templates and create a lookup table
    const templatesLookup = allTemplates.reduce((acc, template) => {
      if (!template.is_deleted) {
        acc[template.id] = template;
      }
      return acc;
    }, {});

    // combine Document data with their corresponding templates
    const combinedArray = documentData
      .filter((document) => templatesLookup[document.template_id])
      .map((document) => ({
        dtid: document.dtid,
        version: templatesLookup[document.template_id].template_version,
        file_name: templatesLookup[document.template_id].file_name,
        updated_date: document.update_timestamp.toString().split('T')[0],
        status: document.status,
        active: templatesLookup[document.template_id].active_flag,
        document_data_id: document.id,
        document_type: document.document_type,
      }));

    return combinedArray;
  }

  async getDocumentDataByDocTypeIdAndDtid(document_type_id: number, dtid: number): Promise<any> {
    return this.documentDataService.findDocumentDataByDocTypeIdAndDtid(document_type_id, dtid);
  }

  // async saveNFR(
  //   dtid: number,
  //   variant_name: string,
  //   status: string,
  //   provisionJsonArray: ProvisionJSON[],
  //   variableJsonArray: VariableJSON[],
  //   idir_username: string
  // ) {
  //   const templateUrl = `${hostname}:${port}/document-template/get-active-report/${variant_name}`;
  //   const documentTemplate = await axios.get(templateUrl).then((res) => {
  //     return res.data;
  //   });
  //   const url = `${hostname}:${port}/document-data`;
  //   const data = {
  //     dtid: dtid,
  //     variant_name: variant_name,
  //     template_id: documentTemplate.id,
  //     status: status,
  //     create_userid: idir_username,
  //     ttls_data: [],
  //     provisionJsonArray,
  //     variableJsonArray,
  //   };
  //   await axios
  //     .post(url, {
  //       body: data,
  //     })
  //     .then((res) => {
  //       return res.data;
  //     });
  // }

  async saveDocument(
    dtid: number,
    document_type_id: number,
    status: string,
    provisionJsonArray: ProvisionJSON[],
    variableJsonArray: VariableJSON[],
    idir_username: string
  ) {
    const documentTemplate = await this.documentTemplateService.findActiveByDocumentType(document_type_id);
    const data = {
      dtid: dtid,
      document_type_id: document_type_id,
      template_id: documentTemplate ? documentTemplate.id : null,
      status: status,
      create_userid: idir_username,
      ttls_data: [],
    };
    return this.documentDataService.createOrUpdate(data, provisionJsonArray, variableJsonArray);
  }

  async getEnabledProvisionsByDocTypeId(document_type_id: number) {
    return this.provisionService.getMandatoryProvisionsByDocumentTypeId(document_type_id);
  }

  getEnabledProvisionsByDocTypeIdDtid(document_type_id: number, dtid: number) {
    return this.documentDataService.getEnabledProvisionsByDocTypeIdAndDtid(document_type_id, dtid);
  }
}
