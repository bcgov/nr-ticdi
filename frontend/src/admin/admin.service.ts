import { Injectable } from "@nestjs/common";
import axios from "axios";
import * as dotenv from "dotenv";

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

  // get a ticdi json object from the backend using a dtid
  async uploadTemplate(data: any): Promise<any> {
    const url = `${hostname}:${port}/document-template/create`;
    return axios
      .post(
        url,
        { ...data },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        return res.data;
      });
  }
}
