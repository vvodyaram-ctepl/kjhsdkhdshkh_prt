import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/util/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService extends BaseService {

  public getRoleDetails(url: string,data:any): Observable<any> {
    return this.get(url, data);
  }

  public addRole(url:string, data:any): Observable<any> {
    return this.post(url, data);
  }
  public deleteRole(url:string, data:any): Observable<any> {
    return this.delete(url, data);
  }
  public updateRole(url:string, data:any): Observable<any> {
    return this.put(url, data);
  }

}
