import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/util/base.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClinicalNotificationService extends BaseService {
  private externalPrelude: any;
  private externalPreludeDataOservable = new BehaviorSubject<any>(this.externalPrelude);
  public externalPrelude$ = this.externalPreludeDataOservable.asObservable();

  public getMobileConData(url: string,data:any): Observable<any> {
    return this.get(url, data);
  }

  async setModelData(data) {
    this.externalPreludeDataOservable.next(data);
  }

  getModelData() {
    return this.externalPrelude;
  }
  

  public addStudy(url:string, data:any): Observable<any> {
    return this.post(url, data);
  }

  public getStudy(url: string,data:any): Observable<any> {
    return this.get(url, data);
  }

  public getAssociatedPets(url: string,data:any): Observable<any> {
    return this.get(url, data);
  }

  public deleteStudy(url:string, data:any): Observable<any> {
    return this.delete(url, data);
  }
  public updateStudy(url:string, data:any): Observable<any> {
    return this.put(url, data);
  }
  public updateStudyNotification(url:string, data:any): Observable<any> {
    return this.put(url, data);
  }
  
}
