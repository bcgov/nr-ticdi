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

    var ttlsJSON = {}
    this.http.setId(id);
    //await this.http.callHttp().toPromise().then(resp => {
      //ttlsJSON = resp;

      ttlsJSON = {
        "dtid": 921711,
        "FileNum": "7409801",
        "OrganizationUnit": "OM - LAND MGMNT - NORTHERN SERVICE REGION",
        "complexLevel": "2",
        "Purpose": "QUARRYING",
        "SubPurpose": "SAND AND GRAVEL",
        "TenureSubType": "LICENCE OF OCCUPATION",
        "TenureType": "LICENCE",
        "bcgsSheet": "93J088",
        "airPhotoNum": null,
        "TenureArea": 30,
        "Location": "1km down Crocker FSR",
        "LegalDescription": "UNSURVEYED CROWN LAND IN THE VICINITY OF ANZAC RIVER AND COLBOURNE ROAD, CARIBOO DISTRICT.",
        "tenantAddr": "{\"firstName\":null,\"middleName\":null,\"lastName\":null,\"legalName\":\"728928 BC LTD\",\"locationSid\":1,\"ipSid\":223001,\"addrSid\":1,\"addrLine1\":\"333 HIGHPOINTE CRT\",\"postalCode\":\"V1V2Y3\",\"city\":\"KELOWNA\",\"zipCode\":null,\"addrLine2\":null,\"addrLine3\":null,\"countryCd\":\"CA\",\"regionCd\":\"BC\",\"country\":\"CANADA\",\"provAbbr\":\"BC\",\"stateAbbr\":null,\"addrType\":\"MAILING\"}"
    };

      this.http.setJSONDataFile(ttlsJSON);
    //})
    console.log(ttlsJSON);

    return { message: ttlsJSON };
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
