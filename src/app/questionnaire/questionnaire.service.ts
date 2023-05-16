import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../services/util/base.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService extends BaseService {

  public addQuestionnaire(url: string, data: any): Observable<any> {
    return this.post(url, data);
  }

  public updateQuestionnaire(url: string, data: any): Observable<any> {
    return this.put(url, data);
  }

  public getQuestionnaireById(url: string): Observable<any> {
    return this.get(url);
  }

  public deleteQuestionnaire(url: string, data: any): Observable<any> {
    return this.delete(url, data);
  }
}
