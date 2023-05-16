import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../services/util/base.service';

@Injectable({
  providedIn: 'root'
})
export class QuesResponseService extends BaseService {

  public getQuestionnaireView(url: string): Observable<any> {
    return this.get(url);
  }

}
