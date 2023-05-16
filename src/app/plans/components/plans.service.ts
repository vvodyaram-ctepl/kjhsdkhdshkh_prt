import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/util/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlansService extends BaseService {

  public getPlanService(url: string): Observable<any> {
    return this.get(url);
  }

  public addPlanService(url: string, data: any): Observable<any> {
    return this.post(url, data);
  }
  public deleteStudyName(url: string, data: any): Observable<any> {
    return this.put(url, data);
  }
  public updatePlanService(url: string, data: any): Observable<any> {
    return this.put(url, data);
  }
  public deletePlan(url: string, data: any): Observable<any> {
    return this.delete(url, data);
  }

}




