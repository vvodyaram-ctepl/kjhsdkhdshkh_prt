import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/util/base.service';

@Injectable({
  providedIn: 'root'
})
export class AddUserService extends BaseService {

  public addUser(url:string, data:any): Observable<any> {
    return this.post(url, data);
  }
  public getUserById(url: string, data:any): Observable<any> {
    return this.get(url, data);
  }
  public getStudy(url: string, data:any): Observable<any> {
    return this.get(url, data);
  }
  public updateUser(url:string, data:any): Observable<any> {
    return this.put(url, data);
  }
  public deleteUser(url:string, data:any): Observable<any> {
    return this.delete(url, data);
  }
  public resetPassword(url:string): Observable<any> {
    return this.put(url, {});
  }
}
