/* eslint-disable no-useless-constructor */
import { Controller, Get, Param, Render,StreamableFile, Header  } from '@nestjs/common'
import {HttpService} from '@nestjs/axios'
import { AppService } from './app.service'
import { HttpConsumingService } from './app.service.ttls'
import { Request } from 'express';
import { Response } from 'express';
import { AxiosResponse } from 'axios'
import { map, Observable } from 'rxjs'
import { createReadStream, ReadStream } from 'fs';



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
    this.http.setId(id);
    await this.http.callHttp().toPromise().then(resp => {
      user = resp;
    })
    console.log(user);

    return { message: user };
  }

  @Get('test')
  async getCDogsToken() {
    
    var cdogsToken;

    await this.http.callGetToken().then(resp => {
      cdogsToken = resp;
    })
    console.log('Test1');
    console.log(cdogsToken);
    console.log('Test2');
  }

  @Get('generateReport')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=test.pdf')
  async generateReport() {

    let t = await this.http.generateReport();
    return new StreamableFile(t);
  }
 

}
