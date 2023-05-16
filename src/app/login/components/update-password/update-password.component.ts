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
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {
  updateForm: FormGroup;

  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

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

  }

  ngOnInit() {

    //  let data = this.userDataService.getUserId();
    let userProfileData = this.userDataService.getUserDetails();
    console.log("userProfileData", userProfileData);
    // console.log(data);
    this.updateForm.patchValue({
      email: userProfileData.email,
      userName: userProfileData.userName
    });
    this.userDataService.userData.subscribe(data => {
      console.log(data);
      let userData = data;
      this.updateForm.patchValue({ userId: userData.userId });
    });

  }
  update() {
    this.updateForm.markAllAsTouched();
    if (this.updateForm.valid) {
      this.spinner.show();
      this.loginService.updatePassword('/api/users/updatePassword', this.updateForm.value).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success(res.response.message);
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
}
