import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RolesService } from '../roles.service';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  headers: any;
  public showDataTable: boolean = true;
  filterTypeArr: any[];
  RWFlag: boolean;
  @ViewChild('archiveContent') archiveContent: ElementRef;
  modalRef2: NgbModalRef;
  selectedItem: any;
  selectedName: any;
  constructor(
    public router: Router,
    public roleservice: RolesService,
    public toastr: ToastrService,
    private userDataService: UserDataService,
    private modalService: NgbModal,
    private spinner:NgxSpinnerService
  ) { }

  ngOnInit() {
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "23") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }
    this.headers = [
      { key: "roleName", label: "Role Name", clickable: true, checked: true, sortable : true },
      { key: "roleType", label: "Role Type", checked: true, sortable : true },
      { key: "permissions", label: "Permissions", checked: true, width: 500 },
      { key: "isActive", label: "Status", checked: true },
      { key: "static", label: "", checked: true, clickable: true, width: 85 }
    ];
    this.filterTypeArr =
      [{
        name: "Status",
        id: "Status"
      },
      {
        name: "Role Type",
        id: "RoleType"
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
        ele.static = `<div class="card icon-card-list green-bg mb-2 mr-2" title="Edit">
      <span class="icon-tag size-20" title="Edit"></span>
      </div>&nbsp;<div class="card icon-card-list red-bg mb-2" title="Delete">
      <span class="fa fa-trash-alt size-14" style="color:red;" title="Delete"></span>
      </div>`
      }
    });
  }

  public reloadDatatable() {
    this.showDataTable = false;
    setTimeout(() => {
      this.showDataTable = true;
    }, 1);
  }

  getNode($event) {
    let action = $event.event.target.title;
    console.log("header", $event.header);
    if ($event.header === 'roleName') {
      this.router.navigate(['/user/roles/view', $event.item.roleId]);
    }
    if (action === 'Edit') {
      this.router.navigate(['/user/roles/edit', $event.item.roleId]);
    }
    if (action === 'Delete') {
      // let res = Object.assign({});
      this.openPopup(this.archiveContent, 'xs');
      this.selectedItem = $event.item.roleId;
      this.selectedName = $event.item.roleName; 
    }
  }

  deleteRecord(selectedItem) {
    this.spinner.show();
    this.roleservice.deleteRole(`/api/roles/${selectedItem}`, '').subscribe(res => {
      if (res.status.success === true) {
        this.toastr.success('Role deleted successfully!');
        this.reloadDatatable();
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
      this.modalRef2.close();
    }, err => {
      this.spinner.hide();
      this.modalRef2.close();
      console.log(err)
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0] ?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    }
    )
  }
  addEditRoles() {
    this.router.navigate(['/user/roles/add']);
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
}
