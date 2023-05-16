import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../services/util/base.service';

@Injectable({
  providedIn: 'root'
})
export class MobileAppService extends BaseService {

  public assignStudy(url:string, data:any): Observable<any> {
    return this.post(url, data);
  }
}
