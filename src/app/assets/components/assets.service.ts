
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/util/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AssetsService extends BaseService {

  public getAssetsService(url: string): Observable<any> {
    return this.get(url);
  }

  public addRecord(url: string, data: any): Observable<any> {
    return this.post(url, data);
  }

  public updateRecord(url: string, data: any): Observable<any> {
    return this.put(url, data);
  }

  public deleteRecord(url: string, data: any): Observable<any> {
    return this.delete(url, data);
  }

  public bulkUpload(url: string, data: any): Observable<any> {
    return this.post(url, data);
  }
  public saveBulkUploadRecords(url: string, data: any): Observable<any> {
    return this.post(url, data);
  }
  public downloadExcel(url: string): Observable<any> {
    return this.get(url, { responseType: 'blob' });
  }
  public getFirmwareList(url: string, data: any): Observable<any> {
    return this.get(url, data);
  }
}
