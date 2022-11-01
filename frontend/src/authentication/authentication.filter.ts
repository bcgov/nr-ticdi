import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { URL } from "url";

let keycloak_login_fullurl, keycloak_login_baseurl, keycloak_login_params;
let redirectUri = encodeURI("http://localhost:3000");

@Catch(HttpException)
export class AuthenticationFilter implements ExceptionFilter {
  constructor() {
    keycloak_login_baseurl = `${process.env.KEYCLOAK_BASE_URL}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/auth`;
    keycloak_login_fullurl = keycloak_login_baseurl + '?' + keycloak_login_params;
  }
  catch(exception: any, host: ArgumentsHost) {
    if (exception.status == HttpStatus.UNAUTHORIZED) {
      console.log('unauth')
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
      const protocol = process.env.site_environment == 'DEVELOPMENT' ? 'http://' : 'https://';
      const url = new URL(protocol + request.headers.host + response.req.url);
      const urlPath = url.pathname == '/' ? '' : url.pathname;
      const redirect = encodeURI(url.origin + urlPath);
      keycloak_login_params = `?response_type=code&client_id=${process.env.KEYCLOAK_CLIENT_ID}&redirect_uri=${redirect}`;
      keycloak_login_fullurl = keycloak_login_baseurl + keycloak_login_params;
      const status = exception.getStatus();
      response.status(status).redirect(keycloak_login_fullurl);
    } else if (exception.status == HttpStatus.I_AM_A_TEAPOT) {
      console.log('teapot')
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
      const protocol = process.env.site_environment == 'DEVELOPMENT' ? 'http://' : 'https://';
      const url = new URL(protocol + request.headers.host + response.req.url);
      const urlPath = '/error';
      const redirect = encodeURI(url.origin + urlPath);
      const status = exception.getStatus();
      response.status(status).redirect(redirect);
    } else if (exception.status == HttpStatus.FORBIDDEN) {
      console.log('caught forbidden')
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
      const protocol = process.env.ticdi_environment == 'DEVELOPMENT' ? 'http://' : 'https://';
      const url = new URL(protocol + request.headers.host + response.req.url);
      const status = exception.getStatus();
      response.status(status).redirect(url.origin);
    }
  }
}
