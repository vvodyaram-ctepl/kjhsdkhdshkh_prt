import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabserviceService {

  // private valueObs: BehaviorSubject < string > = new BehaviorSubject < string > (null);
   
  //   public setValue(value: string): void {
  //     this.valueObs.next(value);
  // }

  // public getValue(): Observable < string > {
  //     return this.valueObs;
  // }

  private dataModel!: any;
  private dataModelOservable = new BehaviorSubject<any>(this.dataModel);
  public dataModel$ = this.dataModelOservable.asObservable();

  private dataModel2!: any;
  private dataModelOservable2 = new BehaviorSubject<any>(this.dataModel2);
  public dataModel2$ = this.dataModelOservable.asObservable();

  constructor() { }

async setModelData(data, key) {
  let obj: any = this.dataModel || {};
  obj[key] = data;
  this.dataModel = obj;
  this.dataModelOservable.next(this.dataModel);
}

getModelData() {
  return this.dataModel;
}

async setModelData2(data) {
  let obj: any = this.dataModel2 || {};
  obj = data;
  this.dataModel2 = obj;
  this.dataModelOservable2.next(obj);
}

getModelData2() {
  return this.dataModel2;
}

removeModel(key) {
  let obj: any = this.dataModel || {};
  delete obj[key];
}

clearDataModel() {
  this.dataModelOservable.next('');
  this.dataModel = '';
}

}
