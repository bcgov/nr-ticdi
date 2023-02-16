import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";
const axios = require("axios");

dotenv.config();
let hostname: string;
let port: number;

@Injectable()
export class ReportService {
  constructor(private readonly httpService: HttpService) {
    hostname = process.env.backend_url
      ? process.env.backend_url
      : `http://localhost`;
    // local development backend port is 3001, docker backend port is 3000
    port = process.env.backend_url ? 3000 : 3001;
  }
}
