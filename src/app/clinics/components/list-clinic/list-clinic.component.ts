import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { ClinicService } from '../clinic.service';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list-clinic',
  templateUrl: './list-clinic.component.html',
  styleUrls: ['./list-clinic.component.scss']
})
export class ListClinicComponent implements OnInit {
  @ViewChild('archiveContent') archiveContent: ElementRef;
  modalRef2: NgbModalRef;
  headers: any;
  filterTypeArr: any[];
  showDataTable: boolean = true;
  RWFlag: boolean;
  studyId: any;
  studyName: any;
  constructor(public router: Router,
    public customDatePipe: CustomDateFormatPipe,
    private tabservice: TabserviceService,
    private clinicService: ClinicService,
    private toastr: ToastrService,
    private userDataService: UserDataService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "11") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }

    this.headers = [
      { key: "studyId", label: "Study ID", checked: true },
      { key: "studyName", label: "study name", checked: true, clickable: true, width: 200, sortable : true},
      // { key: "stateCode", label: "State/PR", checked: true, width: 150 },
      { key: "planName", label: "Plan", checked: true, width: 350 },
      // { key: "createdDate", label: "Created on", checked: true },
      { key: "startDate", label: "Start Date", checked: true, sortable : true },
      { key: "endDate", label: "End Date", checked: true, sortable : true },
      { key: "isActive", label: "Status", checked: true },
      { key: "static", label: "", checked: true, clickable: true, width: 45 }
    ];

    this.filterTypeArr =
      [{
        name: "Status",
        id: "Status"
      },
      {
        name: "Plan",
        id: "Plan"
      }];
  }

  formatter($event) {
    $event.forEach(ele => {
      if (ele.isActive == true) {
        ele.isActive = "Active";
        ele['columnCssClass']['isActive'] = "active-status";
      } else {
        ele.isActive = "Inactive";
        ele['columnCssClass']['isActive'] = "inactive-status";
      }

      ele.createdDate = this.customDatePipe.transform(ele.createdDate, 'MM/dd/yyyy');
      ele.startDate = this.customDatePipe.transform(ele.startDate, 'MM/dd/yyyy');
      ele.endDate = this.customDatePipe.transform(ele.endDate, 'MM/dd/yyyy');

      if (this.RWFlag) {
        ele.static = `<div class="card icon-card-list green-bg mb-2 mr-2" title="Edit">
  <span class="icon-tag size-20" title="Edit"></span>
</div>`
        //&nbsp;<div class="card icon-card-list red-bg mb-2" title="Delete">
        //<span class="fa fa-trash-alt size-14" style="color:red;" title="Delete"></span>
        //</div>
      }
    });
  }

  getNode($event) {
    console.log('event ::: ', $event);
    if ($event.header === 'studyName') {
      this.tabservice.clearDataModel();
      this.router.navigate(['/user/clinics/view-clinic', $event.item.studyId]);
    }
    let action = $event.event.target.title;
    if (action === 'Edit') {
      this.tabservice.clearDataModel();
      this.router.navigate(['/user/clinics/edit-clinic', $event.item.studyId]);
    }
    if (action === 'Delete') {
      let res = Object.assign({});
      res.id = $event.item.studyId;
      this.studyId = res.id;
      // if ($event.item.isActive === "Inactive") {
      this.openPopup(this.archiveContent, 'xs');
      this.studyName = $event.item.studyName;
      // }
      // else {
      //   this.toastr.error("Cannot delete an active study");
      // }
    }

  }
  deleteStudy() {
    this.spinner.show();
    this.clinicService.deleteStudy(`/api/study/${this.studyId}`, '').subscribe(res => {
      if (res.status.success === true) {
        this.toastr.success('Study deleted successfully!');
        this.reloadDatatable();
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
      this.modalRef2.close();
    },
      err => {
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
  editRecord() {
    this.router.navigate(['/user/clinics/edit-clinic'])
  }

  public reloadDatatable() {
    this.showDataTable = false;
    setTimeout(() => {
      this.showDataTable = true;
    }, 1);
  }

  addNew() {
    this.tabservice.clearDataModel();
    this.router.navigate(['/user/clinics/add-new-clinic']);
  }

}
