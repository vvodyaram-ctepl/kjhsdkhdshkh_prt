import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/util/login.service';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { HttpParams } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService,
    private userDataService: UserDataService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    if (this.userDataService.getUserId()) {
      this.logout();
    }
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(100)]],
      password: ['', [Validators.required]]
    });
  }

  public login(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      const body = new HttpParams()
        .set('username', this.loginForm.value.username)
        .set('password', this.loginForm.value.password)
        .set('grant_type', 'password');
      this.spinner.show();
      this.loginService.userAuthentication('/oauth/token', body).subscribe(res => {
        if (res.access_token) {
          this.userDataService.setToken(res.access_token, res.refresh_token, res.userId);
          this.userDataService.setUserData({ userId: res.userId, userName: res.username });
          this.userDataService.setUserDetails(res.userName, res.roleName, res.email, res.fullName);
          this.userDataService.setRoleDetails(res.rolePermissions);
          // firstName: res.firstName, lastName: res.lastName, status: res.status
        }
        if (res.needChangePwd) {
          this.router.navigate(['/auth/updatePassword']);
          this.spinner.hide();
        }
        else {
          this.router.navigate(['/user/dashboard']);
          this.spinner.hide();
        }
      }, err => {
        this.spinner.hide();
        console.log(err);
        this.toastr.error(err.error?.error_description || err.error?.error || 'Something went wrong. Please try after sometime or contact administrator.!');
      });
    }
  }

  public logout(): void {
    this.loginService.userLogOut();
  }

}
