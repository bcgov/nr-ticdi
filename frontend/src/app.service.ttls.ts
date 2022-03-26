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
    const headersRequest = {'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization' : 'Basic e3tzZXJ2aWNlX2NsaWVudF9pZH19Ont7c2VydmljZV9jbGllbnRfc2VjcmV0fX0='};


                            const headersRequest2 = {'Content-Type': 'application/x-www-form-urlencoded',
                            'auth': {username: service_client_id,
                              password: service_client_secret}};
    const auth = {
      username: service_client_id,
      password: service_client_secret,
      grant_type: 'client_credentials'
  }
    const authHeader = {auth: {
      username: service_client_id,
      password: service_client_secret
    }};
    console.log(url);



    const data ={'url-encode' : {
      grant_type: 'client_credentials',
      client_id: service_client_id,
      client_secret: service_client_secret
    }};
    
    const headers2 = {
      
    };


/*

    let config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization' : 'Basic e3tzZXJ2aWNlX2NsaWVudF9pZH19Ont7c2VydmljZV9jbGllbnRfc2VjcmV0fX0='
      }
    };

    const grantTypeParam = new URLSearchParams();
    grantTypeParam.append('grant_type','client_credentials');

    return axios.post(url, grantTypeParam,  config).then(response => {console.log(response); return response.data})
  .catch(error => {
      console.log(error.response)
  });*/

  return axios.request({
    method: "post",
    baseURL: 'https://dev.oidc.gov.bc.ca/auth/realms/jbd6rnxw/protocol/openid-connect/token',
    auth: {
      username: service_client_id,
      password: service_client_secret
    },
    data: {
      "grant_type": "client_credentials",
      "scope": "public"    
    }
  }).then(function(res) {

    console.log(res);  
    return res.data}
  );

    
  }

  
}