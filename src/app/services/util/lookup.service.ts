import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LookupService extends BaseService {

  public getRole(url: string): Observable<any> {
    return this.get(url);
  }
  public getRoleTypes(url: string): Observable<any> {
    return this.get(url);
  }
  public getTrackerActivity(url: string): Observable<any> {
    return this.get(url);
  }
  public getDeviceModel(url: string): Observable<any> {
    return this.get(url);
  }
  public getPlans(url: string): Observable<any> {
    return this.get(url);
  }
  public getFeedbackpageList(url: string): Observable<any> {
    return this.get(url);
  }
  public addasFav(url: string, data: any): Observable<any> {
    return this.post(url, data);
  }
  public removeFav(url: string, data: any): Observable<any> {
    return this.put(url, data);
  }
  public getFavInfo(url: string): Observable<any> {
    return this.get(url);
  }
  public getAuditLog(url: string): Observable<any> {
    return this.get(url);
  }
  public getPointTrackerActivities(url: string): Observable<any> {
    return this.get(url);
  }
  public getBehavior(url: string): Observable<any> {
    return this.get(url);
  }

  public getPredefinedInstructions(url: string): Observable<any> {
    return this.get(url);
  }

  public getPredefinedQuestions(url: string): Observable<any> {
    return this.get(url);
  }

  public getQuestionType(url: string): Observable<any> {
    return this.get(url);
  }
  public getCommon(url: string): Observable<any> {
    return this.get(url);
  }

  public checkUserAssociatedStudy(url: string): Observable<any> {
    return this.get(url);
  }

  public deleteSupport(url: string): Observable<any> {
    return this.delete(url, '');
  }

}
