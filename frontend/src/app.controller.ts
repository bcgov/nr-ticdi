/* eslint-disable no-useless-constructor */
import { Controller, Get, Param, Render, HttpService } from '@nestjs/common'
import { AppService } from './app.service'
import { HttpConsumingService } from './app.service.ttls'
import { Request } from 'express';
import { AxiosResponse } from 'axios'
import { map, Observable } from 'rxjs'


@Controller()
export class AppController {
  constructor (private readonly appService: AppService, private readonly http: HttpConsumingService) {}

  @Get()
  getHello (): string {
    return this.appService.getHello()
  }
  
  @Get('dtid/:id/:docname')
  @Render('index')
  async findOne(@Param('id') id, @Param('docname') docname :string) {
    console.log(id);

    var user = {}

    await this.http.callHttp().toPromise().then(resp => {
      user = resp;
    })
    console.log(user);

    return { message: user };
  }
 

}
