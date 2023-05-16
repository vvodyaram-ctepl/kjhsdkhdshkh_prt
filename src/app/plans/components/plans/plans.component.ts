import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlansService } from '../plans.service';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserDataService } from 'src/app/services/util/user-data.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
  public url = "/api/plans";
  headers: any;
  filterTypeArr: any[];
  planDetails: any = {};
  @ViewChild('archiveContent') archiveContent: ElementRef;
  modalRef2: NgbModalRef;
  selectedItem: any = '';
  selectedName: any = '';
  public showDataTable: boolean = true;
  RWFlag: boolean;

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private planservice: PlansService,
    private toastr: ToastrService,
    public customDatePipe: CustomDateFormatPipe,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private userDataService: UserDataService
  ) { }

  ngOnInit() {
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "10") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }


    this.headers = [
      { key: "planName", label: "Plan Name", checked: true, clickable: true, sortable : true },
      { key: "studyName", label: "Study", checked: true, width: 400 },
      { key: "createdDate", label: "Created On", checked: true, sortable : true },
      { key: "isActive", label: "Status", checked: true },
      { key: "static", label: "", checked: true, clickable: true, width: 80 }
    ];

    this.filterTypeArr =
      [{
        name: "Status",
        id: "Status"
      },
      {
        name: "Study",
        id: "Study"
      }];

    this.showDataTable = true;
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
      ele.createdDate = this.customDatePipe.transform(ele.createdDate, 'MM/dd/yyyy');

      if (ele.studyName) {
        ele.studyName = ele.studyName.toString().split(',').join(', ');
      }

      if (this.RWFlag) {
        ele.static = `
      </div>&nbsp;<div class="card icon-card-list green-bg mb-2 mr-2" title="Edit">
      <span class="icon-tag size-20" title="Edit"></span>
      </div>&nbsp;<div class="card icon-card-list red-bg mb-2" title="Delete">
      <span class="fa fa-trash-alt size-14" style="color:red;" title="Delete"></span>
      </div>`
      }
    })
  }
  getNode($event) {

    if ($event.header === 'planName') {
      this.router.navigate(['/user/plans/view', $event.item.planId]);
    }

    let action = $event.event.target.title;

    if (action === 'Edit') {
      this.router.navigate(['/user/plans/edit', $event.item.planId]);
    }
    if (action === 'Delete') {

      this.openPopup(this.archiveContent, 'xs');
      this.selectedItem = $event.item.planId;
      this.selectedName = $event.item.planName;
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

  deleteRecord(selectedItem) {
    this.spinner.show();
    this.planservice.deletePlan(`/api/plans/${selectedItem}`, '').subscribe(res => {
      if (res.status.success === true) {
        this.reloadDatatable();
        this.toastr.success('Plan deleted successfully!');
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.modalRef2.close();
      this.spinner.hide();
    }, err => {
      this.modalRef2.close();
      this.spinner.hide();
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0] ?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    }
    )
  }

  addNew() {
    this.router.navigate(['/user/plans/add-plans']);
  }

  public reloadDatatable() {
    this.showDataTable = false;
    setTimeout(() => {
      this.showDataTable = true;
    }, 1);
  }
}
