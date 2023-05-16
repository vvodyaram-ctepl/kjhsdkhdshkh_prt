import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RolesService } from '../roles.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { AlertService } from 'src/app/components/alert-modal/alert.service';
import { ValidationService } from 'src/app/components/validation-message/validation.service';

@Component({
  selector: 'app-add-roles',
  templateUrl: './add-roles.component.html',
  styleUrls: ['./add-roles.component.scss']
})
export class AddRolesComponent implements OnInit {
  public rolesForm: FormGroup;
  editFlag: boolean = false;
  addFlag: boolean = false;
  permissionMap: FormArray;
  menuDisabled: boolean = true;
  public data: any = {
    roletypes: [],
    menus: [],
    menuActions: [],
    checkArray: []
  }
  viewFlag: boolean = false;
  editId: any;
  submitFlag: boolean = false;
  customMenuActions: any;
  menuActionViewOption: any;

  //public permissions: FormArray = this.rolesForm.get('permission') as FormArray;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private roleservice: RolesService,
    private spinnerService: NgxSpinnerService,
    private userService: UserDataService,
    private alertService: AlertService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.rolesForm = this.fb.group({
      roleName: ['', [Validators.required,ValidationService.exceptSpecialChar]],
      roleType: ['', [Validators.required]],
      isActive: ['', [Validators.required]],
      // permission: [],
      permissionMap: this.fb.array([])
    });
  }

  ngAfterViewInit() {
    this.rolesForm.patchValue({
      'isActive': 1,
    });
  }

  ngAfterViewChecked() {
    this.checkDisabled();
  }

  async ngOnInit() {
    this.activatedRoute.params.subscribe(async params => {
      this.editId = params.id;
      const path = this.activatedRoute.snapshot.url[0].path;
      await this.getInitialData();
      await this.getMenuItems();
      await this.getMenuActions();

      await this.addItem();

      this.customMenuActions = [{
        menuActionName: "View Only",
        menuActionId: 2
      },
      {
        menuActionName: "View - Edit",
        menuActionId: 3
      },
      {
        menuActionName: "Admin",
        menuActionId: 4
      }];

      this.menuActionViewOption = [{
        menuActionName: "View Only",
        menuActionId: 2
      }]


      this.rolesForm.controls.permissionMap['controls'].forEach((ele, i) => {
        ele.value.subMenu.forEach((res, j) => {
          let menuActionId = 2;
          this.rolesForm.get('permissionMap')['controls'][i].get('subMenu')['controls'][j].patchValue({
            'menuActionName': menuActionId.toString()
          })
        })
      });

      // checked favorite true
      /* this.rolesForm.controls.permissionMap['controls'].forEach((ele, i) => {
        ele.value.subMenu.forEach((res, j) => {
          if (res.menuId == 1) {
            let menuActionId = 3;
            this.rolesForm.get('permissionMap')['controls'][i].get('subMenu')['controls'][j].patchValue({
              'menuActionName': menuActionId.toString(),
              'menuCheck': true,
              'disabled': true
            });
          }
          else if (res.menuId == 29) {
            this.rolesForm.get('permissionMap')['controls'][i].get('subMenu')['controls'][j].patchValue({
              'disabled': true
            });
          }

        })
      }); */

      if (path === 'add') {
        this.addFlag = true;
      }
      if (path === 'view') {
        this.viewFlag = true;
      }
      if (path === 'edit' || path === 'view') {
        if (path === 'edit') {
          this.editFlag = true;
        }
        if (path === 'view') {
          this.viewFlag = true;
        }
        this.roleservice.getRoleDetails(`/api/roles/${params.id}`, '').subscribe(res => {
          if (res.status.success === true) {
            let resObj = res.response.role;
            this.rolesForm.patchValue({
              "roleName": resObj.roleName ? resObj.roleName : '',
              "roleType": resObj.roleTypeId ? resObj.roleTypeId : '',
              "isActive": resObj.isActive == true ? '1' : '2',
            });

            this.rolesForm.controls.permissionMap['controls'].forEach((ele, i) => {
              ele.value.subMenu.forEach((res, j) => {
                resObj.menulist.forEach((resEle, k) => {
                  if (res.menuId == resEle.menuId) {
                    this.rolesForm.get('permissionMap')['controls'][i].get('subMenu')['controls'][j].patchValue({
                      'menuCheck': true,
                      'menuActionName': resEle.menuActionId.toString()
                    });
                  }
                })
              })
            });

            //menu enable disable based on value selected
            /* this.rolesForm.controls.permissionMap['controls'].forEach((ele, i) => {
              ele.value.subMenu.forEach((res, j) => {
                if (res.menuId == 1) {
                  let menuActionId = 3;
                  this.rolesForm.get('permissionMap')['controls'][i].get('subMenu')['controls'][j].patchValue({
                    'menuActionName': menuActionId.toString(),
                    'menuCheck': true,
                    'disabled': true
                  });
                }
                else if (res.menuId == 29) {
                  this.rolesForm.get('permissionMap')['controls'][i].get('subMenu')['controls'][j].patchValue({
                    'disabled': true
                  });
                }
                else {
                  if (res.menuCheck == true) {
                    this.rolesForm.get('permissionMap')['controls'][i].get('subMenu')['controls'][j].controls['menuActionName'].enable();

                  }
                  else {
                    this.rolesForm.get('permissionMap')['controls'][i].get('subMenu')['controls'][j].controls['menuActionName'].disable();
                  }
                }
              })
            }) */
            this.onCheckboxChange();

          }
          else {
            this.toastr.error(res.errors[0].message);
          }
        },
          err => {
            console.log(err);
            if (err.status == 500) {
              this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
            }
            else {
              this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
            }
          }
        );
      }
      else {
        this.onCheckboxChange();
      }
    });
  }

  createItem() {
    return this.fb.group({
      parentMenuName: [''],
      parentMenuId: [''],
      parentMenuCheck: [{ value: '', disabled: false }],
      subMenu: this.fb.array([])
    })
  }

  createSubMenu() {
    return this.fb.group({
      menuCheck: false,
      menuActionName: "",
      menuId: "",
      menuName: "",
      disabled: false
    })
  }

  async addItem() {
    let newArr: any = [];
    this.data.menus.forEach((ele, index) => {
      if (index === 0) {
        let subItems = this.data.menus.filter(menu => {
          if (menu.parentMenuId === ele.parentMenuId) {
            return {
              menuId: ele.menuId,
              menuName: ele.menuName,
              menuActionName: '',
              menuCheck: false
            }
          }
        });
        newArr.push({ parentMenuId: ele.parentMenuId, parentMenuName: ele.parentMenuName, subMenu: subItems });
        return;
      }
      let isDup = false;
      newArr.forEach((ele1, i) => {
        if (ele.parentMenuId === ele1.parentMenuId)
          isDup = true;
        if (i === newArr.length - 1 && !isDup) {
          let subItems = this.data.menus.filter(menu => {
            if (menu.parentMenuId === ele.parentMenuId) {
              return {
                menuId: ele.menuId,
                menuName: ele.menuName,
                menuActionName: '',
                menuCheck: false
              }
            }
          });
          newArr.push({ parentMenuId: ele.parentMenuId, parentMenuName: ele.parentMenuName, subMenu: subItems });
        }
      });
    });

    newArr.forEach((ele, i) => {
      this.permissionMap = this.rolesForm.get('permissionMap') as FormArray;
      this.permissionMap.push(this.createItem());
      let subArr = this.permissionMap['controls'][i].get('subMenu') as FormArray;
      ele.subMenu.forEach(res => {
        subArr.push(this.createSubMenu())
      })
      this.rolesForm.controls.permissionMap['controls'][i].patchValue({
        ...ele
      });
    })


  }

  private async getInitialData() {
    this.spinnerService.show();
    let res: any = await (
      this.roleservice.getRoleDetails(`/api/lookup/getRoleTypes`, '').pipe(
        catchError(err => {
          this.spinnerService.show();
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
          return of(false);
        })
      )
    ).toPromise();
    if (!res.status) {
      this.backToList();
      return false
    }
    if (res.status.success === true) {
      this.data.roletypes = res.response.roleTypes;
      this.spinnerService.hide();
    }
  }

  private async getMenuItems() {
    this.spinnerService.show();
    let res: any = await (
      this.roleservice.getRoleDetails(`/api/lookup/getMenus`, '').pipe(
        catchError(err => {
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
          return of(false);
        })
      )
    ).toPromise();
    if (!res.status) {
      this.backToList();
      return false
    }
    if (res.status.success === true) {
      this.data.menus = res.response.menus;
      this.spinnerService.hide();
    }
  }

  private async getMenuActions() {
    let res: any = await (
      this.roleservice.getRoleDetails(`/api/lookup/getMenuActions`, '').pipe(
        catchError(err => {
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
          return of(false);
        })
      )
    ).toPromise();
    if (!res.status) {
      this.backToList();
      return false
    }
    if (res.status.success === true) {
      this.data.menuActions = res.response.menuActions;
    }
  }

  backToList() {
    this.router.navigate(['/user/roles']);
  }

  onCheckboxAllChange(e, eid) {
    this.rolesForm.controls.permissionMap['controls'].forEach((ele, i) => {
      if (i == eid) {
        if (e.target.checked == true) {
          ele.value.subMenu.forEach((res, j) => {
            this.rolesForm.get('permissionMap')['controls'][i].get('subMenu')['controls'][j].patchValue({
              'menuCheck': true,
            });
            this.onCheckboxChange();
          });
        } else {
          ele.value.subMenu.forEach((res, j) => {
            this.rolesForm.get('permissionMap')['controls'][i].get('subMenu')['controls'][j].patchValue({
              'menuCheck': false,
            });
            this.onCheckboxChange();
          });
        }
      }
    });
  }

  onCheckboxChange(e?) {
    this.rolesForm.controls.permissionMap['controls'].forEach(async (ele, i) => {
      let isCheckAll = true;
      await ele.value.subMenu.forEach((res, j) => {
        if (res.menuId == 1) {
          let menuActionId = 3;
          this.rolesForm.get('permissionMap')['controls'][i].get('subMenu')['controls'][j].patchValue({
            'menuActionName': menuActionId.toString(),
            'menuCheck': true,
            'disabled': true
          });
        }
        else {
          if (res.menuCheck == true) {
            this.rolesForm.get('permissionMap')['controls'][i].get('subMenu')['controls'][j].controls['menuActionName'].enable();
          }
          else {
            isCheckAll = false;
            this.rolesForm.get('permissionMap')['controls'][i].get('subMenu')['controls'][j].controls['menuActionName'].disable();
            if (res.menuId == 1) {
              let menuActionId = 3;
              this.rolesForm.get('permissionMap')['controls'][i].get('subMenu')['controls'][j].patchValue({
                'menuActionName': menuActionId.toString(),
                'menuCheck': true,
                'disabled': true
              });
            }
            else if (res.menuId == 29) {
              this.rolesForm.get('permissionMap')['controls'][i].get('subMenu')['controls'][j].patchValue({
                'disabled': true
              });
            }
            else {
              let menuActionId = 2;
              this.rolesForm.get('permissionMap')['controls'][i].get('subMenu')['controls'][j].patchValue({
                'menuActionName': menuActionId.toString()
              })
            }
          }
          //else ends
        }
      });
      this.rolesForm.get('permissionMap')['controls'][i].patchValue({ parentMenuCheck: isCheckAll });
    })
  }

  checkDisabled() {
    this.rolesForm.controls.permissionMap['controls'].forEach((ele: any, i: number) => {
      ele.value.subMenu.forEach((res: any) => {
        if (res.disabled) {
          this.rolesForm.get('permissionMap')['controls'][i].get('parentMenuCheck').disable();
          this.changeDetectorRef.detectChanges();
        }
      });
    });
  }

  updateRole() {
    Object.keys(this.rolesForm.controls).forEach(key => {
      this.rolesForm.controls[key].markAsTouched();
    });

    if (this.rolesForm.invalid) {
      this.toastr.error('Please select all the mandatory fields', 'Error!');
      return false;
    }
    if (this.rolesForm.valid) {
      this.submitFlag = true;

      let menuArr = [];
      this.rolesForm.value.permissionMap.forEach(ele => {
        ele.subMenu.forEach(res => {
          if (res.menuCheck === true) {
            menuArr.push({
              "menuId": res.menuId,
              "menuName": res.menuName,
              "menuActionId": res.menuActionName,
              "menuActionName": "Read"
            })
          }
        })
      })

      if (menuArr.length == 1) {
        this.toastr.error('Please select at least one menu', 'Error!');
        return false;
      }

      let menu = Object.assign({});
      if (this.rolesForm.value.permissionMap) {
        this.rolesForm.value.permissionMap.forEach(ele => {
          ele.subMenu.forEach(res => {
            let menuObjVal = res.menuActionName ? res.menuActionName : '';
            if (menuObjVal != '') {
              // ele.menuName.menuId = ele.menuName.menuId.toString();
              menu[res.menuId] = res.menuActionName;
            }
          })


        })
      }

      if (Object.keys(menu).length === 0 && menu.constructor === Object) {
        this.toastr.error('Please select permission for the menu(s).', 'Error!');
      }

      let res = Object.assign({});
      if (!this.editFlag) {
        res["createdBy"] = this.userService.getUserId();
      }
      res["roleName"] = this.rolesForm.value.roleName.replace(/\s+/g, ' ').trim()
      res["roleTypeId"] = this.rolesForm.value.roleType;
      res["isActive"] = this.rolesForm.value.isActive == '1' ? parseInt(this.rolesForm.value.isActive) : 0;
      res["permissionMap"] = menu;
      if (this.editFlag) {
        res["roleId"] = this.editId;
        res["modifiedBy"] = this.userService.getUserId();
      }

      // if (Object.keys(menu).length != 0 && menu.constructor === Object) {
      this.spinnerService.show();
      if (!this.editFlag) {
        this.roleservice.addRole('/api/roles', res).subscribe(res => {
          if (res.status.success == true) {
            this.toastr.success("Role added successfully!");
            this.spinnerService.hide();
            this.router.navigate(['/user/roles']);
          }

        }, err => {
          console.log(err)
          if (err.status == 500) {
            this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
          }
          else {
            this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
          }
          this.spinnerService.hide();
        }
        );
      }
      else {
        this.roleservice.updateRole('/api/roles', res).subscribe(res => {
          if (res.status.success == true) {
            this.toastr.success("Role updated successfully!");
            this.spinnerService.hide();
            this.router.navigate(['/user/roles']);
          }
        },
          err => {
            console.log(err)
            if (err.status == 500) {
              this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
            }
            else {
              this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
            }
            this.spinnerService.hide();
          }

        )
      }
      // }
    }
  }
  canDeactivate(component, route, state, next) {
    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if (next.url.indexOf('/user/roles') > -1 && this.submitFlag) {
      return true;
    }
    if (this.rolesForm.pristine == false) {
      return this.alertService.confirm();
    }
    else {
      return true;
    }
  }
}
