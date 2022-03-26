import { Injectable } from '@nestjs/common'
import {HttpService} from '@nestjs/axios'
import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { URLSearchParams } from 'url';

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
    console.debug(encodedToken);
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

    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer '+cdogsToken
      }
    };

    const grantTypeParam = new URLSearchParams();
    grantTypeParam.append('grant_type','client_credentials');

    return axios.post(url, grantTypeParam,  config).then(response => {console.log(response); return response.data.access_token})
    .catch(error => {
        console.log(error.response)
    });
  }
  
}