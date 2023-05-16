import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
// import { AddUserService } from '../add-user.service';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { PushNotificationService } from '../push-notification.service';

@Component({
    selector: 'app-list-push-notification',
    templateUrl: './list-push-notification.component.html',
    styleUrls: ['./list-push-notification.component.scss']
  })
export class ListPushNotificationComponent implements OnInit {

  headers: any;
  filterTypeArr: any[];
  showDataTable: boolean = true;
  RWFlag: boolean;
  @ViewChild('archiveContent') archiveContent: ElementRef;
  modalRef2: NgbModalRef;
  selectedItem: any = '';
  selectedName: any = '';

  constructor(public router: Router,
    public customDatePipe: CustomDateFormatPipe,
    private tabservice: TabserviceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private pushService: PushNotificationService,
    // private adduserService: AddUserService,
    private userDataService: UserDataService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "36") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }

    this.headers = [
      // { key: "phoneNumber", label: "Phone", checked: true },
      { key: "notificationName", label: "Push Notification Name", checked: true, clickable: true, sortable : true },
      // { key: "notificationMessage", label: "Notification Message", checked: true, sortable : true },
      { key: "startDate", label: "Start Date", checked: true, sortable : true },
      { key: "endDate", label: "End Date", checked: true ,sortable : true},
      { key: "status", label: "Status", checked: true },
      { key: "static", label: "", checked: true, clickable: true, width: 80 }
    ];
    this.filterTypeArr =
      [{
        name: "Status",
        id: "Status"
      },
      // {
      //   name: "Role",
      //   id: "Role"
      // }
    ];
  }

  formatter($event) {
    $event.forEach(ele => {

      ele.id = ele.rnum;
      if (ele.status == 1) {
        ele.status = "Active";
        ele['columnCssClass']['status'] = "active-status";
      } else {
        ele.status = "Inactive";
        ele['columnCssClass']['status'] = "inactive-status";
      }

     
      ele.startDate = this.customDatePipe.transform(ele.startDate, 'MM/dd/yyyy');
      ele.endDate = this.customDatePipe.transform(ele.endDate, 'MM/dd/yyyy');

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
    if ($event.header === 'notificationName') {
      this.router.navigate(['/user/push-notification/view-push-notification', $event.item.notificationId]);
    }
    let action = $event.event.target.title;
    if (action === 'Edit') {
      this.router.navigate(['/user/push-notification/edit-push-notification', $event.item.notificationId]);
    }
    if (action === 'Delete') {
      this.openPopup(this.archiveContent, 'xs');
      this.selectedItem = $event.item.notificationId;
      this.selectedName = $event.item.notificationName;
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
    this.router.navigate(['/user/push-notification/add-push-notification']);

  }

  deleteRecord(selectedItem) {
    this.spinner.show();
    this.pushService.deletePush(`/api/pushNotifications/${selectedItem}`, '').subscribe(res => {
      if (res.status.success === true) {
        this.toastr.success('Push Notification deleted successfully!');
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
