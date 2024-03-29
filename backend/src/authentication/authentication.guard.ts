import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthenticationService } from './authentication.service';
import { Request } from 'express';
import { URL } from 'url';
import { AccountObject, TokenObject } from 'utils/types';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request & { session? } = context.switchToHttp().getRequest();
    const protocol = process.env.ticdi_environment == 'DEVELOPMENT' ? 'http://' : 'https://';
    const url = new URL(protocol + request.headers.host + request.originalUrl);
    const urlPath = url.pathname == '/' ? '' : url.pathname;
    const redirect = url.origin + urlPath;

    const code = url.searchParams.get('code') ? url.searchParams.get('code') : null;
    let token = null;
    if (request.session && request.session.data && request.session.data.access_token) {
      token = request.session.data.access_token;
    }

    let tokenStatus: string;
    let tokenObject: TokenObject;
    let tokenDetails: { activeAccount: AccountObject };

    // no session and no code
    if (code == null && token == null) {
      throw new UnauthorizedException('No code provided, redirecting.');
    }

    // this will return either 'good', 'bad', or 'expired'
    tokenStatus = await this.authenticationService.getHealthCheck(token);
    // token is either good or expired
    if (token && tokenStatus !== 'bad') {
      // token is good
      if (tokenStatus == 'good') {
        return true;
      }
      // token is expired
      else {
        // get a new one from refresh_token and then check it
        tokenObject = await this.authenticationService.refreshToken(request.session.data.refresh_token);
        tokenStatus = await this.authenticationService.getHealthCheck(tokenObject.access_token);
        if (tokenStatus == 'good') {
          // health check is good, set the session variables
          tokenDetails = await this.authenticationService.getTokenDetails(tokenObject.access_token);
          request.session.data = {
            ...tokenObject,
            activeAccount: tokenDetails.activeAccount,
          };
          return true;
        } else {
          request.session = null; // this doesn't delete the session in the database but it forces a new session to be created
          throw new UnauthorizedException('Invalid token, redirecting');
        }
      }
    }
    // token is either bad or non-existent, code is present
    else {
      // get token from code and run a health check
      tokenObject = await this.authenticationService.getToken(code, redirect);
      if (tokenObject) {
        tokenStatus = await this.authenticationService.getHealthCheck(tokenObject.access_token);
        if (tokenStatus == 'good') {
          // health check is good, set the session variables
          tokenDetails = await this.authenticationService.getTokenDetails(tokenObject.access_token);
          request.session.data = {
            ...tokenObject,
            activeAccount: tokenDetails.activeAccount,
          };
          return true;
        } else {
          // health check is bad (meaning code is bad) so redirect
          request.session = null;
          throw new UnauthorizedException('Invalid code, redirecting.');
        }
      } else {
        // Bad code so redirect
        request.session = null;
        throw new UnauthorizedException('Invalid code, redirecting.');
      }
    }
  }
}
