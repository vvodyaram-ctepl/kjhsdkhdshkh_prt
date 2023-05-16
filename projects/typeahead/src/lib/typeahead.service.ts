import { Injectable } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
import { environment } from '../../../../src/environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Http, Headers, RequestOptions } from '@angular/http';
// import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';
import { tap, map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TypeaheadService {
  public API_ENDPOINT = environment.baseUrl;
  constructor(private http: HttpClient) { }

  get(apiPath) {
    let headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'access-control-allow-origin' : '*',
      'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
    });
    let url = (apiPath.indexOf("http://") != -1) ? apiPath : this.API_ENDPOINT + apiPath;
    return this.http.get(url, { headers: headers }).pipe(
      tap(this.extractData),catchError(error => {
        return of([]);
      }));
  }

  private extractData(res: any) {
    try {
      let body: any = res.json();
      return body || {};
    } catch (e) {
      return res._body;
    }
  }

  search(term: string, url: string) {

    if (term === '') {
      return of([]);
    }

    if (url.indexOf("?") >= 0) {
      url = url + "&query=" + encodeURIComponent(term);
    } else {
      url = url + "?query=" + encodeURIComponent(term);
    }

    return this.get(url)
      .pipe(map(response => Array.isArray(response) ? response : [response]));
  }

  offlineSearchURL(term: string, url: string, matcher: any, queryParamValue) {
    let paramValue = '';
    if (queryParamValue) {
      paramValue = queryParamValue;
    } else {
      paramValue = term;
    }
    if (paramValue === '') {
      return of([]);
    }
    if (url.indexOf("?") >= 0) {
      url = url + "&query=" + encodeURIComponent(paramValue);
    } else {
      url = url + "?query=" + encodeURIComponent(paramValue);
    }
    return this.get(url)
      .pipe(map(response => {
        let result: any = [];
        result = Array.isArray(response) ? response : [response];
        if (!matcher) {
          matcher = '';
        }
        result = (term === '' || term === ' ') ? result
        : result.filter(v => v[matcher].toString().search(new RegExp(term, 'i')) > -1).slice(0, 10);
        return result;
      }));
  }
}
