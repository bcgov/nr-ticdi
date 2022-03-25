import { Injectable, HttpService } from '@nestjs/common'
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
    return this.http.get(url, { headers: {"Authorization" : `Bearer DB0D643D8712658CE0533954228ED5EC`}}).pipe(
      map((axiosResponse: AxiosResponse) => {
        return axiosResponse.data;
      })
    );
  }
}