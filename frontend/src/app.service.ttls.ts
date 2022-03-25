import { Injectable, HttpService } from '@nestjs/common'
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HttpConsumingService {
  private readonly DATA_URL = 'https://i1api.nrs.gov.bc.ca/ttls-api/v1/dispositionTrans/info/932644';
  constructor(private readonly http: HttpService) {}

  callHttp(): Observable<Array<Object>> {
    return this.http.get(this.DATA_URL, { headers: {"Authorization" : `Bearer DB0D643D8712658CE0533954228ED5EC`}}).pipe(
      map((axiosResponse: AxiosResponse) => {
        return axiosResponse.data;
      })
    );
  }
}