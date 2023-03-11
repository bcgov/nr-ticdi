import { ExceptionFilter, Catch, NotFoundException } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(NotFoundException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: any) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.redirect("/404");
  }
}
