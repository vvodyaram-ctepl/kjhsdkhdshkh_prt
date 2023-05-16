import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/util/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PushNotificationService extends BaseService {

  public getPush(url: string): Observable<any> {
    return this.get(url);
  }

  public addPush(url: string, data: any): Observable<any> {
    return this.post(url, data);
  }
  public deletePush(url: string, data: any): Observable<any> {
    return this.delete(url, data);
  }
  public updatePush(url: string, data: any): Observable<any> {
    return this.put(url, data);
  }

}
