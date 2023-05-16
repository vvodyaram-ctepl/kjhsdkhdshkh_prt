import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/util/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PointTrackerService extends BaseService {

  public addPromotion(url:string, data:any): Observable<any> {
    return this.post(url, data);
  }
  public getPointById(url: string,data:any): Observable<any> {
    return this.get(url, data);
  }
  public updatePromotion(url: string,data:any): Observable<any> {
    return this.put(url, data);
  }
}
