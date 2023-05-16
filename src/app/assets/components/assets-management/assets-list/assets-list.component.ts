import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssetsService } from '../../assets.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.scss']
})
export class AssetsListComponent implements OnInit {

  headers: any;
  filterTypeArr: any[];
  RWFlag: boolean;
  @ViewChild('archiveContent') archiveContent: ElementRef;
  modalRef2: NgbModalRef;
  selectedItem: any = '';
  public showDataTable: boolean = false;
  selectedName: any = '';

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private userDataService: UserDataService,
    private modalService: NgbModal,
    private assetsService: AssetsService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {

    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "17") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }
    this.headers = [
      { key: "deviceType", label: "Asset Type", checked: true, clickable: true, sortable : true },
      { key: "deviceModel", label: "Asset Model", checked: true, sortable : true },
      { key: "deviceNumber", label: "Asset Number", checked: true, sortable : true },
      { key: "mfgfirm", label: "Manufacturer Firmware", checked: true, sortable : true },
      { key: "study", label: "Study", checked: true, sortable : true },
      { key: "location", label: "Asset Location", checked: true, sortable : true },
      // { key: "isActive", label: "Status", checked: true },
      { key: "status", label: "Asset Status", checked: true },
      { key: "static", label: '', clickable: true, checked: true }
    ];
    this.filterTypeArr =
      [{
        name: "Study",
        id: "Study"
      },
      {
        name: "Asset Type",
        id: "deviceType"
      },
      {
        name: "Asset Status",
        id: "assetStatus"
      }
      ];
    this.showDataTable = true;
  }

  formatter($event) {
    console.log("$event", $event)
    $event.forEach(ele => {
      ele.id = ele.rnum;
      // if (ele.isActive == true) {
      //   ele.isActive = "Active";
      //   ele['columnCssClass']['isActive'] = "active-status";
      // } else {
      //   ele.isActive = "Inactive";
      //   ele['columnCssClass']['isActive'] = "inactive-status";
      // }
      if (ele.statusId == '1') {
        // ele.statusId = "Discarded";
        ele['columnCssClass']['status'] = "off-status";
      }
      if (ele.statusId == '2') {
        // ele.statusId = "Available";
        ele['columnCssClass']['status'] = "active-status";
      }
      if (ele.statusId == '3') {
        // ele.statusId = "Testing";
        ele.status = "In Testing";
        ele['columnCssClass']['status'] = "testing-status";
      }
      if (ele.statusId == '4') {
        // ele.statusId = "Allocated";
        ele['columnCssClass']['status'] = "info-status";
      }
      if (ele.statusId == '5') {
        // ele.statusId = "Allocated";
        ele['columnCssClass']['status'] = "study-status";
      }
      if (ele.statusId == '6') {
        // ele.statusId = "unassigned";
        ele['columnCssClass']['status'] = "unassigned-status";
      }
      if (this.RWFlag) {
        ele.static = `
        </div>&nbsp;<div class="card icon-card-list green-bg mb-2 mr-2" title="Edit">
        <span class="icon-tag size-20" title="Edit"></span>
        </div>&nbsp;<div class="card icon-card-list red-bg mb-2" title="Delete">
        <span class="fa fa-trash-alt size-14" style="color:red;" title="Delete"></span>
        </div>`
      }
    });
  }
  getNode($event) {

    if ($event.header === 'deviceType') {
      this.router.navigate(['/user/assets/management/view', $event.item.deviceId]);
    }
    let action = $event.event.target.title;
    // if (action === 'View') {
    //   this.router.navigate(['/user/assets/management/view', $event.item.deviceId]);
    // }
    if (action === 'Edit') {
      this.router.navigate(['/user/assets/management/edit', $event.item.deviceId]);
    }
    if (action === 'Delete') {
      this.openPopup(this.archiveContent, 'xs');
      this.selectedItem = $event.item.deviceId;
      this.selectedName = $event.item.deviceNumber;
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
    this.assetsService.deleteRecord(`/api/assets/${selectedItem}`, '').subscribe(res => {
      if (res.status.success === true) {
        this.toastr.success('Asset deleted successfully!');
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
  addAssets() {
    this.router.navigate(['/user/assets/management/add']);
  }
  bulkUpload() {
    this.router.navigate(['/user/assets/management/bulk-upload']);
  }
  public reloadDatatable() {
    this.showDataTable = false;
    setTimeout(() => {
      this.showDataTable = true;
    }, 1);
  }
}
