import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddUserService } from '../add-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ValidationService } from 'src/app/components/validation-message/validation.service';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { LookupService } from 'src/app/services/util/lookup.service';
import { UserDataService } from 'src/app/services/util/user-data.service';

@Component({
  selector: 'app-view-clinic-users',
  templateUrl: './view-clinic-users.component.html',
  styleUrls: ['./view-clinic-users.component.scss']
})
export class ViewClinicUsersComponent implements OnInit {

  public flatTabs: any[];
  addUserForm: FormGroup;
  editId: string;
  RWFlag: boolean;
  userInfo: any = {};
  menuId: any;
  isFav: boolean = false;
  userId: any;

  constructor(
    private fb: FormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private adduserService: AddUserService,
    private tabservice: TabserviceService,
    private lookupservice: LookupService,
    private userDataService: UserDataService,
    private lookupService: LookupService) {
    this.addUserForm = this.fb.group({
      'userName': ['', [Validators.required]],
      'fullName': ['', [Validators.required]],
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      'role': [''],
      'roleType': ['', [Validators.required]],
      'status': ['', [Validators.required]],
      'userId': '',
      'roleId': ''
    })
  }

  ngOnInit(): void {
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    this.userId = this.userDataService.getUserId();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "24") {
        menuActionId = ele.menuActionId;
        this.menuId = ele.menuId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }

    this.flatTabs = [
      { tabId: 1, name: 'Associated Study', link: 'view-associated-study', property: 'associatedStudy' },
      { tabId: 2, name: 'Activities', link: 'view-activity', property: 'activity' },
    ];
    if (this.router.url.indexOf('/view-clinic-users') > -1) {
      console.log("this.router.url", this.router.url);
      let str = this.router.url;
      let id = str.split("view-clinic-users/")[1].split("/")[0]
      // this.editFlag = true;
      this.editId = id;
      this.spinner.show();
      this.adduserService.getUserById(`/api/users/${id}`, '').subscribe(res => {
        console.log("res", res);
        let user = res.response.user;
        this.userInfo = res.response.user;
        this.addUserForm.patchValue({
          'userName': user.userName ? user.userName : '',
          'fullName': user.fullName ? user.fullName : '',
          'email': user.email ? user.email : '',
          'role': user.roleName ? user.roleName : '',
          'roleType': user.roleTypeId ? user.roleTypeId : '',
          'status': user.isActive == true ? 'Active' : 'Inactive',
          'userId': user.userId ? user.userId : '',
          'roleId': user.roleIds ? user.roleIds : ''
        });
        this.flatTabs.forEach(flat => {
          if (flat.property == 'associatedStudy') {
            flat['associatedStudy'] = user.associatedStudies ? user.associatedStudies : '';
          }
          if (flat.property == 'activity') {
            flat['activity'] = user.auditLogs ? user.auditLogs : '';
          }

        })
        console.log("this.flatTabs", this.flatTabs);

        this.spinner.hide();
      },
        err => {
          this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
          this.spinner.hide();
        }
      );
    }
    this.checkFav();
  }

  public activateTab(activeTab) {
    this.flatTabs.forEach(flatTag => {
      if (flatTag.tabId == activeTab.tabId) {
        flatTag.active = true;
      } else {
        flatTag.active = false;
      }
    });
  }
  addNewUser() {
    this.tabservice.clearDataModel();
    this.router.navigate(['/user/clinical-user/add-new-user']);
  }

  onSubmit($event) {

  }
  editUser() {
    this.tabservice.clearDataModel();
    //commented for enhancement
    console.log("addUserForm.value.roleId", this.addUserForm.value.roleId)

    if (this.editId == this.userId) {
      if (this.addUserForm.value.roleType == 1) {
        this.router.navigate([`/user/clinical-user/edit-user/${this.editId}/add-user-details`]);
      }
      else {
        this.toastr.error("User should have admin as a role type to edit their own record.");
      }
    }
    else {
      this.router.navigate([`/user/clinical-user/edit-user/${this.editId}/add-user-details`]);
    }

    // if (this.editId != this.userId) {
    //   this.router.navigate([`/user/clinical-user/edit-user/${this.editId}/add-user-details`]);
    // } else {
    //   this.toastr.error("Current user cannot edit their own record");
    // }
  }
  resetPasswordUser() {
    this.tabservice.clearDataModel();
    this.adduserService.resetPassword(`/api/users/forgotPassword?userName=${this.addUserForm.value.email}&modifiedBy=${this.userId}`).subscribe(res => {
      if (res.status.success === true) {
        this.toastr.success('New Password has been sent to the registered email account. Please check.');
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
    });
  }
  checkFav() {
    //check favorite
    this.lookupService.getFavInfo(`/api/favourites/isFavourite/${this.menuId}/${this.editId}`).subscribe(res => {
      if (res.response.favourite.isFavourite)
        this.isFav = true;
    });
  }
  makeFav() {
    this.spinner.show();
    this.lookupService.addasFav(`/api/favourites/${this.menuId}/${this.editId}`, {}).subscribe(res => {
      if (res.status.success === true) {
        this.isFav = true;
        this.toastr.success('Added to Favorites');
        this.spinner.hide();
      }
      else {
        this.toastr.error(res.errors[0].message);
        this.spinner.hide();
      }
    },
      err => {
        this.errorMsg(err);
      }
    );
  }

  removeFav() {
    this.spinner.show();
    this.lookupService.removeFav(`/api/favourites/${this.menuId}/${this.editId}`, {}).subscribe(res => {
      if (res.status.success === true) {
        this.isFav = false;
        this.toastr.success('Removed from Favorites');
        this.spinner.hide();
      }
      else {
        this.toastr.error(res.errors[0].message);
        this.spinner.hide();
      }
    },
      err => {
        this.errorMsg(err);
      }
    );
  }
  errorMsg(err) {
    if (err.status == 500) {
      this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
    }
    else {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    }
  }

}
