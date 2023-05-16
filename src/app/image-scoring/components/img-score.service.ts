import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/util/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImgScoreService extends BaseService {

  public getImgScore(url: string): Observable<any> {
    return this.get(url);
  }

  public addImgScore(url: string, data: any): Observable<any> {
    return this.post(url, data);
  }
  public deleteImgScore(url: string, data: any): Observable<any> {
    return this.delete(url, data);
  }
  public updateImgScore(url: string, data: any): Observable<any> {
    return this.put(url, data);
  }

  public bulkUpload(url: string, data: any): Observable<any> {
    return this.post(url, data);
  }

}




