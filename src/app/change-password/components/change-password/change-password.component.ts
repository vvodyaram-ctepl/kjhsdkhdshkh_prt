import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/util/login.service';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { ValidationService } from 'src/app/components/validation-message/validation.service';
import { PasswordMatch } from 'src/app/validators/password.match';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  updateForm: FormGroup;
  userForm: FormGroup;
  showChangePwdDiv: boolean = false;

  showCurrentPassword:boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword:boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService,
    private userDataService: UserDataService,
    private spinner: NgxSpinnerService
  ) {
    this.updateForm = this.fb.group({
      userId: [''],
      email: [''],
      userName: [''],
      password: ['', [Validators.required]],
      newPassword: ['', [Validators.required, ValidationService.passwordValidator]],
      confirmPassword: ['', [Validators.required, ValidationService.passwordValidator]]
    }, { validator: PasswordMatch.MatchPassword });

    this.userForm = this.fb.group({
      userName: [''],
      fullName: [''],
      Email: [''],
      Role: ['']
    });

  }

  ngOnInit() {

    let data = this.userDataService.getUserId();
    this.updateForm.patchValue({ userId: data });
    let userProfileData = this.userDataService.getUserDetails();
    console.log("userProfileData", userProfileData);
    // console.log(data);
    this.updateForm.patchValue({
      email: userProfileData.email,
      userName: userProfileData.userName
    });
    // this.userDataService.userData.subscribe(data => {
    //   console.log(data);
    //   let userData = data;
    //   this.updateForm.patchValue({ userId: userData.userId });
    // });

    this.getUserDetails();

  }
  getUserDetails() {
    this.spinner.show();
    this.loginService.getUserDetails('/api/users/getUserDetails/' + this.userDataService.getUserId()).subscribe(res => {
      if (res.status.success === true) {

        this.userForm.patchValue({
          userName: res.response.userName, fullName: res.response.fullName,
          Email: res.response.email, Role: res.response.roleName
        });

        this.userForm.controls['userName'].disable();
        this.userForm.controls['Email'].disable();
        this.userForm.controls['Role'].disable();

      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
      this.spinner.hide();
    });
  }
  update() {
    this.updateForm.markAllAsTouched();
    if (this.updateForm.valid) {
      this.spinner.show();
      this.loginService.updatePassword('/api/users/updatePassword', this.updateForm.value).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success(res.response.message);
          this.getUserDetails();
          this.router.navigate(['/user/dashboard']);
        }
        else {
          this.toastr.error(res.errors[0].message);
        }
        this.spinner.hide();
      }, err => {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
        this.spinner.hide();
      });
    }
  }
  cancel() {
    this.router.navigate(['/user/changePassword/user-profile']);
  }
}

