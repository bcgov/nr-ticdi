import { Injectable } from '@nestjs/common'
import {HttpService} from '@nestjs/axios'
import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { URLSearchParams } from 'url';
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class HttpConsumingService {
  
  constructor(private readonly http: HttpService) {}

  private id : String;
  private jsonDataFile: {}

  setId(id: String) {
    this.id = id;
  }

  setJSONDataFile(jsonDataFile: {}) {
    this.jsonDataFile = jsonDataFile;
  }

  callHttp(): Observable<Array<Object>> {
    let url = 'https://i1api.nrs.gov.bc.ca/ttls-api/v1/dispositionTrans/info/' + this.id;
    console.log(url);
    return this.http.get(url, { headers: {"Authorization" : `Bearer DB209A1605D5488BE0533954228E4942`}}).pipe(
      map((axiosResponse: AxiosResponse) => {
        return axiosResponse.data;
      })
    );
  }

  callGetToken(): Promise<Object> {
    let url = 'https://dev.oidc.gov.bc.ca/auth/realms/jbd6rnxw/protocol/openid-connect/token';
    let service_client_id = 'MALS_SERVICE_CLIENT';
    let service_client_secret = '8b15adbd-2ab7-4e24-9d0f-3efccf738225'

    const token = `${service_client_id}:${service_client_secret}`;
    const encodedToken = Buffer.from(token).toString('base64');
    let config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization' : 'Basic '+encodedToken
      }
    };

    const grantTypeParam = new URLSearchParams();
    grantTypeParam.append('grant_type','client_credentials');

    return axios.post(url, grantTypeParam,  config).then(response => {return response.data.access_token})
    .catch(error => {
        console.log(error.response)
    });
  }

  async generateReport() {

    let cdogsToken = await this.callGetToken();

    const buffer = fs.readFileSync(path.resolve(__dirname, './public/' + 'LUR_Template.docx'))

    const bufferBase64 = await Buffer.from(buffer).toString('base64');
    


  var data = JSON.stringify({
    "data": this.jsonDataFile,
    "formatters": "{\"myFormatter\":\"_function_myFormatter|function(data) { return data.slice(1); }\",\"myOtherFormatter\":\"_function_myOtherFormatter|function(data) {return data.slice(2);}\"}",
    "options": {
      "cacheReport": true,
      "convertTo": "pdf",
      "overwrite": true,
      "reportName": "{d.firstName}-{d.lastName}.pdf"
    },
    "template": {
      "encodingType": "base64",
      "fileType": "docx",
      "content": bufferBase64
    }
  });

  let config = {
    method: 'post',
    url: 'https://cdogs-dev.apps.silver.devops.gov.bc.ca/api/v2/template/render',
    responseType: 'arraybuffer',
    headers: { 
      'Authorization': 'Bearer ' + cdogsToken, 
      'Content-Type': 'application/json'
    },
    data : data
  };
  const axios = require('axios');
  return axios(config).then(response => {console.log('Generated File'); return response.data})
  .catch(error => {
      console.log(error.response)
  });
  
}}