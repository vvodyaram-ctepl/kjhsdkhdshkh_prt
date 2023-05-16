import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/util/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetService extends BaseService {

  public getPet(url: string,data:any): Observable<any> {
    return this.get(url, data);
  }

  public addPet(url:string, data:any): Observable<any> {
    return this.post(url, data);
  }
  public deletePet(url:string, data:any): Observable<any> {
    return this.delete(url, data);
  }
  public updatePet(url:string, data:any): Observable<any> {
    return this.put(url, data);
  }
  public updatePetWeight(url:string, data:any): Observable<any> {
    return this.put(url, data);
  }
  public bulkUpload(url: string, data: any): Observable<any> {
    return this.post(url, data);
  }

  public getPetsCount(url: string,data:any): Observable<any> {
    return this.get(url, data);
  }

 public redeem(url: string,data:any): Observable<any> {
    return this.put(url, data);
  }
  public getViewBCScoreHistory(petId,fromDate, toDate) {
    return this.get(`/api/pets/weightHistory/${petId}?fromDate=${fromDate}&toDate=${toDate}`);
  }

  // GET /pets/getPetFeedingEnthusiasmScaleDtls
  public getPetEating(petId,enthusiasmScaleId, feedingTimeId,searchText) {
    return this.get(`/api/pets/getPetFeedingEnthusiasmScaleDtls?petId=${petId}&enthusiasmScaleId=${enthusiasmScaleId}&feedingTimeId=${feedingTimeId}&searchText=${searchText}&sortBy=&order=DESC`);
  }

}
