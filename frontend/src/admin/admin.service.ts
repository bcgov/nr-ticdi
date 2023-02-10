import { Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";
import { HttpService } from "@nestjs/axios";
import { SearchResultsItem, UserObject } from "utils/types";
import { TICDIADMIN } from "utils/constants";
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

  async searchUsers(
    firstName: string,
    lastName: string,
    email: string
  ): Promise<UserObject> {
    const url = `${process.env.users_api_base_url}/${process.env.css_environment}/idir/users?firstName=${firstName}&lastName=${lastName}&email=${email}`;
    console.log(url);
    const bearerToken = await this.getToken();
    const searchData: SearchResultsItem[] = await axios
      .get(url, {
        headers: { Authorization: "Bearer " + bearerToken },
      })
      .then((res) => {
        return res.data.data;
      })
      .catch((err) => console.log(err.response.data));
    console.log("~~~~");
    if (searchData.length > 1) {
      console.log("more than one user found");
      throw new Error("Multiple Users Found");
    } else if (searchData.length == 0) {
      console.log("no users found");
      throw new Error("No Users Found");
    }
    console.log(searchData);
    console.log("~~~~");
    const userObject = this.formatSearchData(searchData);
    return userObject[0];
  }

  async getAdminUsers(): Promise<UserObject[]> {
    const bearerToken = await this.getToken();
    const url = `${process.env.users_api_base_url}/integrations/${process.env.integration_id}/${process.env.css_environment}/roles/ticdi_admin/users`;
    //await this.searchUsers("Michael", "Tennant", "mtennant@salussystems.com");
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

  async removeAdmin(username: string) {
    const ticdiAdminRole = "ticdi_admin";
    const bearerToken = await this.getToken();
    const url = `${process.env.users_api_base_url}/integrations/${process.env.integration_id}/${process.env.css_environment}/users/${username}/roles/${ticdiAdminRole}`;
    const res = await axios
      .delete(url, {
        headers: { Authorization: "Bearer " + bearerToken },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => console.log(err.response.data));
    console.log(res);
    return "removed";
  }

  formatSearchData(data: SearchResultsItem[]): UserObject[] {
    console.log("formatting");
    console.log(data);
    let userObjectArray = [];
    for (let entry of data) {
      const firstName = entry.firstName ? entry.firstName : "";
      const lastName = entry.lastName ? entry.lastName : "";
      const username = entry.attributes.idir_username[0]
        ? entry.attributes.idir_username[0]
        : "";
      const email = entry.email ? entry.email : "";
      const idirUsername = entry.username ? entry.username : "";
      const userObject: UserObject = {
        name: firstName + " " + lastName,
        username: username,
        email: email,
        role: TICDIADMIN,
        idirUsername: idirUsername,
      };
      userObjectArray.push(userObject);
    }

    return userObjectArray;
  }
}
