import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/util/login.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    // this.userDataService.unsetUserData();
    this.forgotPasswordForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  forgotPassword() {
    this.spinner.show();
    this.loginService.forgotPwd(`/api/users/forgotPassword?userName=${this.forgotPasswordForm.value.username}`).subscribe(res => {
      if (res.status.success === true) {
        this.toastr.success('New Password has been sent to your registered email account. Please check.');
        this.router.navigate(['/auth/login']);
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
    });
  }
}
