import { Injectable } from '@angular/core';
import { BaseService } from '../services/util/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetParentService extends BaseService {

  public getPetParentService(url: string): Observable<any> {
    return this.get(url);
  }
  public addPetParentService(url: string, data: any): Observable<any> {
    return this.post(url, data);
  }
  public updatePetParentService(url: string, data: any): Observable<any> {
    return this.put(url, data);
  }
  public deletePetParent(url: string, data: any): Observable<any> {
    return this.delete(url, data);
  }

}