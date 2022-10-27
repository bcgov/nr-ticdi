import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import { URL } from "url";

let keycloak_login_fullurl, keycloak_login_baseurl, keycloak_login_params;
let redirectUri = encodeURI("http://localhost:3000");

@Catch(HttpException)
export class AuthenticationFilter implements ExceptionFilter {
  constructor() {
    keycloak_login_params = `response_type=code&client_id=${process.env.keycloak_client_id}&redirect_uri=${redirectUri}`;
    keycloak_login_baseurl = `${process.env.keycloak_base_url}/auth/realms/${process.env.keycloak_realm}/protocol/openid-connect/auth`;
    keycloak_login_fullurl =
      keycloak_login_baseurl + "?" + keycloak_login_params;
    console.log(keycloak_login_fullurl);
  }
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const protocol =
      process.env.ticdi_environment == "DEVELOPMENT" ? "http://" : "https://";
    const url = new URL(protocol + request.headers.host + response.req.url);
    const urlPath = url.pathname == "/" ? "" : url.pathname;
    const redirect = encodeURI(url.origin + urlPath);
    keycloak_login_params = `?response_type=code&client_id=${process.env.keycloak_client_id}&redirect_uri=${redirect}`;
    keycloak_login_fullurl = keycloak_login_baseurl + keycloak_login_params;
    const status = exception.getStatus();
    response.status(status).redirect(keycloak_login_fullurl);
  }
}
