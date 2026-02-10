import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DocumentTemplateService } from 'src/document_template/document_template.service';
import { ProvisionService } from 'src/provision/provision.service';
import { TTLSService } from 'src/ttls/ttls.service';
import { numberWords, sectionTitles } from '../constants';
import { DTR, ProvisionJSON, VariableJSON } from '../types';
import {
  convertToSpecialCamelCase,
  formatMoney,
  formatPhoneNumber,
  formatPostalCode,
  getContactAgent,
  getLicenceHolder,
  getLicenceHolderName,
  getMailingAddress,
  grazingLeaseVariables,
  nfrAddressBuilder,
} from '../util';
import { DocumentDataService } from 'src/document_data/document_data.service';
import { DocumentDataLogService } from 'src/document_data_log/document_data_log.service';
import { DocumentTypeService } from 'src/document_type/document_type.service';

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

  async generateReportName(dtid: number, tenure_file_number: string, document_type_id: number) {
    const version = await this.documentDataLogService.findNextVersion(dtid, document_type_id);
    const documentType = await this.documentTypeService.findById(document_type_id);
    let prefix = 'report'; // fallback prefix
    if (documentType) {
      prefix = documentType.prefix;
      console.log('prefix pulled from db::: ' + prefix);
      // fallback logic left in for now
      if (prefix === '' || prefix === null || prefix === 'report') {
        if (documentType.name.toLowerCase().includes('notice of final review')) {
          prefix = 'NFR';
        } else if (documentType.name.toLowerCase().includes('land use report')) {
          prefix = 'LUR';
        } else if (
          documentType.name.toLowerCase().includes('grazing') ||
          documentType.name.toLowerCase().includes('lease')
        ) {
          prefix = 'Lease';
        } else if (documentType.name.toLowerCase().includes('standard licence')) {
          prefix = 'Licence';
        } else if (documentType.name.toLowerCase().includes('assumption')) {
          prefix = 'Assignment';
        } else if (documentType.name.toLowerCase().includes('modification')) {
          prefix = 'Modification';
        }
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
      if (
        documentType.name.toLowerCase().includes('notice of final review') ||
        documentType.name.toLowerCase().includes('nfr')
      ) {
        return this.generateNFRReport(dtid, document_type_id, idirUsername, idirName, variableJson, provisionJson);
      } else if (
        documentType.name.toLowerCase().includes('land use') ||
        documentType.name.toLowerCase().includes('lur')
      ) {
        return this.generateLURReport(dtid, idirUsername, document_type_id);
      } else if (documentType.name.toLowerCase().includes('grazing')) {
        return this.generateGLReport(dtid, idirUsername, document_type_id);
      } else {
        return this.generateReportNew(dtid, document_type_id, idirUsername, variableJson, provisionJson);
      }
    }
  }

  async generateReportNew(
    dtid: number,
    document_type_id: number,
    idirUsername: string,
    variableJson: VariableJSON[],
    provisionJson: ProvisionJSON[]
  ) {
    const documentTemplateObject = await this.documentTemplateService.findActiveByDocumentType(document_type_id);

    // Format variables with names that the document template expects
    const variables: any = {};
    variableJson.forEach(({ variable_name, variable_value }) => {
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
      variables[`${variable_name}`] = variable_value;
    });

    // Format the provisions so that provision free_text gets passed into the document template
    provisionJson.sort((a, b) => {
      if (a.provision_group === b.provision_group) {
        return a.sequence_value - b.sequence_value;
      }
      return a.provision_group - b.provision_group;
    });
    let provisions: {
      [key: string]: { provision_name: string; free_text: string; list: { item: string }[] }[];
    } = {};
    provisionJson.forEach(({ provision_name, provision_group, free_text, list_items }) => {
      if (free_text.includes('«')) {
        // regex which converts «DB_TENURE_TYPE» to {d.DB_Tenure_Type}, also works for VAR_
        free_text = free_text.replace(/«([^»]+)»/g, function (match, innerText) {
          innerText = convertToSpecialCamelCase(innerText);
          return '{d.' + innerText + '}';
        });
      } else if (free_text.includes('<<')) {
        // regex which converts <<DB_TENURE_TYPE>> to {d.DB_Tenure_Type}, also works for VAR_
        free_text = free_text.replace(/<<([^>>]+)>>/g, function (match, innerText) {
          innerText = convertToSpecialCamelCase(innerText);
          return '{d.' + innerText + '}';
        });
      }

      // individual Signing block takes 2 cdogs requests to be fully filled in, so this regex
      // makes sure that the db_name_tenant variable is formatted correctly
      if (free_text.toLowerCase().includes('db_name_tenant}')) {
        free_text = free_text.replace(/db_name_tenant}/gi, 'DB_NAME_TENANT:convCRLF()}');
      } else if (free_text.toLowerCase().includes('db_name_tenant:convcrlf()}')) {
        free_text = free_text.replace(/db_name_tenant:convcrlf\(\)}/gi, 'DB_NAME_TENANT:convCRLF()}');
      }

      // do same conversions for list items
      let list = list_items.map((item) => {
        if (item.includes('«')) {
          // regex which converts «DB_TENURE_TYPE» to {d.DB_Tenure_Type}, also works for VAR_
          item = item.replace(/«([^»]+)»/g, function (match, innerText) {
            innerText = convertToSpecialCamelCase(innerText);
            return '{d.' + innerText + '}';
          });
        } else if (item.includes('<<')) {
          // regex which converts <<DB_TENURE_TYPE>> to {d.DB_Tenure_Type}, also works for VAR_
          item = item.replace(/<<([^>>]+)>>/g, function (match, innerText) {
            innerText = convertToSpecialCamelCase(innerText);
            return '{d.' + innerText + '}';
          });
        }

        if (item.toLowerCase().includes('db_name_tenant}')) {
          item = item.replace(/db_name_tenant}/gi, 'DB_NAME_TENANT:convCRLF()}');
        } else if (item.toLowerCase().includes('db_name_tenant:convcrlf()}')) {
          item = item.replace(/db_name_tenant:convcrlf\(\)}/gi, 'DB_NAME_TENANT:convCRLF()}');
        }
        return { item };
      });

      const key = `SECTION_${provision_group}`;
      if (!provisions[key]) {
        provisions[key] = [];
      }

      provisions[key].push({ provision_name, free_text, list });
    });

    // get the TTLS DB_ variables
    const dbVars = await this.getDbVariables(dtid, document_type_id, idirUsername);

    // combine the formatted TTLS data, variables, and provision sections to be passed to cdogs
    const data = Object.assign({}, dbVars, variables, provisions);

    // Save the Document Data to the database
    const provisionSaveData = provisionJson.map((provision) => {
      return { provision_id: provision.provision_id, doc_type_provision_id: provision.doc_type_provision_id };
    });
    const documentData = await this.saveDocument(
      dtid,
      document_type_id,
      'Complete',
      provisionSaveData,
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
        reportName: 'sl-report',
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
      console.log('cdogs error');
      console.log(error);
    });
    // response2.data is the docx file after the second insertions
    // (anything nested in a variable or provision should be inserted at this point)
    return response2.data;
  }

  async getDbVariables(dtid: number, document_type_id: number, idirName: string): Promise<any> {
    await this.ttlsService.setWebadeToken();
    let rawData: DTR;
    try {
      rawData = await this.ttlsService.callHttp(dtid);
    } catch (err) {
      console.log(err); //
    }

    const interestParcel = rawData.interestParcel;
    const tenantAddr = rawData.tenantAddr;
    const regVars = {
      regOfficeStreet: rawData && rawData.regOfficeStreet ? rawData.regOfficeStreet : '',
      regOfficeCity: rawData && rawData.regOfficeCity ? rawData.regOfficeCity : '',
      regOfficeProv: rawData && rawData.regOfficeProv ? rawData.regOfficeProv : '',
      regOfficePostalCode: rawData && rawData.regOfficePostalCode ? rawData.regOfficePostalCode : '',
    };
    const glVariables = grazingLeaseVariables(tenantAddr, interestParcel, regVars);

    const documentType = await this.documentTypeService.findById(document_type_id);

    return {
      DB_DOCUMENT_NUMBER: dtid,
      DB_DOCUMENT_TYPE: documentType.name,
      DB_FILE_NUMBER: rawData ? rawData.fileNum : null,
      // DB_ADDRESS_STREET_TENANT: glVariables.glStreetAddress || glVariables.glMailingAddress,
      DB_ADDRESS_STREET_TENANT: glVariables.combinedAddress,
      // DB_ADDRESS_MAILING_TENANT: glVariables.glMailingAddress || glVariables.glStreetAddress,
      DB_ADDRESS_MAILING_TENANT: glVariables.combinedAddress,
      DB_ADDRESS_REGIONAL_OFFICE: glVariables.addressRegionalOffice,
      // DB_NAME_TENANT: glVariables.mailingName,
      DB_NAME_TENANT: glVariables.combinedName,
      DB_NAME_TENANT_LIST: glVariables.mailingNameList,
      DB_NAME_CORPORATION: glVariables.mailingCorp,
      DB_LEGAL_DESCRIPTION: glVariables.legalDescription,
      DB_NAME_BCAL_CONTACT: idirName,
      DB_TENURE_TYPE:
        rawData && rawData.type
          ? rawData.type.toLowerCase().charAt(0).toUpperCase() + rawData.type.toLowerCase().slice(1)
          : '',
      DB_REG_DOCUMENT_NUMBER: rawData ? rawData.documentNum : null,
      DB_NAME_TENANTS: glVariables.combinedName,
      DB_ADDRESS_TENANT: glVariables.combinedAddress,
      // provide the variables in non-all caps format as well
      DB_Document_Number: dtid,
      DB_Document_Type: documentType.name,
      DB_File_Number: rawData ? rawData.fileNum : null,
      // DB_Address_Street_Tenant: glVariables.glStreetAddress || glVariables.glMailingAddress,
      DB_Address_Street_Tenant: glVariables.combinedAddress,
      // DB_Address_Mailing_Tenant: glVariables.glMailingAddress || glVariables.glStreetAddress,
      DB_Address_Mailing_Tenant: glVariables.combinedAddress,
      DB_Address_Regional_Office: glVariables.addressRegionalOffice,
      // DB_Name_Tenant: glVariables.mailingName,
      DB_Name_Tenant: glVariables.combinedName,
      DB_Name_Tenant_List: glVariables.mailingNameList,
      DB_Name_Corporation: glVariables.mailingCorp,
      DB_Legal_Description: glVariables.legalDescription,
      DB_Name_Bcal_Contact: idirName,
      DB_Tenure_Type:
        rawData && rawData.type
          ? rawData.type.toLowerCase().charAt(0).toUpperCase() + rawData.type.slice(1).toLowerCase()
          : '',
      DB_Reg_Document_Number: rawData ? rawData.documentNum : null,
      DB_Name_Tenants: glVariables.combinedName,
      DB_Address_Tenant: glVariables.combinedAddress,
    };
  }

  /**
   * Generates the Land Use Report using CDOGS
   *
   * @param dtid
   * @param username
   * @param document_type_id
   * @returns
   */
  async generateLURReport(dtid: number, username: string, document_type_id: number) {
    // get the view given the print request detail id
    await this.ttlsService.setWebadeToken();
    let rawData: DTR;
    try {
      rawData = await this.ttlsService.callHttp(dtid);
    } catch (err) {
      console.log(err);
    }
    let data;
    if (rawData) {
      const tenantAddr = rawData.tenantAddr[0];

      const tenure = [];
      for (let entry of rawData.interestParcel) {
        tenure.push({
          Area: entry.areaInHectares,
          LegalDescription: entry.legalDescription,
        });
      }
      const mappedData = {
        dtid: rawData.dtid,
        tenure_file_number: rawData.fileNum,
        incorporation_number: tenantAddr ? tenantAddr.incorporationNum : '',
        organization_unit: rawData.orgUnit,
        purpose_name: rawData.purpose,
        sub_purpose_name: rawData.subPurpose,
        type_name: rawData.type,
        sub_type_name: rawData.subType,
        first_name: tenantAddr ? tenantAddr.firstName : '',
        middle_name: tenantAddr ? tenantAddr.middleName : '',
        last_name: tenantAddr ? tenantAddr.lastName : '',
        legal_name: tenantAddr ? tenantAddr.legalName : '',
        licence_holder_name: getLicenceHolderName(tenantAddr),
        email_address: tenantAddr ? tenantAddr.emailAddress : '',
        phone_number: formatPhoneNumber(
          tenantAddr ? tenantAddr.phoneNumber : '',
          tenantAddr ? tenantAddr.areaCode : ''
        ),
        licence_holder: getLicenceHolder(tenantAddr),
        contact_agent: getContactAgent(rawData.contactFirstName, rawData.contactMiddleName, rawData.contactLastName),
        contact_company_name: rawData.contactCompanyName,
        contact_first_name: rawData.contactFirstName,
        contact_middle_name: rawData.contactMiddleName,
        contact_last_name: rawData.contactLastName,
        contact_phone_number: formatPhoneNumber(rawData.contactPhoneNumber, null),
        contact_email_address: rawData.contactEmail,
        inspected_date: rawData.inspectionDate,
        mailing_address: getMailingAddress(tenantAddr),
        mailing_address_line_1: tenantAddr ? tenantAddr.addrLine1 : '',
        mailing_address_line_2: tenantAddr ? tenantAddr.addrLine2 : '',
        mailing_address_line_3: tenantAddr ? tenantAddr.addrLine3 : '',
        mailing_city: tenantAddr ? tenantAddr.city : '',
        mailing_province_state_code: tenantAddr ? tenantAddr.regionCd : '',
        mailing_postal_code: tenantAddr ? formatPostalCode(tenantAddr.postalCode) : '',
        mailing_zip: tenantAddr ? tenantAddr.zipCode : '',
        mailing_country_code: tenantAddr ? tenantAddr.countryCd : '',
        mailing_country: tenantAddr ? tenantAddr.country : '',
        location_description: rawData.locLand,
        tenure: tenure ? tenure : '',
      };
      data = {
        DTID: mappedData.dtid,
        FileNum: mappedData.tenure_file_number,
        OrganizationUnit: mappedData.organization_unit,
        Purpose: mappedData.purpose_name,
        SubPurpose: mappedData.sub_purpose_name,
        TenureType: mappedData.type_name,
        TenureSubType: mappedData.sub_type_name,
        LicenceHolderName: mappedData.licence_holder_name,
        MailingAddress: mappedData.mailing_address,
        MailingCity: mappedData.mailing_city,
        MailingProv: mappedData.mailing_province_state_code,
        PostCode: mappedData.mailing_postal_code,
        ContactAgent: mappedData.contact_agent,
        ContactAgentEmail: mappedData.contact_email_address,
        ContactAgentPhone: mappedData.contact_phone_number,
        Tenure: mappedData.tenure,
        Location: mappedData.location_description,
        PrimaryContactEmail: mappedData.email_address,
        PrimaryContactPhone: mappedData.phone_number,
        InspectionDate: mappedData.inspected_date,
        IncorporationNumber: mappedData.incorporation_number,
      };
    }

    if (data.InspectionDate) {
      data['InspectionDate'] = this.ttlsService.formatInspectedDate(data.InspectionDate);
    }
    // get the document template
    const documentTemplateObject = await this.documentTemplateService.findActiveByDocumentType(document_type_id);

    // log the request
    const document_template_id = documentTemplateObject.id;
    await this.documentDataLogService.create({
      document_template_id: document_template_id,
      document_data_id: null,
      document_type_id: document_type_id,
      dtid: data.DTID,
      request_app_user: username,
      request_json: JSON.stringify(data),
      create_userid: username,
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
  async generateGLReport(dtid: number, username: string, document_type_id: number) {
    // get raw ttls data for later
    await this.ttlsService.setWebadeToken();
    let rawData: DTR;
    try {
      rawData = await this.ttlsService.callHttp(dtid);
    } catch (err) {
      console.log(err);
    }
    // get the document template
    const documentTemplateObject = await this.documentTemplateService.findActiveByDocumentType(document_type_id);
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
      // DB_Address_Street_Tenant: glVariables.glStreetAddress || glVariables.glMailingAddress,
      DB_Address_Street_Tenant: glVariables.combinedAddress,
      DB_Address_Regional_Office: glVariables.addressRegionalOffice,
      // DB_Address_Mailing_Tenant: glVariables.glMailingAddress || glVariables.glStreetAddress,
      DB_Address_Mailing_Tenant: glVariables.combinedAddress,
      // DB_Name_Tenant: glVariables.mailingName,
      DB_Name_Tenant: glVariables.combinedName,
      DB_Name_Tenant_List: glVariables.mailingNameList,
      DB_Name_Corporation: glVariables.mailingCorp,
      DB_Legal_Description: glVariables.legalDescription,
      DB_Name_Tenants: glVariables.combinedName,
      DB_Address_Tenant: glVariables.combinedAddress,
    };

    // log the request
    await this.documentDataLogService.create({
      document_data_id: null, // should eventually point to document_data object
      document_template_id: documentTemplateObject.id,
      document_type_id: document_type_id,
      dtid: dtid,
      request_app_user: username,
      create_userid: username,
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

  /**
   * Old report generation for Notice of Final Review, very specific
   * to the report & its variants.
   * @param dtid
   * @param document_type_id
   * @param idirUsername
   * @param idirName
   * @param variableJson
   * @param provisionJson
   * @returns
   */
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
    let rawData: DTR;
    try {
      rawData = await this.ttlsService.callHttp(dtid);
    } catch (err) {
      console.log(err);
    }

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

    // Format the provisions so that provision free_text gets passed into the document template
    provisionJson.sort((a, b) => {
      if (a.provision_group === b.provision_group) {
        return a.sequence_value - b.sequence_value;
      }
      return a.provision_group - b.provision_group;
    });

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

    const provisionSaveData = provisionJson.map((provision) => {
      return { provision_id: provision.provision_id, doc_type_provision_id: provision.doc_type_provision_id };
    });
    // Save the NFR Data
    const documentData = await this.saveDocument(
      dtid,
      document_type_id,
      'Complete',
      provisionSaveData,
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

  // ~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~

  async getDocumentProvisionsByDocTypeIdAndDtid(document_type_id: number, dtid: number): Promise<any> {
    return this.documentDataService.getProvisionsByDocTypeIdAndDtid(document_type_id, dtid);
  }

  getGroupMaxByDocTypeId(document_type_id: number): Promise<any> {
    return this.documentTypeService.getGroupMaxByDocTypeId(document_type_id);
  }

  getAllGroups() {
    return this.documentTypeService.getGroupMax();
  }

  async getDocumentVariablesByDocumentTypeIdAndDtid(document_type_id: number, dtid: number): Promise<any> {
    // if a dtid & document_type_id are provided, get the variables with any existing user specified values
    const variablesObject = await this.documentDataService.getVariablesByDtidAndDocType(dtid, document_type_id);
    if (variablesObject.variables.length > 0) {
      return variablesObject;
    } else {
      // grab the basic variable list corresponding to the document type
      const basicVariables = await this.provisionService.getVariablesByDocumentTypeId();
      return { variables: basicVariables, variableIds: [] };
    }
  }

  getMandatoryProvisionsByDocumentTypeId(document_type_id: number) {
    return this.provisionService.getMandatoryProvisionsByDocumentTypeId(document_type_id);
  }

  async getDocumentData() {
    const documentData = await this.documentDataService.findAllWithActiveDT();
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
        updated_date: document && document.update_timestamp ? document.update_timestamp.toISOString().slice(0, 10) : '',
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

  async saveDocument(
    dtid: number,
    document_type_id: number,
    status: string,
    provisionJsonArray: { provision_id: number; doc_type_provision_id: number }[],
    variableJsonArray: VariableJSON[],
    idir_username: string
  ) {
    const documentTemplate = await this.documentTemplateService.findActiveByDocumentType(document_type_id);
    const data = {
      dtid: dtid,
      template_id: documentTemplate ? documentTemplate.id : null,
      status: status,
      create_userid: idir_username,
      ttls_data: [],
    };
    return this.documentDataService.createOrUpdate(data, document_type_id, provisionJsonArray, variableJsonArray);
  }

  async getEnabledProvisionsByDocTypeId(document_type_id: number) {
    return this.provisionService.getMandatoryProvisionsByDocumentTypeId(document_type_id);
  }

  getEnabledProvisionsByDocTypeIdDtid(document_type_id: number, dtid: number) {
    return this.documentDataService.getEnabledProvisionsByDocTypeIdAndDtid(document_type_id, dtid);
  }
}
