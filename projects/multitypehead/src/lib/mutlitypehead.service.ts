import { Injectable } from '@angular/core'; 
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";  
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/debounceTime';
// import 'rxjs/add/operator/distinctUntilChanged';
// import 'rxjs/add/operator/do'; 
// import 'rxjs/add/operator/switchMap';
// import 'rxjs/add/operator/merge'; 
// import 'rxjs/add/operator/map';
// import 'rxjs/Rx';
import { tap, map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { environment } from 'src/environments/environment';
// import { Observable } from "rxjs/Observable";

const PARAMS = new HttpParams({
  fromObject: {
    action: 'opensearch',
    format: 'json',
    origin: '*'
  }
});

@Injectable()

export class MutlitypeheadService{
  public API_ENDPOINT = environment.baseUrl;
 
  constructor(private http: HttpClient) {
   
  }
  
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

  multiSearch(term: string, url: string) {

    if (term === '') {
      return of([]);
    }

    if (url.indexOf("?") >= 0) {
      url = url + "&query=" + term;
    } else {
      url = url + "?query=" + term;
    }
    // return this.http.get(url).pipe(map((response:any) => response.json()));
    return this.http.get(url).pipe(map(response => response));

  }
  
  
}
