import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssetsService } from 'src/app/assets/components/assets.service';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';

@Component({
    selector: 'app-list-shipment',
    templateUrl: './list-shipment.component.html',
    styleUrls: ['./list-shipment.component.scss'],
    encapsulation:ViewEncapsulation.None
  })
export class ListShipmentComponent implements OnInit {

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
    private spinner: NgxSpinnerService,
    private customDatePipe:CustomDateFormatPipe
  ) { }

  ngOnInit() {

    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "39") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }
    this.headers = [
      { key: "trackingNumber", label: "tracking Number", checked: true, sortable : true,clickable: true, },
      { key: "deviceNumber", label: "Asset Number", checked: true, sortable : true },
      { key: "petName", label: "pet Name", checked: true, sortable : true },
      { key: "shipmentCompanyName", label: "shipment Company", checked: true, sortable : true },
      { key: "shipmentDate", label: "shipment Date", checked: true, sortable : true },
      { key: "status", label: "status", checked: true },
   
      { key: "static", label: '', clickable: true, checked: true }
    ];
    this.filterTypeArr =
      [{
        name: "Shipment Company",
        id: "shipCompany"
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
      if (ele.status == 'In-Transit') {
        ele['columnCssClass']['status'] = "info-status";
      }
      if (ele.status == 'Delivered') {
        ele['columnCssClass']['status'] = "active-status";
      }
     

      ele.shipmentDate = this.customDatePipe.transform(ele.shipmentDate, 'MM/dd/yyyy');


      //   <img style="cursor:pointer" src="assets/images/shipment-icon.png" width="20" height="20" title="Track Shipment" />
      if (this.RWFlag) {
        ele.static = `
        </div>&nbsp;<div class="card icon-card-list green-bg mb-2 mr-2" title="Track Shipment">
        <span class="icon-trackShipThick position-relative size-20" title="Track Shipment"></span>
        </div>&nbsp;<div class="card icon-card-list green-bg mb-2 mr-2" title="Edit">
        <span class="icon-tag size-20" title="Edit"></span>
        </div>&nbsp;<div class="card icon-card-list red-bg mb-2" title="Delete">
        <span class="fa fa-trash-alt size-14" style="color:red;" title="Delete"></span>
        </div>`
      }
    });
  }
  getNode($event) {

    if ($event.header === 'trackingNumber') {
      this.router.navigate(['/user/shipment/view', $event.item.deviceShipmentId]);
    }
    let action = $event.event.target.title;
    console.log("action",action)
    // if (action === 'View') {
    //   this.router.navigate(['/user/assets/management/view', $event.item.deviceId]);
    // }
    if (action === 'Edit') {
      this.router.navigate(['/user/shipment/edit', $event.item.deviceShipmentId]);
    }
    if (action === 'Track Shipment') {
      window.open($event.item.trackingUrl, "_blank");
    }
    if (action === 'Delete') {
      this.openPopup(this.archiveContent, 'xs');
      this.selectedItem = $event.item.deviceShipmentId;
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
    this.assetsService.deleteRecord(`/api/shipments/${selectedItem}`, '').subscribe(res => {
      if (res.status.success === true) {
        this.toastr.success('Shipment deleted successfully!');
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
    this.router.navigate(['/user/shipment/add']);
  }
  // bulkUpload() {
  //   this.router.navigate(['/user/assets/management/bulk-upload']);
  // }
  public reloadDatatable() {
    this.showDataTable = false;
    setTimeout(() => {
      this.showDataTable = true;
    }, 1);
  }
}
