import { Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";
import { Express } from "express";
const axios = require("axios");
const FormData = require("form-data");

dotenv.config();
let hostname: string;
let port: number;

@Injectable()
export class AdminService {
  constructor() {
    hostname = process.env.backend_url
      ? process.env.backend_url
      : `http://localhost`;
    // local development backend port is 3001, docker backend port is 3000
    port = process.env.backend_url ? 3000 : 3001;
  }

  async uploadTemplate(
    data: {
      document_type: string;
      comments: string;
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
    form.append("comments", data.comments);
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
}
