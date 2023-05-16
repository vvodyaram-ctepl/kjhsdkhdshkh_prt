import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddUserService } from '../add-user.service';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-clinic-users',
  templateUrl: './list-clinic-users.component.html',
  styleUrls: ['./list-clinic-users.component.scss']
})
export class ListClinicUsersComponent implements OnInit {

  headers: any;
  filterTypeArr: any[];
  showDataTable: boolean = true;
  RWFlag: boolean;
  @ViewChild('archiveContent') archiveContent: ElementRef;
  modalRef2: NgbModalRef;
  selectedItem: any = '';
  selectedName: any = '';

  constructor(public router: Router,
    private tabservice: TabserviceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private adduserService: AddUserService,
    private userDataService: UserDataService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "24") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }

    this.headers = [
      // { key: "phoneNumber", label: "Phone", checked: true },
      // { key: "userName", label: "Username", checked: true, clickable: true, sortable : true },
      { key: "fullName", label: "Full Name", checked: true, clickable: true, sortable: true },
      { key: "email", label: "Email", checked: true, sortable: true },
      { key: "roleName", label: "Role", checked: true },
      { key: "isActive", label: "Status", checked: true },
      { key: "static", label: "", checked: true, clickable: true, width: 80 }
    ];
    this.filterTypeArr =
      [{
        name: "Status",
        id: "Status"
      },
      {
        name: "Role",
        id: "Role"
      }];
  }

  formatter($event) {
    $event.forEach(ele => {

      ele.id = ele.rnum;
      if (ele.isActive == true) {
        ele.isActive = "Active";
        ele['columnCssClass']['isActive'] = "active-status";
      } else {
        ele.isActive = "Inactive";
        ele['columnCssClass']['isActive'] = "inactive-status";
      }

      if (this.RWFlag) {
        ele.static = `
        <div class="card icon-card-list green-bg mb-2 mr-2" title="Edit">
        <span class="icon-tag size-20" title="Edit"></span>
        </div>&nbsp;<div class="card icon-card-list red-bg mb-2" title="Delete">
        <span class="fa fa-trash-alt size-14" style="color:red;" title="Delete"></span>
        </div>`
      }
    });
  }

  // <div class="card icon-card-list green-bg mb-2 mr-2" title="Reset Password">
  // <span class="fa fa-undo m-auto" title="Reset Password"></span>
  // </div>&nbsp;

  getNode($event) {
    console.log('event ::: ', $event);
    if ($event.header === 'fullName') {
      this.router.navigate(['/user/clinical-user/view-clinic-users', $event.item.userId]);
    }
    let action = $event.event.target.title;
    if (action === 'Edit') {
      this.tabservice.clearDataModel();
      let userId = this.userDataService.getUserId();
      console.log("usrid", userId);

      //commented for enhancement
      console.log("($event.item", $event.item)
      //  if($event.item.roleId == 1) {
      //   this.router.navigate(['/user/clinical-user/edit-user', $event.item.userId]);
      //  }
      //  else {
      //   this.toastr.error("User should have admin permission to edit record");
      //   }

      if ($event.item.userId == userId) {
        console.log("$event.item.roleIds", $event.item.roleIds);

        if ($event.item.roleTypeId == 1) {
          this.router.navigate(['/user/clinical-user/edit-user', $event.item.userId]);
        }
        else {
          this.toastr.error("User should have admin as a role type to edit their own record.");
        }
      }
      else {
        this.router.navigate(['/user/clinical-user/edit-user', $event.item.userId]);
      }

    }
    if (action === 'Delete') {
      let res = Object.assign({});
      res.id = $event.item.userId;
      this.selectedItem = $event.item.userId;
      this.selectedName = $event.item.fullName;

      let userId = this.userDataService.getUserId();
      console.log("usrid", userId);

      if ($event.item.userId != userId) {
        this.openPopup(this.archiveContent, 'xs');
      }
      else {
        this.toastr.error("Current user cannot delete their own record");
      }
    }
    if (action === 'Reset Password') {
      this.tabservice.clearDataModel();
      this.adduserService.resetPassword(`/api/users/forgotPassword?userName=${$event.item.userName}`).subscribe(res => {
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

  }

  openPopup(div, size) {
    this.modalRef2 = this.modalService.open(div, {
      size: size,
      windowClass: 'smallModal',
      backdrop: 'static',
      keyboard: false
    });
    this.modalRef2.result.then((result) => {
      console.log(result);
    }, () => {
    });
  }

  public reloadDatatable() {
    this.showDataTable = false;
    setTimeout(() => {
      this.showDataTable = true;
    }, 1);
  }

  addNew() {
    this.tabservice.clearDataModel();
    this.router.navigate(['/user/clinical-user/add-new-user']);

  }

  deleteRecord(selectedItem) {
    this.spinner.show();
    this.adduserService.deleteUser(`/api/users/${selectedItem}`, '').subscribe(res => {
      if (res.status.success === true) {
        this.reloadDatatable();
        this.toastr.success('User deleted successfully!');
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.modalRef2.close();
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.modalRef2.close();
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    }
    )
  }
}
