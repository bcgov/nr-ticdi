/* eslint-disable no-useless-constructor */
import { Controller, Get, Param } from '@nestjs/common'
import { AppService } from './app.service'
import { Request } from 'express';


@Controller()
export class AppController {
  constructor (private readonly appService: AppService) {}

  @Get()
  getHello (): string {
    return this.appService.getHello()
  }


  @Get('dtid/:id/:docname')
  findOne(@Param('id') id, @Param('docname') docname :string): string {
    console.log(id);
    return `Received dtid  #${id} and document name ${docname} `;
  }

}
