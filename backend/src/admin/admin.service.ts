import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SearchResultsItem, UserObject } from 'src/types';
import { DocumentTemplateService } from 'src/document_template/document_template.service';
import { ProvisionService } from 'src/provision/provision.service';
import { DocumentTypeService } from 'src/document_type/document_type.service';
import { DocumentType } from 'src/document_type/entities/document_type.entity';
import { TTLSService } from 'src/ttls/ttls.service';
import { Role } from 'src/enum/role.enum';
import { DocumentDataService } from 'src/document_data/document_data.service';

const axios = require('axios');

dotenv.config();
let hostname: string;
let port: number;

@Injectable()
export class AdminService {
  constructor(
    private readonly ttlsService: TTLSService,
    private readonly documentTemplateService: DocumentTemplateService,
    private readonly provisionService: ProvisionService,
    private readonly documentTypeService: DocumentTypeService,
    private readonly documentDataService: DocumentDataService
  ) {
    hostname = process.env.backend_url ? process.env.backend_url : `http://localhost`;
    // local development backend port is 3001, docker backend port is 3000
    port = process.env.backend_url ? 3000 : 3001;
  }

  activateTemplate(data: { id: number; update_userid: string; document_type_id: number }): Promise<any> {
    return this.documentTemplateService.activateTemplate(data);
  }

  downloadTemplate(id: number) {
    return this.documentTemplateService.findOne(id);
  }

  removeTemplate(document_type_id: number, id: number): Promise<any> {
    return this.documentTemplateService.remove(document_type_id, id);
  }

  updateTemplate(data: {
    id: number;
    documentNo: number;
    documentName: string;
    document_type_id: number;
  }): Promise<any> {
    return this.documentTemplateService.updateTemplate(data);
  }

  async uploadTemplate(
    data: {
      document_type_id: number;
      active_flag: boolean;
      mime_type: string;
      file_name: string;
      template_author: string;
      create_userid: string;
    },
    file: Express.Multer.File
  ): Promise<any> {
    return this.documentTemplateService.create(
      {
        document_type_id: data.document_type_id,
        template_author: data.template_author,
        mime_type: data.mime_type,
        file_name: data.file_name,
        comments: '',
        create_userid: data.create_userid,
      },
      file
    );
  }

  async getToken() {
    const url = process.env.users_api_token_url;
    const token = `${process.env.users_api_client_id}:${process.env.users_api_client_secret}`;
    const encodedToken = Buffer.from(token).toString('base64');
    const config = {
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

  /**
   * Used by the Add Administrator search button
   * Searches for an IDIR user by their email and checks
   * that they aren't already a TICDI admin
   *
   * @param email
   * @returns a list of users found using the search parameters
   */
  async searchUsers(email: string): Promise<{
    firstName: string;
    lastName: string;
    username: string;
    idirUsername: string;
  }> {
    const url = `${process.env.users_api_base_url}/${process.env.css_environment}/idir/users?&email=${email}`;
    const bearerToken = await this.getToken();

    const searchData: SearchResultsItem[] = await axios
      .get(url, {
        headers: { Authorization: 'Bearer ' + bearerToken },
      })
      .then((res) => {
        return res.data.data;
      })
      .catch((err) => {
        console.log(err.response.data);
        throw new Error('No users found');
      });
    const firstName = searchData[0].firstName ? searchData[0].firstName : '';
    const lastName = searchData[0].lastName ? searchData[0].lastName : '';
    const username = searchData[0].attributes
      ? searchData[0].attributes.idir_username[0]
        ? searchData[0].attributes.idir_username[0]
        : ''
      : '';
    const idirUsername = searchData[0].attributes
      ? searchData[0].attributes.idir_user_guid[0]
        ? searchData[0].attributes.idir_user_guid[0]
        : ''
      : '';
    const userObject = {
      firstName: firstName,
      lastName: lastName,
      username: username,
      idirUsername: idirUsername,
    };
    const cleanIdirUsername = idirUsername.split('@')[0].concat('@idir');
    const roleUrl = `${process.env.users_api_base_url}/integrations/${process.env.integration_id}/${process.env.css_environment}/users/${cleanIdirUsername}/roles`;
    const roles = await axios
      .get(roleUrl, {
        headers: { Authorization: 'Bearer ' + bearerToken },
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err.response.data);
        throw new Error("There was an issue checking that user's roles");
      });
    let isAdmin: boolean = false;
    for (let entry of roles.data) {
      if (entry && entry.name == 'ticdi_admin') {
        isAdmin = true;
      }
    }
    if (isAdmin) {
      throw new Error('That user is already a TICDI admin');
    }
    return userObject;
  }

  /**
   * Searches for an IDIR user with the given search params and if only one is found
   * then gives them the ticdi_admin & generate_documents roles in both IDIR and AzureIDIR
   *
   * @param firstName
   * @param lastName
   * @param email
   * @returns user object to be displayed in the frontend
   */
  async addAdmin(username: string): Promise<void> {
    username = username.split('@')[0]; // remove any '@idir' or '@azureidir' from the username
    const addAdminUrl = `${process.env.users_api_base_url}/integrations/${process.env.integration_id}/${process.env.css_environment}/user-role-mappings`;
    const bearerToken = await this.getToken();

    try {
      const idirRolesUrl = `${process.env.users_api_base_url}/integrations/${process.env.integration_id}/${
        process.env.css_environment
      }/users/${username + '@idir'}/roles`;
      const idirRoleData = await axios
        .get(idirRolesUrl, { headers: { Authorization: 'Bearer ' + bearerToken } })
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => console.log(err.response.data));
      if (idirRoleData.length > 0) {
        const existingUserRoles = idirRoleData.map((item) => item.name).join(', ');
        console.log(`User already has roles: ${existingUserRoles}`);
        // throw new Error('User already has roles.');
      }

      await axios
        .post(
          addAdminUrl,
          {
            roleName: Role.TICDI_ADMIN,
            username: username + '@idir',
            operation: 'add',
          },
          { headers: { Authorization: 'Bearer ' + bearerToken } }
        )
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          throw new Error('Failed to add idir ticdi_admin role');
        });
      await axios
        .post(
          addAdminUrl,
          {
            roleName: Role.GENERATE_DOCUMENTS,
            username: username + '@idir',
            operation: 'add',
          },
          { headers: { Authorization: 'Bearer ' + bearerToken } }
        )
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          throw new Error('Failed to add idir generate_documents role');
        });
      await axios
        .post(
          addAdminUrl,
          {
            roleName: Role.TICDI_ADMIN,
            username: username + '@azureidir',
            operation: 'add',
          },
          { headers: { Authorization: 'Bearer ' + bearerToken } }
        )
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          throw new Error('Failed to add azureidir ticdi_admin role');
        });
      await axios
        .post(
          addAdminUrl,
          {
            roleName: Role.GENERATE_DOCUMENTS,
            username: username + '@azureidir',
            operation: 'add',
          },
          { headers: { Authorization: 'Bearer ' + bearerToken } }
        )
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          throw new Error('Failed to add azureidir generate_documents role');
        });
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Gets a list of all ticdi_admin users
   *
   * @returns all ticdi_admin users
   */
  async getAdminUsers(): Promise<UserObject[]> {
    const bearerToken = await this.getToken();
    const url = `${process.env.users_api_base_url}/integrations/${process.env.integration_id}/${process.env.css_environment}/roles/${Role.TICDI_ADMIN}/users`;
    const data: SearchResultsItem[] = await axios
      .get(url, {
        headers: { Authorization: 'Bearer ' + bearerToken },
      })
      .then((res) => {
        return res.data.data;
      })
      .catch((err) => console.log(err.response.data));

    return this.formatSearchData(data);
  }

  async getExportData(): Promise<string> {
    const bearerToken = await this.getToken();
    const url = `${process.env.users_api_base_url}/integrations/${process.env.integration_id}/${process.env.css_environment}/roles/${Role.TICDI_ADMIN}/users`;
    const data: SearchResultsItem[] = await axios
      .get(url, {
        headers: { Authorization: 'Bearer ' + bearerToken },
      })
      .then((res) => {
        console.log(res.data.data);
        return res.data.data;
      })
      .catch((err) => console.log(err.response.data));

    return this.formatExportData(data);
  }

  /**
   * Removes the ticdi_admin & generate_documents role from an IDIR user
   *
   * @param username
   * @returns null
   */
  async removeAdmin(username: string): Promise<{ error: string | null }> {
    const bearerToken = await this.getToken();
    const idirUsername = username?.split('@')[0].concat('@idir');
    const azureidirUsername = username?.split('@')[0].concat('@azureidir');
    const idirAdminUrl = `${process.env.users_api_base_url}/integrations/${process.env.integration_id}/${process.env.css_environment}/users/${idirUsername}/roles/${Role.TICDI_ADMIN}`;
    const idirGDUrl = `${process.env.users_api_base_url}/integrations/${process.env.integration_id}/${process.env.css_environment}/users/${idirUsername}/roles/${Role.GENERATE_DOCUMENTS}`;
    const azureidirAdminUrl = `${process.env.users_api_base_url}/integrations/${process.env.integration_id}/${process.env.css_environment}/users/${azureidirUsername}/roles/${Role.TICDI_ADMIN}`;
    const azureidirGDUrl = `${process.env.users_api_base_url}/integrations/${process.env.integration_id}/${process.env.css_environment}/users/${azureidirUsername}/roles/${Role.GENERATE_DOCUMENTS}`;
    try {
      await axios
        .delete(idirAdminUrl, {
          headers: { Authorization: 'Bearer ' + bearerToken },
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      console.log(err.response.data);
      if (err?.response?.data?.message?.includes('not associated')) {
        // ignore error if user is not associated with the role
      } else {
        return { error: 'Failed to remove idir_admin role' };
      }
    }
    try {
      await axios
        .delete(idirGDUrl, {
          headers: { Authorization: 'Bearer ' + bearerToken },
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      console.log(err.response.data);
      if (err?.response?.data?.message?.includes('not associated')) {
        // ignore error if user is not associated with the role
      } else {
        return { error: 'Failed to remove generate_documents role' };
      }
    }
    try {
      await axios
        .delete(azureidirAdminUrl, {
          headers: { Authorization: 'Bearer ' + bearerToken },
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      console.log(err.response.data);
      if (err?.response?.data?.message?.includes('not associated')) {
        // ignore error if user is not associated with the role
      } else {
        return { error: 'Failed to remove idir_admin role' };
      }
    }
    try {
      await axios
        .delete(azureidirGDUrl, {
          headers: { Authorization: 'Bearer ' + bearerToken },
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      console.log(err.response.data);
      if (err?.response?.data?.message?.includes('not associated')) {
        // ignore error if user is not associated with the role
      } else {
        return { error: 'Failed to remove generate_documents role' };
      }
    }
    return { error: null };
  }

  async getDocumentTemplates(document_type_id: number): Promise<any> {
    const documentTemplateObjects = await this.documentTemplateService.findAll(document_type_id);
    const formattedDate = (date: Date) => date.toISOString().split('T')[0];
    return documentTemplateObjects.map((template) => {
      return {
        id: template.id,
        template_version: template.template_version,
        file_name: template.file_name,
        active_flag: template.active_flag,
        create_timestamp: formattedDate(template.create_timestamp),
        update_timestamp: formattedDate(template.update_timestamp),
      };
    });
  }

  async getProvisions(): Promise<any> {
    return this.provisionService.findAll();
  }

  async getDocumentVariables(): Promise<any> {
    return this.provisionService.findAllVariables();
  }

  enableProvision(id: number): Promise<any> {
    return this.provisionService.enable(id);
  }

  disableProvision(id: number): Promise<any> {
    return this.provisionService.disable(id);
  }

  async addDocumentType(name: string, prefix: string, created_by: string, created_date: string, create_userid: string) {
    const documentType: DocumentType = await this.documentTypeService.add(
      name,
      prefix,
      created_by,
      created_date,
      create_userid
    );
    await this.provisionService.generateDocTypeProvisions(documentType);
  }

  async removeDocumentType(document_type_id: number) {
    try {
      // remove the related doc type provisions
      await this.provisionService.removeDocTypeProvisions(document_type_id);
      // remove the related doc type provision groups
      await this.documentTypeService.removeProvisionGroupByDocTypeId(document_type_id);
      // remove templates related to the doc type
      await this.documentTemplateService.removeByDocTypeId(document_type_id);
      // remove the related doc type data
      await this.documentDataService.removeByDocTypeId(document_type_id);
      // remove the doc type
      await this.documentTypeService.remove(document_type_id);
    } catch (err) {
      console.log(err);
      throw new Error('Error in removeDocumentType');
    }
  }

  /**
   * @param data
   * @returns formatted user data for displaying on the frontend
   */
  formatSearchData(data: SearchResultsItem[]): UserObject[] {
    let userObjectArray = [];
    let usernames = new Set();

    for (let entry of data) {
      const idirUsername = entry.username ? entry.username.split('@')[0] : '';

      // if this username has already been added, skip this entry
      if (usernames.has(idirUsername)) {
        continue;
      }

      usernames.add(idirUsername);

      const firstName = entry.firstName ? entry.firstName : '';
      const lastName = entry.lastName ? entry.lastName : '';
      const username = entry.attributes.idir_username[0] ? entry.attributes.idir_username[0] : '';
      const email = entry.email ? entry.email : '';

      const userObject: UserObject = {
        name: firstName + ' ' + lastName,
        username: username,
        email: email,
        remove: 'Remove',
        idirUsername: idirUsername,
      };
      userObjectArray.push(userObject);
    }

    return userObjectArray;
  }

  /**
   * @param data
   * @returns formatted admin user data for exporting to csv
   */
  formatExportData(data: SearchResultsItem[]): string {
    const header = 'First Name,Last Name,Username,Email,IDIR User GUID,IDIR Username,Display Name\n';
    const csvRows = data.map((entry) => {
      const firstName = entry.firstName ? `"${entry.firstName}"` : '';
      const lastName = entry.lastName ? `"${entry.lastName}"` : '';
      const username = entry.username ? `"${entry.username}"` : '';
      const email = entry.email ? `"${entry.email}"` : '';
      const idir_user_guid = entry.attributes.idir_user_guid[0] ? `"${entry.attributes.idir_user_guid[0]}"` : '';
      const idir_username = entry.attributes.idir_username[0] ? `"${entry.attributes.idir_username[0]}"` : '';
      const display_name = entry.attributes.display_name[0] ? `"${entry.attributes.display_name[0]}"` : '';

      return [firstName, lastName, username, email, idir_user_guid, idir_username, display_name].join(',');
    });

    return header + csvRows.join('\n');
  }

  async getPreviewPdf(id: number): Promise<Buffer> {
    const cdogsToken = await this.ttlsService.callGetToken();
    const documentTemplateObject = await this.documentTemplateService.findOne(id);

    const bufferBase64 = documentTemplateObject.the_file;
    const data = {};
    const md = JSON.stringify({
      data,
      formatters:
        '{"myFormatter":"_function_myFormatter|function(data) { return data.slice(1); }","myOtherFormatter":"_function_myOtherFormatter|function(data) {return data.slice(2);}"}',
      options: {
        cacheReport: false,
        convertTo: 'pdf',
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
}
