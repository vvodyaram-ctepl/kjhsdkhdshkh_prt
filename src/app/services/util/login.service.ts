import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { UserDataService } from './user-data.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends BaseService {

  constructor(
    http: HttpClient,
    private router: Router,
    private userDataService: UserDataService,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService
  ) {
    super(http);
  }

  public userAuthentication(url: string, data): Observable<any> {
    return this.post(url, data);
  }

  public refreshToken(url: string, data): Observable<any> {
    return this.post(url, data);
  }

  public userLogOut() {
    this.spinnerService.show();
    this.post(`/api/users/logout?userId=${this.userDataService.getUserId()}`, {}).subscribe(res => {
      if (res.status.success === true) {
        this.router.navigate(['/']);
        this.userDataService.unsetUserData();
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinnerService.hide();
    }, err => {
      this.spinnerService.hide();
      if (err.status == 400) {
        this.userDataService.unsetUserData();
        this.router.navigate(['/']);
        return;
      }
      this.toastr.error(err.error?.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
    });
  }
  public forgotPwd(url: string): Observable<any> {
    return this.put(url, {});
  }
  public updatePassword(url: string, data): Observable<any> {
    return this.put(url, data);
  }

  public getUserDetails(url: string): Observable<any> {
    return this.get(url);
  }
}
