import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request & { session? } = context.switchToHttp().getRequest();

    if (request.session.data && request.session.data.activeAccount && request.session.data.activeAccount.client_roles) {
      for (let entry of request.session.data.activeAccount.client_roles) {
        if (entry == 'ticdi_admin') {
          return true;
        }
      }
      throw new ForbiddenException('No admin privileges were found.');
    }
  }
}
