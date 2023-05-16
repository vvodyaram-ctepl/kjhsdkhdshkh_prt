import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { AddUserService } from '../add-user.service';
import { ToastrService } from 'ngx-toastr';
import { RolesService } from 'src/app/roles/components/roles.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/components/alert-modal/alert.service';
import { UserDataService } from 'src/app/services/util/user-data.service';

@Component({
  selector: 'app-add-associated-study',
  templateUrl: './add-associated-study.component.html',
  styleUrls: ['./add-associated-study.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddAssociatedStudyComponent implements OnInit {

  addAssStudyForm: FormGroup;
  arr: FormArray;
  studyArr: any;
  permssionArr: any;
  editFlag: boolean;
  editId: string;
  submitFlag: boolean;
  futureStudies: boolean = false;
  inactiveStudies: boolean = false;
  roleType: any;
  hiddenUserName: any;
  hiddenEmail: any;
  hiddenFieldStatus: boolean = false;
  hiddenFullName: any;
  hiddenRoleType: any;
  hiddenRoleName: any;
  hiddenStatus: any;
  studyUniqList = [];
  hiddenUserId: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private tabservice: TabserviceService,
    private adduserservice: AddUserService,
    private roleservice: RolesService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private userService: UserDataService
  ) {
    this.addAssStudyForm = this.fb.group({
      arr: this.fb.array([this.createItem()])
    })


  }

  createItem() {
    return this.fb.group({
      clinicName: [''],
      pInv: [''],
      status: [''],
      permission: [''],
      studyList: []
    })
  }

  ngOnInit(): void {
    if (this.router.url.indexOf('/edit-user') > -1) {
      console.log("this.router.url", this.router.url);
      let str = this.router.url;
      let id = str.split("edit-user/")[1].split("/")[0]
      this.editFlag = true;
      this.editId = id;
    }
    //checking previous tab data and assigning checboxes
    let data = this.tabservice.getModelData();
    if (!data || (data && !data.addUserDetails)) {
      if (!this.editFlag)
        this.router.navigate(['/user/clinical-user/add-new-user/add-user-details']);
      else
        this.router.navigate([`/user/clinical-user/edit-user/${this.editId}/add-user-details`]);
      return;
    }
    console.log("datadatadata", data);
    data = data.addUserDetails;
    this.roleType = data.roleType;
    console.log("this.roleType", this.roleType);

    let data1 = this.tabservice.getModelData() ? this.tabservice.getModelData() : {};
    console.log("data1data1", data1);
    data1 = data1 ? (data1['Studies'] ? data1['Studies'] : '') : '';
    if (data1) {
      this.futureStudies = data1.futureStudies == 1 ? true : false;
      this.inactiveStudies = data1.inactiveStudies == 1 ? true : false;
    }

    let data2 = this.tabservice.getModelData() ? this.tabservice.getModelData() : {};
    console.log("data2data2", data2);
    data2 = data2 ? (data2['HiddenData'] ? data2['HiddenData'] : '') : '';
    if (data2) {
      this.hiddenUserName = data2.hiddenUserName;
      this.hiddenUserId = data2.hiddenUserId;
      this.hiddenEmail = data2.hiddenEmail;
      this.hiddenFullName = data2.hiddenFullName;
      this.hiddenRoleType = data2.hiddenRoleType;
      this.hiddenRoleName = data2.hiddenRoleName;
      this.hiddenStatus = data2.hiddenStatus;
    }
    //checking previous tab data and assigning checboxes
    // this.tabservice.dataModel$.subscribe(res => {

    let res = this.tabservice.getModelData() ? this.tabservice.getModelData() : {}
    console.log(res);
    console.log(res);
    res = res ? (res['addAssStudy'] ? res['addAssStudy'] : '') : '';
    console.log("resres", res.arr);
    let rest = res ? res.arr : '';
    if (rest) {
      console.log("restrest in addassoo", rest, this.studyArr);
      rest.forEach((ele, i) => {
        this.addAssStudyForm.controls.arr['controls'][i].patchValue({
          clinicName: { "studyId": ele.clinicName ? ele.clinicName.studyId : '', "studyName": ele.clinicName ? ele.clinicName.studyName : '' },
          pInv: ele.pInv ? ele.pInv : '',
          status: ele.status ? ele.status : '',
          //     permission: ele.permission ? ele.permission : '',
          studyList: this.studyArr
        });

        if (i < (rest.length - 1)) {
          console.log(i, rest.length - 1)
          this.addItem();

        }
      });
    }

    // });

    this.spinner.show();
    this.adduserservice.getStudy('/api/study/getStudyList', '').subscribe(res => {
      console.log("res", res);

      this.studyArr = res.response.studyList;
      this.addAssStudyForm.controls.arr['controls'].forEach((element, i) => {
        this.addAssStudyForm.controls.arr['controls'][i].patchValue({
          studyList: this.studyArr
        });
      });

      this.spinner.hide();
    },
      err => {
        this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
      }
    );

    this.roleservice.getRoleDetails(`/api/lookup/getMenuActions`, '').subscribe(res => {
      console.log("res", res);
      this.permssionArr = res.response.menuActions;
    },
      err => {
        this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
      }
    );

  }
  getUniqStudyList(i) {
    this.studyUniqList = [];
    this.studyArr.forEach(element => {
      element["available"] = true
    });;
    console.log("this.addAssStudyForm", this.addAssStudyForm.value.arr);
    const exitStudies = [];
    this.addAssStudyForm.value.arr.forEach(element => {
      exitStudies.push(element.clinicName ?.studyId)
    });
    console.log("this.exitStudies", exitStudies, this.studyArr);
    this.studyArr.forEach(element => {
      if (exitStudies.includes(element.studyId)) {
        element["available"] = false;
      } else {
        element["available"] = true;
      }
    });;
    console.log("this.studyArr", this.studyArr);
    this.studyArr.forEach(element => {
      console.log('element.available', element.available)
      if (element.available) {
        this.studyUniqList.push(element);
      }
    });
    console.log("this.studyUniqList", this.studyUniqList);
    this.addAssStudyForm.controls.arr['controls'][i].patchValue({
      studyList: this.studyUniqList
    })
  }

  addItem() {
    this.arr = this.addAssStudyForm.get('arr') as FormArray;
    this.arr.push(this.createItem());
  }

  removeItem(i: number) {
    this.arr = this.addAssStudyForm.get('arr') as FormArray;
    this.arr.removeAt(i);
  }

  // onSubmit($event) {
  //   console.log("addPlan",$event);

  // }
  back() {
    if (!this.editFlag) {
      this.router.navigate(['/user/clinical-user/add-new-user/add-user-details']);
    }
    else {
      this.router.navigate([`/user/clinical-user/edit-user/${this.editId}/add-user-details`]);
    }

  }
  next() {
    console.log("this.inactiveStudies", this.inactiveStudies)
    console.log("this.futureStudies", this.futureStudies)
    if (this.roleType != 1 && !(this.inactiveStudies)) {
      this.addAssStudyForm.value.arr.forEach((ele, i) => {
        // this.addAssStudyForm.get('arr')['controls'][i].controls.clinicName.setValidators([Validators.required]);
        // this.addAssStudyForm.get('arr')['controls'][i].controls.clinicName.updateValueAndValidity();
      })
    }
    else {
      this.addAssStudyForm.value.arr.forEach((ele, i) => {
        // this.addAssStudyForm.get('arr')['controls'][i].controls.clinicName.setValidators([]);
        // this.addAssStudyForm.get('arr')['controls'][i].controls.clinicName.updateValueAndValidity();
      })
    }
    this.addAssStudyForm.markAllAsTouched();
    if (this.addAssStudyForm.valid) {
      this.submitFlag = true;
      // let menu = Object.assign({});
      // if (this.addAssStudyForm.value.arr) {
      //   this.addAssStudyForm.value.arr.forEach(ele => {
      //     let menuObjVal = ele.clinicName ? ele.clinicName : '';
      //     if (menuObjVal != '') {
      //       menu[ele.clinicName.studyId] = ele.permission;
      //     }

      //   })
      //   console.log("menuu", menu);
      // }

      let menu = [];
      if (this.addAssStudyForm.value.arr) {
        this.addAssStudyForm.value.arr.forEach(ele => {
          let menuObjVal = ele.clinicName ? ele.clinicName : '';
          if (menuObjVal != '') {
            menu.push(ele.clinicName.studyId);
          }
        })
        console.log("menuu", menu);
      }

      let data = this.tabservice.getModelData();
      console.log("datadatadata", data);
      data = data.addUserDetails;
      this.roleType = data.roleType;
      console.log("this.roleType", this.roleType);
      let res = Object.assign({});
      // res["futureStudies"] = data.futureStudies == true ? 1 : 0;
      res["fullName"] = data.fullName;
      res["email"] = data.email;
      res["userName"] = data.userName;
      res["isActive"] = data.status == '0' ? false : true;
      console.log("data.role.roleId.toString();",data.role);
      let result = data.role.map(ele => ele.roleId);
      console.log("data.role",result);

      res["roleIds"] = result.toString();
      res["stydyPermissionMap"] = menu;
      res["userId"] = data.userId;
      if (this.roleType != 1) {
        res["futureStudies"] = this.futureStudies == true ? 1 : 0;
        res["inactiveStudies"] = this.inactiveStudies == true ? 1 : 0;
      }
      else {
        res["futureStudies"] = 1;
        res["inactiveStudies"] = 1;
      }
      res["hiddenFieldStatus"] = "";
      this.hiddenFieldStatus = false;
      console.log("ress", res);
      this.spinner.show();
      if (!this.editFlag) {

        this.adduserservice.addUser('/api/users/', res).subscribe(res => {
          if (res.status.success === true) {
            this.toastr.success('User added successfully!');
            this.router.navigate(['/user/clinical-user']);
            // this.tabservice.setModelData('');
          }
          else {
            this.toastr.error(res.errors[0].message);
          }
          this.spinner.hide();
        }, err => {
          this.spinner.hide();
          console.log(err);
          this.errorMsg(err);
        }
        );
      }
      else {
//this logic for edit
        if (this.hiddenFullName === data.fullName ||
          this.hiddenEmail === data.email ||
          this.hiddenUserName === data.userName ||
          this.hiddenStatus === data.status ||
          this.hiddenRoleName === data.role.roleId) {
          this.hiddenFieldStatus = true;
        }
        let mailFields = "";
        /*if(this.hiddenFullName != data.fullName ){
          mailFields= mailFields +"fullName" +",";
        }*/
        if (this.hiddenEmail != data.email) {
          mailFields = mailFields + "email" + ",";
        }

        if (this.hiddenUserName != data.userName) {
          mailFields = mailFields + "userName";
        }
        /* if(this.hiddenStatus !=data.status ){
           mailFields= mailFields +"status" +",";
         }
         if(this.hiddenRoleName !=data.role.roleId){
           mailFields= mailFields +"roleName";
         }*/
        res["hiddenFieldStatus"] = mailFields;
        // if(this.hiddenRoleName != this.roleId)
        console.log("result",result.toString());
        console.log("his.hiddenRoleName",this.hiddenRoleName);
        console.log("hiddenUserId",this.hiddenUserId);
        console.log("data.userId",data.userId);
       let loggedinUser = this.userService.getUserId()
        let userlogin : boolean;

        if(this.hiddenRoleName != result.toString() && loggedinUser == data.userId) {
          userlogin = true;
        }
        this.adduserservice.updateUser('/api/users/', res).subscribe(res => {

          if (res.status.success === true) {
            this.toastr.success('User updated successfully!');
            if(userlogin) {
            this.router.navigate(['/auth/login']);
          }
          else {
            this.router.navigate(['/user/clinical-user']);
          }
          }
          else {
            this.toastr.error(res.errors[0].message);
          }
          this.spinner.hide();
        }, err => {
          this.spinner.hide();
          console.log(err);
          this.errorMsg(err);
        }
        );
      }
    }

  }

  errorMsg(err) {
    if (err.status == 500) {
      this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
    }
    else {
      this.toastr.error(err.error.errors[0] ?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    }
  }

  studySelected($event, i) {
    console.log("$event", $event);
    this.addAssStudyForm.controls.arr['controls'][i].patchValue({
      status: $event.isActive == '' ? '' : ($event.isActive == true ? '1' : '0'),
      pInv: $event.principleInvestigator ? $event.principleInvestigator : '',
      permission: $event.permission ? $event.permission : ''
    })
  }
  canDeactivate(component, route, state, next) {
    console.log('i am navigating away');
    console.log("routein basic", next.url);
    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if (next.url.indexOf('/user/clinical-user') > -1 && this.submitFlag) {
      return true;
    }
    if (next.url.indexOf('/clinical-user/add-new-user') > -1 || next.url.indexOf('/clinical-user/edit-user') > -1) {
      this.addAssStudyForm.markAllAsTouched();
      if (this.addAssStudyForm.valid) {
        this.submitFlag = true;
        let res = {};
        if (this.roleType != 1) {
          res["futureStudies"] = this.futureStudies == true ? 1 : 0;
          res["inactiveStudies"] = this.inactiveStudies == true ? 1 : 0;
          this.tabservice.setModelData(res, 'Studies');
        }
        else {
          res["futureStudies"] = 1;
          res["inactiveStudies"] = 1;
        }

        this.tabservice.setModelData(this.addAssStudyForm.value, 'addAssStudy');
        let data = this.tabservice.getModelData();
        console.log("datadatadata in add ass", data);
      }
      else {
        this.submitFlag = false;
      }
    }
    else {
      let data = this.tabservice.getModelData() ? this.tabservice.getModelData() : {}
      console.log("Data", data, data.length)
      if (this.addAssStudyForm.pristine == false || Object.keys(data).length > 0) {
        return this.alertService.confirm();
      }
      else {
        return true
      }
    }

    if (!this.submitFlag) {
      return false;
    }
    else {
      return true;
    }
  }

}
