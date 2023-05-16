import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable()
export class BaseService {
    public baseUrl = environment.baseUrl;

    constructor(private http:HttpClient){ }

    get(url, data?): Observable<any> {
        let apiPath = (url.indexOf("http://") != -1) ? url : this.baseUrl + url;
        return this.http.get(apiPath, data).pipe(catchError(this.handleError()));
    }

    post(url, data): Observable<any> {
        let apiPath = (url.indexOf("http://") != -1) ? url : this.baseUrl + url;
        return this.http.post(apiPath, data).pipe(catchError(this.handleError()));
    }

    put(url, data){
        return this.http.put(this.baseUrl + url, data).pipe(catchError(this.handleError()));
    }

    delete(url, id){
        return this.http.delete(this.baseUrl + url, id).pipe(catchError(this.handleError()));
    }

    patch(url, id?){
        return this.http.patch(this.baseUrl + url, id).pipe(catchError(this.handleError()));
    }

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            return throwError(error);
        };
    }
}