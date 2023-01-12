import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class GenerateReportGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request & { session? } = context.switchToHttp().getRequest();

    if (request.session.data && request.session.data.activeAccount) {
      // if (request.session.data.activeAccount.client_roles) {
      // for (let entry of request.session.data.activeAccount.client_roles) {
      //   if (entry == "generate_documents") {
      //     return true;
      //   }
      // }
      // throw new ForbiddenException("Document generation privileges not found.");
      // } else {
      return true;
      // }
    }
  }
}
