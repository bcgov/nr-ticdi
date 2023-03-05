import { Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";
import { HttpService } from "@nestjs/axios";
import { ExportDataObject, SearchResultsItem, UserObject } from "utils/types";
import { REPORT_TYPES } from "utils/constants";
const axios = require("axios");
const FormData = require("form-data");

dotenv.config();
let hostname: string;
let port: number;

@Injectable()
export class AdminService {
  constructor(private readonly httpService: HttpService) {
    hostname = process.env.backend_url
      ? process.env.backend_url
      : `http://localhost`;
    // local development backend port is 3001, docker backend port is 3000
    port = process.env.backend_url ? 3000 : 3001;
  }

  async activateTemplate(data: {
    id: number;
    update_userid: string;
    document_type: string;
  }): Promise<any> {
    const url = `${hostname}:${port}/document-template/activate-template`;
    return axios
      .post(url, {
        id: data.id,
        update_userid: data.update_userid,
        document_type: data.document_type,
      })
      .then((res) => {
        return res.data;
      });
  }

  async downloadTemplate(id: number) {
    const url = `${hostname}:${port}/document-template/find-one/${id}`;
    return axios.get(url).then((res) => {
      return res.data;
    });
  }

  async removeTemplate(reportType: string, id: number): Promise<any> {
    const url = `${hostname}:${port}/document-template/remove/${encodeURI(
      reportType
    )}/${id}`;
    return axios.get(url).then((res) => {
      return res.data;
    });
  }

  async uploadTemplate(
    data: {
      document_type: string;
      active_flag: boolean;
      mime_type: string;
      file_name: string;
      template_author: string;
      create_userid: string;
    },
    file: Express.Multer.File
  ): Promise<any> {
    const url = `${hostname}:${port}/document-template/create`;
    const form: any = new FormData();
    form.append("document_type", data.document_type);
    form.append("active_flag", data.active_flag);
    form.append("mime_type", data.mime_type);
    form.append("file_name", data.file_name);
    form.append("template_author", data.template_author);
    form.append("create_userid", data.create_userid);
    form.append("file", file.buffer, "file");
    return axios.post(url, form).then((res) => {
      return res.data;
    });
  }

  async getToken() {
    const url = process.env.users_api_token_url;
    const token = `${process.env.users_api_client_id}:${process.env.users_api_client_secret}`;
    const encodedToken = Buffer.from(token).toString("base64");
    const config = {
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
        headers: { Authorization: "Bearer " + bearerToken },
      })
      .then((res) => {
        return res.data.data;
      })
      .catch((err) => {
        console.log(err.response.data);
        throw new Error("No users found");
      });
    const firstName = searchData[0].firstName ? searchData[0].firstName : "";
    const lastName = searchData[0].lastName ? searchData[0].lastName : "";
    const username = searchData[0].attributes
      ? searchData[0].attributes.idir_username[0]
        ? searchData[0].attributes.idir_username[0]
        : ""
      : "";
    const idirUsername = searchData[0].attributes
      ? searchData[0].attributes.idir_user_guid[0]
        ? searchData[0].attributes.idir_user_guid[0]
        : ""
      : "";
    const userObject = {
      firstName: firstName,
      lastName: lastName,
      username: username,
      idirUsername: idirUsername,
    };
    const roleUrl = `${process.env.users_api_base_url}/integrations/${process.env.integration_id}/${process.env.css_environment}/users/${idirUsername}@idir/roles`;
    const roles = await axios
      .get(roleUrl, {
        headers: { Authorization: "Bearer " + bearerToken },
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
      if (entry && entry.name == "ticdi_admin") {
        isAdmin = true;
      }
    }
    if (isAdmin) {
      throw new Error("That user is already a TICDI admin");
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
        headers: { Authorization: "Bearer " + bearerToken },
      })
      .then((res) => {
        return res.data.data;
      })
      .catch((err) => console.log(err.response.data));
    if (searchData.length > 1) {
      throw new Error("More than one user was found");
    } else if (searchData.length == 0) {
      throw new Error("No users were found");
    }
    const userObject: UserObject = this.formatSearchData(searchData)[0];
    await axios
      .post(
        addAdminUrl,
        {
          roleName: "ticdi_admin",
          username: userObject.idirUsername + "@idir",
          operation: "add",
        },
        { headers: { Authorization: "Bearer " + bearerToken } }
      )
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        throw new Error("Failed to add admin role");
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
        headers: { Authorization: "Bearer " + bearerToken },
      })
      .then((res) => {
        return res.data.data;
      })
      .catch((err) => console.log(err.response.data));

    return this.formatSearchData(data);
  }

  async getExportData(): Promise<ExportDataObject[]> {
    const bearerToken = await this.getToken();
    const url = `${process.env.users_api_base_url}/integrations/${process.env.integration_id}/${process.env.css_environment}/roles/ticdi_admin/users`;
    const data: SearchResultsItem[] = await axios
      .get(url, {
        headers: { Authorization: "Bearer " + bearerToken },
      })
      .then((res) => {
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
    const ticdiAdminRole = "ticdi_admin";
    const bearerToken = await this.getToken();
    const url = `${process.env.users_api_base_url}/integrations/${process.env.integration_id}/${process.env.css_environment}/users/${username}@idir/roles/${ticdiAdminRole}`;
    const res = await axios
      .delete(url, {
        headers: { Authorization: "Bearer " + bearerToken },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err.response.data);
        return { message: "Failed to remove admin privileges" };
      });
    return { message: "success" };
  }

  async getTemplates(reportId: number) {
    const documentType =
      reportId == 1 || reportId == 2 ? REPORT_TYPES[reportId - 1] : "none";
    const url = `${hostname}:${port}/document-template/${encodeURI(
      documentType
    )}`;
    const data = await axios
      .get(url)
      .then((res) => {
        return res.data;
      })
      .catch((err) => console.log(err.response.data));
    let documents: {
      version: number;
      file_name: string;
      updated_date: string;
      status: string;
      active: boolean;
      template_id: number;
    }[] = [];
    for (let entry of data) {
      const document = {
        version: entry.template_version,
        file_name: entry.file_name,
        updated_date: entry.update_timestamp.split("T")[0],
        status: "???",
        active: entry.active_flag,
        template_id: entry.id,
      };
      documents.push(document);
    }
    return documents;
  }

  async getNFRTemplates() {
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
            version: template.template_version,
            file_name: template.file_name,
            updated_date: nfr.update_timestamp.split("T")[0],
            status: nfr.status,
            active: template.active_flag,
            nfr_id: nfr.id,
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

  async getDocumentTemplates(documentType: string): Promise<any> {
    const returnItems = [
      "id",
      "template_version",
      "file_name",
      "uploaded_date",
      "active_flag",
      "update_timestamp",
    ];
    const url = `${hostname}:${port}/document-template/${encodeURI(
      documentType
    )}`;
    const documentTemplateObjects = await axios
      .get(url)
      .then((res) => {
        return res.data;
      })
      .catch((err) => console.log(err.response.data));
    return documentTemplateObjects.map((obj) =>
      Object.keys(obj)
        .filter((key) => returnItems.includes(key))
        .reduce(
          (acc, key) => {
            key == "update_timestamp"
              ? (acc[key] = obj[key].split("T")[0])
              : (acc[key] = obj[key]);
            return acc;
          },
          { view: "view", remove: "remove" }
        )
    );
  }

  async getNFRProvisions(): Promise<any> {
    const returnItems = [
      "id",
      "dtid",
      "type",
      "provision_group",
      "max",
      "provision_text",
      "free_text",
      "category",
      "active_flag",
    ];
    const url = `${hostname}:${port}/nfr-provision`;
    const nfrProvisions = await axios
      .get(url)
      .then((res) => {
        return res.data;
      })
      .catch((err) => console.log(err.response.data));
    return nfrProvisions.map((obj) =>
      Object.keys(obj)
        .filter((key) => returnItems.includes(key))
        .reduce(
          (acc, key) => {
            acc[key] = obj[key];
            return acc;
          },
          { edit: "edit" }
        )
    );
  }

  async getNFRProvisionsByVariant(variantName: string): Promise<any> {
    const returnItems = [
      "type",
      "provision_text",
      "free_text",
      "category",
      "select",
      "nfr_data_provisions",
      "provision_group",
      "id",
    ];
    const url = `${hostname}:${port}/nfr-provision/variant/${variantName}`;
    const nfrProvisions = await axios
      .get(url)
      .then((res) => {
        return res.data;
      })
      .catch((err) => console.log(err.response.data));
    console.log(nfrProvisions);
    const reduced = nfrProvisions.map((obj) =>
      Object.keys(obj)
        .filter((key) => returnItems.includes(key))
        .reduce(
          (acc, key) => {
            acc[key] = obj[key];
            return acc;
          },
          { select: "select" }
        )
    );
    return reduced.map((obj) => {
      const groupObj = obj.provision_group;
      const nfrDataProvisions = obj.nfr_data_provisions;
      console.log(nfrDataProvisions);
      delete obj["provision_group"];
      delete obj["nfr_data_provisions"];
      obj["max"] = groupObj.max;
      obj["provision_group"] = groupObj.provision_group;
      return obj;
    });
  }

  async enableProvision(id: number): Promise<any> {
    const url = `${hostname}:${port}/nfr-provision/enable/${id}`;
    return await axios.get(url).then((res) => {
      return res.data;
    });
  }

  async disableProvision(id: number): Promise<any> {
    const url = `${hostname}:${port}/nfr-provision/disable/${id}`;
    return await axios.get(url).then((res) => {
      return res.data;
    });
  }

  // async selectProvision(id: number): Promise<any> {
  //   const url = `${hostname}:${port}/nfr-provision/select/${id}`;
  //   return await axios.get(url).then((res) => {
  //     return res.data;
  //   });
  // }

  // async deselectProvision(id: number): Promise<any> {
  //   const url = `${hostname}:${port}/nfr-provision/deselect/${id}`;
  //   return await axios.get(url).then((res) => {
  //     return res.data;
  //   });
  // }

  async getGroupMax(): Promise<any> {
    const url = `${hostname}:${port}/nfr-provision/get-group-max/1`;
    return await axios.get(url).then((res) => {
      return res.data;
    });
  }

  async getGroupMaxByVariant(variantName: string): Promise<any> {
    const url = `${hostname}:${port}/nfr-provision/get-group-max/variant/${variantName}`;
    return await axios.get(url).then((res) => {
      return res.data;
    });
  }

  async addProvision(
    provisionParams: {
      type: string;
      provision_group: number;
      provision_group_text: string;
      max: number;
      provision: string;
      freeText: string;
      category: string;
    },
    create_userid: string
  ) {
    const url = `${hostname}:${port}/nfr-provision`;
    return await axios
      .post(url, { ...provisionParams, create_userid })
      .then((res) => {
        return res.data;
      });
  }

  async updateProvision(
    provisionParams: {
      id: number;
      type: string;
      provision_group: number;
      provision_group_text: string;
      max: number;
      provision: string;
      freeText: string;
      category: string;
    },
    update_userid: string
  ) {
    const url = `${hostname}:${port}/nfr-provision/update`;
    return await axios
      .post(url, { ...provisionParams, update_userid })
      .then((res) => {
        return res.data;
      });
  }

  /**
   * @param data
   * @returns formatted user data for displaying on the frontend
   */
  formatSearchData(data: SearchResultsItem[]): UserObject[] {
    let userObjectArray = [];
    for (let entry of data) {
      const firstName = entry.firstName ? entry.firstName : "";
      const lastName = entry.lastName ? entry.lastName : "";
      const username = entry.attributes.idir_username[0]
        ? entry.attributes.idir_username[0]
        : "";
      const email = entry.email ? entry.email : "";
      const idirUsername = entry.username
        ? entry.username.replace("@idir", "")
        : "";
      const userObject: UserObject = {
        name: firstName + " " + lastName,
        username: username,
        email: email,
        remove: "Remove",
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
  formatExportData(data: SearchResultsItem[]): ExportDataObject[] {
    let exportDataObjectArray = [];
    for (let entry of data) {
      let firstName = entry.firstName ? entry.firstName : "";
      let lastName = entry.lastName ? entry.lastName : "";
      let username = entry.username ? entry.username : "";
      let email = entry.email ? entry.email : "";
      let idir_user_guid = entry.attributes.idir_user_guid[0]
        ? entry.attributes.idir_user_guid[0]
        : "";
      let idir_username = entry.attributes.idir_username[0]
        ? entry.attributes.idir_username[0]
        : "";
      let display_name = entry.attributes.display_name[0]
        ? entry.attributes.display_name[0]
        : "";
      const exportDataObject: ExportDataObject = {
        firstName: '"' + firstName + '"',
        lastName: '"' + lastName + '"',
        username: '"' + username + '"',
        email: '"' + email + '"',
        idir_user_guid: '"' + idir_user_guid + '"',
        idir_username: '"' + idir_username + '"',
        display_name: '"' + display_name + '"',
      };
      exportDataObjectArray.push(exportDataObject);
    }

    return exportDataObjectArray;
  }
}
