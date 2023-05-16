import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { UserDataService } from './user-data.service';
import { filter, take, switchMap, catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginService } from '../util/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(
    private userDataService: UserDataService,
    private loginService: LoginService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.userDataService.getToken();
    authReq = this.addTokenHeader(req, token);
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse && error.status === 401 && !authReq.url.includes('oauth/token')) {
          return this.handle401Error(authReq, next);
        }
        else {
          return throwError(error);
        }
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.refreshTokenInProgress) {
      this.refreshTokenInProgress = true;
      this.refreshTokenSubject.next(null);
      const token = this.userDataService.getRefreshToken();
      if (token) {
        this.spinner.show();
        const body = new HttpParams()
          .set('refresh_token', token)
          .set('grant_type', 'refresh_token');
        return this.loginService.refreshToken('/oauth/token', body).pipe(
          switchMap((resp: any) => {
            if (resp.access_token) {
              this.userDataService.setToken(resp.access_token, resp.refresh_token, resp.userId);
              this.userDataService.setUserData({ userId: resp.userId, userName: resp.username, firstName: resp.firstName, lastName: resp.lastName, status: resp.status });
              this.refreshTokenSubject.next(resp.access_token);
              this.refreshTokenInProgress = false;
              return <any>next.handle(this.addTokenHeader(request, resp.access_token));
            }
            this.spinner.hide();
          }),
          catchError((err) => {
            this.spinner.hide();
            this.refreshTokenExpired();
            return throwError(err);
          })
        ) as Observable<HttpEvent<any>>;
      }
      else {
        this.refreshTokenExpired();
      }
    }
    else {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((token) => next.handle(this.addTokenHeader(request, token)))
      );
    }
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    let headers: any = {};
    if (token && request.url.indexOf('oauth/token') === -1) {
      headers = {
        'Authorization': 'Bearer ' + token
      };
    }
    else {
      if (request.url.indexOf('forgotPassword') === -1)
        headers = {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(environment.clientId + ":" + environment.clientSecret)
        };
    }

    return request.clone({ headers: new HttpHeaders(headers) });
  }

  private refreshTokenExpired() {
    this.refreshTokenInProgress = false;
    this.toastr.error('Your session has expired. Please login again!');
    this.router.navigate(['/']);
    this.userDataService.unsetUserData();
    this.spinner.hide();
  }
}
