import { Injectable } from '@nestjs/common';
import * as base64 from 'base-64';
import { URLSearchParams } from 'url';
import jwt_decode from 'jwt-decode';
import { AccountObject, TokenObject } from 'utils/types';
const axios = require('axios');

export class AuthenticationError extends Error {}

@Injectable()
export class AuthenticationService {
  private readonly keycloak_base_url: string;
  private readonly realm: string;
  private readonly client_id: string;
  private readonly secret: string;
  private readonly grant_type: string;
  private readonly xapikey: string;
  private redirect_uri: string;

  constructor() {
    this.keycloak_base_url = process.env.keycloak_base_url;
    this.realm = process.env.keycloak_realm;
    this.client_id = process.env.keycloak_client_id;
    this.secret = process.env.keycloak_secret;
    this.grant_type = 'authorization_code';
    this.xapikey = process.env.KEYCLOAK_XAPIKEY;
  }

  /**
   * Call the OpenId Connect UserInfo endpoint on Keycloak: https://openid.net/specs/openid-connect-core-1_0.html#UserInfo
   *
   * If it succeeds, the token is valid and we get the user infos in the response
   * If it fails, the token is invalid or expired
   */
  async getToken(code: string, redirect: string): Promise<any> {
    const url = `${this.keycloak_base_url}/auth/realms/${this.realm}/protocol/openid-connect/token`;
    const authorization = base64.encode(`${this.client_id}:${this.secret}`);
    this.redirect_uri = redirect;

    const params = new URLSearchParams();
    params.append('code', code);
    params.append('grant_type', this.grant_type);
    params.append('client_id', this.client_id);
    params.append('redirect_uri', this.redirect_uri);

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${authorization}`,
      },
    };
    console.log('-------- get token');
    console.log(url);
    console.log(code);
    console.log(this.grant_type);
    console.log(this.client_id);
    console.log(this.redirect_uri);

    return axios
      .post(url, params, config)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log('Response:');
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log('Request:');
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log('Error config:');
        console.log(error.config);
        console.log(error);
      });
  }

  async getHealthCheck(token: string): Promise<string> {
    let decodedToken: { name: string; exp: number; auth_time: number };
    try {
      decodedToken = jwt_decode(token);
    } catch (err) {
      return 'bad';
    }
    // check that it was decoded
    if (decodedToken.name) {
      const currentTime = new Date().getTime() / 1000;
      const refresh_expiry = decodedToken.exp + 1800;
      // check if token has expired
      if (currentTime < decodedToken.exp) {
        return 'good';
      } else if (currentTime > refresh_expiry) {
        return 'bad';
      } else {
        return 'expired';
      }
    }
    return 'bad';
  }

  async getTokenDetails(token: string): Promise<{ activeAccount: AccountObject }> {
    let activeAccount: AccountObject;
    const decodedToken: {
      sub: string;
      name: string;
      given_name: string;
      family_name: string;
      idir_username: string;
      client_roles: string[];
    } = jwt_decode(token);
    activeAccount = {
      client_roles: decodedToken.client_roles,
      name: decodedToken.name,
      full_name: `${decodedToken.given_name} ${decodedToken.family_name}`,
      idir_username: decodedToken.idir_username,
    };
    return {
      activeAccount: activeAccount,
    };
  }

  async refreshToken(refresh_token: string): Promise<TokenObject> {
    const url = `${this.keycloak_base_url}/auth/realms/${this.realm}/protocol/openid-connect/token`;
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refresh_token);
    params.append('client_id', this.client_id);
    params.append('client_secret', this.secret);

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    return axios
      .post(url, params, config)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log('Response:');
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log('Request:');
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log('Error config:');
        console.log(error.config);
        console.log(error);
      });
  }
}
