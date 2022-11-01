import { Controller, Post, Session, Body } from "@nestjs/common";
import { SessionData } from "utils/types";
import { AxiosRequestConfig } from "axios";
import { HttpService } from "@nestjs/axios";

let requestUrl: string;
let requestConfig: AxiosRequestConfig;

@Controller("admin")
export class AdminController {
  constructor(private readonly httpService: HttpService) {
    const hostname = process.env.BACKEND_URL
      ? process.env.BACKEND_URL
      : `http://localhost`;
    const port = process.env.BACKEND_URL ? 3000 : 3001;
    requestUrl = `${hostname}:${port}/template/`;
    requestConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  @Post("upload-template")
  async root(
    @Session() session: { data?: SessionData },
    @Body() template: any
  ) {
    let isAdmin = false;
    if (
      session.data &&
      session.data.activeAccount &&
      session.data.activeAccount.client_roles
    ) {
      for (let role of session.data.activeAccount.client_roles) {
        if (role == "ticdi_admin") {
          isAdmin = true;
        }
      }
    }
    if (isAdmin) {
      return { data: template };
    } else {
      return { message: "NO" };
    }
  }
}
