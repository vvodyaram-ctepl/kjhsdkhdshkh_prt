import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../services/util/base.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService extends BaseService {

  public addReport(url: string, data: any): Observable<any> {
    return this.post(url, data);
  }

  public updateReport(url: string, data: any): Observable<any> {
    return this.put(url, data);
  }

  public getReportGroups(url: string): Observable<any> {
    return this.get(url);
  }

  public getReportsByReportGroupId(url: string): Observable<any> {
    return this.get(url);
  }

  public getReportByReportId(url: string): Observable<any> {
    return this.get(url);
  }

  public deleteReport(url: string, data: any): Observable<any> {
    return this.delete(url, data);
  }
}
