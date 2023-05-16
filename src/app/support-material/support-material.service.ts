import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/util/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SupportMaterialService extends BaseService {

  
  public getSupportService(url: string): Observable<any> {
    return this.get(url);
  }

  public addSupportService(url: string, data: any): Observable<any> {
    return this.post(url, data);
  }

  public updateSupport(url: string, data: any): Observable<any> {
    return this.put(url, data);
  }

  public deleteSupport(url: string, data: any): Observable<any> {
    return this.delete(url, data);
  }
  public getCategoryList(url): Observable<any> {
    return this.get(url);
  }

}
