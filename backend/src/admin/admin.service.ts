import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { HttpService } from '@nestjs/axios';
import { ExportDataObject, SearchResultsItem, UserObject } from 'utils/types';
import { REPORT_TYPES } from 'utils/constants';
import { DocumentTemplateService } from 'src/document_template/document_template.service';
import { DocumentType } from 'src/document_type/entities/document_type.entity';
import { ProvisionService } from 'src/provision/provision.service';
const axios = require('axios');
const FormData = require('form-data');

dotenv.config();
let hostname: string;
let port: number;

@Injectable()
export class AdminService {
  constructor(
    private readonly httpService: HttpService,
    private readonly documentTemplateService: DocumentTemplateService,
    private readonly provisionService: ProvisionService
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
    const roleUrl = `${process.env.users_api_base_url}/integrations/${process.env.integration_id}/${process.env.css_environment}/users/${idirUsername}@idir/roles`;
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
   * then gives them the ticdi_admin role
   *
   * @param firstName
   * @param lastName
   * @param email
   * @returns user object to be displayed in the frontend
   */
  async addAdmin(idirUsername: string): Promise<UserObject> {
    const url = `${process.env.users_api_base_url}/${process.env.css_environment}/idir/users?&guid=${idirUsername}`;
    const addAdminUrl = `${process.env.users_api_base_url}/integrations/${process.env.integration_id}/${process.env.css_environment}/user-role-mappings`;
    const bearerToken = await this.getToken();
    const searchData: SearchResultsItem[] = await axios
      .get(url, {
        headers: { Authorization: 'Bearer ' + bearerToken },
      })
      .then((res) => {
        return res.data.data;
      })
      .catch((err) => console.log(err.response.data));
    if (searchData.length > 1) {
      throw new Error('More than one user was found');
    } else if (searchData.length == 0) {
      throw new Error('No users were found');
    }
    const userObject: UserObject = this.formatSearchData(searchData)[0];
    await axios
      .post(
        addAdminUrl,
        {
          roleName: 'ticdi_admin',
          username: userObject.idirUsername + '@idir',
          operation: 'add',
        },
        { headers: { Authorization: 'Bearer ' + bearerToken } }
      )
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        throw new Error('Failed to add admin role');
      });
    return userObject;
  }

  /**
   * Gets a list of all ticdi_admin users
   *
   * @returns all ticdi_admin users
   */
  async getAdminUsers(): Promise<UserObject[]> {
    const bearerToken = await this.getToken();
    const url = `${process.env.users_api_base_url}/integrations/${process.env.integration_id}/${process.env.css_environment}/roles/ticdi_admin/users`;
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
    const url = `${process.env.users_api_base_url}/integrations/${process.env.integration_id}/${process.env.css_environment}/roles/ticdi_admin/users`;
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
   * Removes the ticdi_admin role from an IDIR user
   *
   * @param username
   * @returns null
   */
  async removeAdmin(username: string) {
    const ticdiAdminRole = 'ticdi_admin';
    const bearerToken = await this.getToken();
    const url = `${process.env.users_api_base_url}/integrations/${process.env.integration_id}/${process.env.css_environment}/users/${username}@idir/roles/${ticdiAdminRole}`;
    const res = await axios
      .delete(url, {
        headers: { Authorization: 'Bearer ' + bearerToken },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err.response.data);
        return { message: 'Failed to remove admin privileges' };
      });
    return { message: 'error' };
  }

  // async getTemplates(document_type_id: number) {
  //   const data = await this.documentTemplateService.findAll(document_type_id);
  //   let documents: {
  //     version: number;
  //     file_name: string;
  //     updated_date: string;
  //     status: string;
  //     active: boolean;
  //     template_id: number;
  //   }[] = [];
  //   for (let entry of data) {
  //     const document = {
  //       version: entry.template_version,
  //       file_name: entry.file_name,
  //       updated_date: entry.update_timestamp.toString().split('T')[0],
  //       status: '???',
  //       active: entry.active_flag,
  //       template_id: entry.id,
  //     };
  //     documents.push(document);
  //   }
  //   return documents;
  // }

  async getDocumentTemplates(document_type_id: number): Promise<any> {
    const documentTemplateObjects = await this.documentTemplateService.findAll(document_type_id);
    const formattedDate = (date: Date) => date.toISOString().split('T')[0];
    return documentTemplateObjects.map((template) => {
      return {
        id: template.id,
        template_version: template.template_version,
        file_name: template.file_name,
        active_flag: template.active_flag,
        update_timestamp: formattedDate(template.update_timestamp),
      };
    });
  }

  async getDocumentProvisions(): Promise<any> {
    const documentProvisions = await this.provisionService.findAll();
    return documentProvisions.map((provision) => ({
      id: provision.id,
      type: provision.type,
      provision_group: provision.provision_group,
      max: provision.max,
      provision_name: provision.provision_name,
      free_text: provision.free_text,
      help_text: provision.help_text,
      category: provision.category,
      order_value: provision.order_value,
      active_flag: provision.active_flag,
      // transform document_types to an array of ids
      document_type_ids: provision.document_types.map((dt) => dt.id),
    }));
  }

  async getDocumentVariables(): Promise<any> {
    const returnItems = ['variable_name', 'variable_value', 'help_text', 'id', 'provision_id'];
    const documentVariables = await this.provisionService.findAllVariables();
    return documentVariables.map((obj) =>
      Object.keys(obj)
        .filter((key) => returnItems.includes(key))
        .reduce(
          (acc, key) => {
            acc[key] = obj[key];
            return acc;
          },
          { edit: 'edit', remove: 'remove' }
        )
    );
  }

  enableProvision(id: number): Promise<any> {
    return this.provisionService.enable(id);
  }

  disableProvision(id: number): Promise<any> {
    return this.provisionService.disable(id);
  }

  getGroupMax(): Promise<any> {
    return this.provisionService.getGroupMax();
  }

  addProvision(
    provisionParams: {
      type: string;
      provision_group: number;
      provision_group_text: string;
      max: number;
      provision: string;
      free_text: string;
      help_text: string;
      category: string;
      order_value: number;
      variants: number[];
    },
    create_userid: string
  ) {
    return this.provisionService.create({ ...provisionParams, create_userid });
  }

  updateProvision(
    provisionParams: {
      id: number;
      type: string;
      provision_group: number;
      provision_group_text: string;
      max: number;
      provision: string;
      free_text: string;
      help_text: string;
      category: string;
      order_value: number;
      document_type_ids: number[];
    },
    update_userid: string
  ) {
    return this.provisionService.update(provisionParams.id, provisionParams.document_type_ids, {
      ...provisionParams,
      update_userid,
    });
  }

  addVariable(
    variableParams: {
      variable_name: string;
      variable_value: string;
      help_text: string;
      provision_id: number;
    },
    create_userid: string
  ) {
    return this.provisionService.addVariable({ ...variableParams, create_userid });
  }

  async updateVariable(variableParams: {
    id: number;
    variable_name: string;
    variable_value: string;
    help_text: string;
    provision_id: number;
    update_userid: string;
  }) {
    return this.provisionService.updateVariable(variableParams);
  }

  removeVariable(id: number) {
    return this.provisionService.removeVariable(id);
  }

  /**
   * @param data
   * @returns formatted user data for displaying on the frontend
   */
  formatSearchData(data: SearchResultsItem[]): UserObject[] {
    let userObjectArray = [];
    for (let entry of data) {
      const firstName = entry.firstName ? entry.firstName : '';
      const lastName = entry.lastName ? entry.lastName : '';
      const username = entry.attributes.idir_username[0] ? entry.attributes.idir_username[0] : '';
      const email = entry.email ? entry.email : '';
      const idirUsername = entry.username ? entry.username.replace('@idir', '') : '';
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
}
