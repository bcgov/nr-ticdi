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

  setId(id: String) {
    this.id = id;
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

    return axios.post(url, grantTypeParam,  config).then(response => {console.log(response); return response.data.access_token})
    .catch(error => {
        console.log(error.response)
    });
  }

  async generateReport(): Promise<Object> {

    let cdogsToken = await this.callGetToken();

    let url = 'https://cdogs-dev.apps.silver.devops.gov.bc.ca/api/v2/template/render';
    console.log(url);

    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +cdogsToken
      }
    };
    // const formatters = {"myFormatter":"_function_myFormatter|function(data) { return data.slice(1); }","myOtherFormatter":"_function_myOtherFormatter|function(data) {return data.slice(2);}"};
    

    const buffer = fs.readFileSync(path.resolve(__dirname, './public/' + 'LUR_Template.docx'), 'utf8')

    const bufferBase64 = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5Rm5UcVlVRkxnbTFIbTJIOThnWEJhWnpPcXBnMFlWU1NvNHBESlVuNXZ3In0.eyJleHAiOjE2NDgzNTU2NzMsImlhdCI6MTY0ODM1NTM3MywianRpIjoiNmJlZTE5OTMtMGFhMC00YzBmLWIzNDctM2Q1ZTI1MDA2MTMyIiwiaXNzIjoiaHR0cHM6Ly9kZXYub2lkYy5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvamJkNnJueHciLCJhdWQiOlsiQ0RPR1MiLCJDSEVTIl0sInN1YiI6ImEwODMzMDYxLTkzZTQtNDVkMi1hYzE3LWIxMzI0NDdiYjRiNCIsInR5cCI6IkJlYXJlciIsImF6cCI6Ik1BTFNfU0VSVklDRV9DTElFTlQiLCJhY3IiOiIxIiwicmVzb3VyY2VfYWNjZXNzIjp7IkNET0dTIjp7InJvbGVzIjpbIkdFTkVSQVRPUiIsInVtYV9wcm90ZWN0aW9uIl19LCJDSEVTIjp7InJvbGVzIjpbIkVNQUlMRVIiLCJ1bWFfcHJvdGVjdGlvbiJdfSwiTUFMU19TRVJWSUNFX0NMSUVOVCI6eyJyb2xlcyI6WyJ1bWFfcHJvdGVjdGlvbiIsIkNPTU1PTl9TRVJWSUNFUyJdfX0sInNjb3BlIjoiIiwiY2xpZW50SWQiOiJNQUxTX1NFUlZJQ0VfQ0xJRU5UIiwiY2xpZW50SG9zdCI6Ijc1LjE1NC4yNDAuMTkzIiwiY2xpZW50QWRkcmVzcyI6Ijc1LjE1NC4yNDAuMTkzIn0.EpPGEbT8YriVzHARdkD6BwvVq6t5CgtQ_N7-_df4k4pHWrXmhtzCNVY38UketBk2ONrPSuOGHWdmnRfRgY0hF-4CeLttoj5H8Rto-B6667_NGdVWfGglkI8msnnAsDXG0Jj21cLDIvnpCGnQexFfHF6NicwiE06907s4TnlXb_cwrBqEU1u5UkrDgqK7AZUu_6j__HUj8XA3DC1l4x8zcofV4p4rnMEgLncLfaet0_A6lqGeS2V0LoR-6raWQWdqYrkXTxz98t7wuaOYKyPfduwUDw_7LvoeboQVzzauoj7znON5Q4TV4NF2MI9z_MUDaL1QXmOCSW2yb_ITuOC3-Q'//Buffer.from(buffer).toString('base64');

    const jsonBody = {
      "firstName": "Jane",
      "lastName": "Smith",
      "title": "CEO"
  };
    
    const options = {
      reportName: 'test.pdf',
      convertTo: 'pdf',
      overwrite: true      
    };

    const template = {
      content: ''+bufferBase64,
      encodingType: 'base64',
      fileType: 'docx'      
    };

    


    const bodyParameters = {
      data: jsonBody,
      options: options,
      template: template    
   };

    return axios.post(url, bodyParameters,config)
    .then(response => {console.log("blablabla2");return response.data})
    .catch(error => {
      console.log("blablabla");
        console.log(error)
    });
  }
  
}