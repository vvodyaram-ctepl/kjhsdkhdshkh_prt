import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { ClinicalNotificationService } from '../../clinical-notification.service';

@Component({
  selector: 'app-clinical-notification',
  templateUrl: './clinical-notification.component.html',
  styleUrls: ['./clinical-notification.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClinicalNotificationComponent implements OnInit {

  @ViewChild('archiveContent') archiveContent: ElementRef;
  headers: any;
  modalRef2: NgbModalRef;
  selectable: object = {
    title: '',
    selectAll: true,
    index: 2
  };
  devArr: any[];
  selectedRecordsEvent: any;
  showDataTable: boolean = true;
  RWFlag: boolean;
  filterTypeArr: { name: string; id: string; }[];
  selectedRecordsEventTemp: any;

  constructor(
    private clinicservice: ClinicalNotificationService,
    private modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private userDataService: UserDataService
  ) { }

  ngOnInit() {
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "12") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }

    this.headers = [
      { key: "studyName", label: "STUDY NAME", checked: true, width: 600, sortable : true },
      { key: "isNotificationEnable", label: "Notification enabled", checked: true }

    ];
    this.filterTypeArr =
      [
        {
          name: "Notification Status",
          id: "notificationStatus"
        }
      ];
  }

  formatter($event) {
    this.selectedRecordsEvent = $event;

    $event.forEach(ele => {
      if (ele.isNotificationEnable === true) {
        console.log(ele);
        ele.select = true;
        ele.isNotificationEnable = '';
        // ele.isNotificationEnable = `<input type="checkbox" checked>`
        // ele.isNotificationEnable = "Yes";
      }
      else {
        console.log(ele);
        ele.select = false;
        ele.isNotificationEnable = '';
        // ele.isNotificationEnable = `<input type="checkbox">`
        // ele.isNotificationEnable = "No";
      }
      if (ele.isActive == false) {
        ele['disabled'] = true;
      } else {
        ele['disabled'] = false;
      }
    });
    this.selectedRecordsEventTemp = JSON.parse(JSON.stringify(this.selectedRecordsEvent));
  }

  openPopup(div, size) {
    console.log('div :::: ', div);
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

  OpenNotifications() {
    this.devArr = [];

    if (this.selectedRecordsEvent) {

      this.selectedRecordsEvent.forEach(ele => {
        this.selectedRecordsEventTemp.forEach(element => {
          if (ele.studyId === element.studyId && ele.select !== element.select) {


            let studyNotificationStatusList = Object.assign({});
            //  this.devArr.push(ele.studyId);
            studyNotificationStatusList['studyId'] = ele.studyId;
            if (ele.select == true) {
              studyNotificationStatusList['status'] = 1;
            }
            else {
              studyNotificationStatusList['status'] = 0;
            }
            this.devArr.push(studyNotificationStatusList);
          }
        });
      })

    }
    console.log("studyNotificationStatusList", this.devArr);
      console.log("Sdsd")
    if(this.devArr.length == 0) {
      this.toastr.error("Please select at least one study to update study notification")
      return false;
    }
    else {
    this.openPopup(this.archiveContent, 'xs');
  }
  }
  selectedRecords($event) {
    console.log("$event", $event);


  }

  enable() {
    this.devArr = [];

    if (this.selectedRecordsEvent) {

      this.selectedRecordsEvent.forEach(ele => {
        this.selectedRecordsEventTemp.forEach(element => {
          if (ele.studyId === element.studyId && ele.select !== element.select) {


            let studyNotificationStatusList = Object.assign({});
            //  this.devArr.push(ele.studyId);
            studyNotificationStatusList['studyId'] = ele.studyId;
            if (ele.select == true) {
              studyNotificationStatusList['status'] = 1;
            }
            else {
              studyNotificationStatusList['status'] = 0;
            }
            this.devArr.push(studyNotificationStatusList);
          }
        });
      })

    }
    console.log("studyNotificationStatusList", this.devArr);
      console.log("Sdsd")
  
    let outObj = Object.assign({});
    outObj['studyNotificationStatusList'] = this.devArr;
    console.log("outObj", outObj);
    // if(outObj['studyNotificationStatusList'] != {})
    if (Object.keys(outObj).length != 0 && outObj.constructor === Object) {
      this.spinner.show();
      this.clinicservice.updateStudyNotification('/api/study/updateStudyNotificationStatus', outObj).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success('Study Notification updated successfully!');
          this.reloadDatatable();
        }
        else {
          this.toastr.error(res.errors[0].message);
        }
        this.modalRef2.close();
        this.spinner.hide();
      }, err => {
        console.log(err);
        if (err.status == 500) {
          this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
        }
        else {
          this.toastr.error(err.error.errors[0] ?.message || 'Something went wrong. Please try after sometime or contact administrator.');
        }
        this.modalRef2.close();
        this.spinner.hide();
      })
    }

  }
  public reloadDatatable() {
    this.showDataTable = false;
    setTimeout(() => {
      this.showDataTable = true;
    }, 1);
  }

}
