import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetService extends BaseService {

  //firmware services
    public addFirmware(url:string, data:any): Observable<any> {
        return this.post(url, data);
      }
      public deleteFirmware(url:string, data:any): Observable<any> {
        return this.delete(url, data);
      }
      public updateFirmware(url:string, data:any): Observable<any> {
        return this.put(url, data);
      }
     
      public getFirmwareById(url: string, data:any): Observable<any> {
        return this.get(url, data);
      }

      public getFirmwareList(url: string, data:any): Observable<any> {
        return this.get(url, data);
      }

      public getDeviceDetails(url: string, data:any): Observable<any> {
        return this.get(url, data);
      }

      //device info services
      


}
