import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssetService } from 'src/app/services/util/asset.service';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { ToastrService } from 'ngx-toastr';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssetsService } from '../assets.service';
import { ValidationService } from 'src/app/components/validation-message/validation.service';

@Component({
  selector: 'app-firmware-versions',
  templateUrl: './firmware-versions.component.html',
  styleUrls: ['./firmware-versions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FirmwareVersionsComponent implements OnInit {
  public showDataTable: boolean = true;
  @ViewChild('archiveContent') archiveContent: ElementRef;
  @ViewChild('deleteContent') deleteContent: ElementRef;
  headers: any;
  modalRef2: NgbModalRef;
  firmForm: FormGroup;
  AddFlag: boolean;
  searchquery: any;
  RWFlag: boolean;
  selectedItem: any;
  selectedName: any;
  selectedAssetFirmId: any;
  assetTypes: any;
  modelList: any;
  assetFirmId: any;
  selectedAssetModel: any;
  selectedAssetType: any;
  selectedFirmwareVersionNumber: any;
  filterTypeArr: any[];
  constructor(public router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private appService: AssetService,
    private firmwareService: AssetsService,
    private userService: UserDataService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public customDatePipe: CustomDateFormatPipe,
    private userDataService: UserDataService
  ) {
    this.firmForm = this.fb.group({
      'assetType': ['', [Validators.required]],
      'assetModel': [''],
      'firmwareVersion': ['', [Validators.required, ValidationService.versionDecimalValidatorWithValue]],
      'firmwareVersionId': '',
      'ModifedBy': ''
    })
  }

  ngOnInit() {
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    this.getAssetTypes();
    this.firmForm.controls['assetModel'].disable();
    if (this.firmForm.value.assetType) {
      //    this.getModelData();
    }

    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "20") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }
    this.headers = [
      { key: "firmwareVersionNumber", label: "Firmware Version Number", checked: true, sortable : true },
      { key: "assetType", label: "Asset Type", checked: true, sortable : true},
      { key: "model", label: "Asset Model", checked: true, sortable : true },
      { key: "createdUser", label: "Created By", checked: true },
      { key: "createdDate", label: "Created Date", checked: true },
      { key: "modifiedUser", label: "Modified By", checked: true },
      { key: "modifiedDate", label: "Modified Date", checked: true },
      { key: "static", label: "", checked: true, clickable: true, width: 85 }
    ];

    this.filterTypeArr =
      [
        {
          name: "Asset Type",
          id: "deviceType"
        },
        {
          name: "Asset Model",
          id: "Model"
        }
      ];
  }
  formatter($event) {
    $event.forEach(ele => {
      //  ele['columnCssClass']['age'] = "active-status";
      ele.createdDate = this.customDatePipe.transform(ele.createdDate, 'MM/dd/yyyy');
      ele.modifiedDate = this.customDatePipe.transform(ele.modifiedDate, 'MM/dd/yyyy');
      if (this.RWFlag) {
        ele.static = `<div class="card icon-card-list green-bg mb-2 mr-2" title="Edit">
     <span class="icon-tag size-20" title="Edit"></span>
   </div>&nbsp;<div class="card icon-card-list red-bg mb-2" title="Delete">
   <span class="fa fa-trash-alt size-14" style="color:red;" title="Delete"></span>
   </div>`
      }
    });
  }

  async getNode($event) {
    let action = $event.event.target.title;
    if (action === 'Edit') {
      this.AddFlag = false;
      this.openPopup(this.archiveContent, 'xs');

      this.assetFirmId = $event.item.assetFrimwareVersionId;
      await this.getAssetTypes();
      await this.firmwareService.getAssetsService(`/api/assets/getDeviceModelById/${$event.item.assetType}`).subscribe(res => {
        if (res.status.success === true) {
          let resFilter = res.response.rows.filter(ele => ele.deviceModel != 'Other');
          this.modelList = resFilter;
        }
        else {
          this.toastr.error(res.errors[0].message);
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      });

      this.firmForm.patchValue({
        'firmwareVersion': $event.item.firmwareVersionNumber,
        'firmwareVersionId': $event.item.firmwareVersionId,
        'assetType': $event.item.assetType,
        'assetModel': $event.item.model,
      });

      // if (this.firmForm.controls['assetModel'].value) {
      //   this.firmForm.controls['assetModel'].enable();
      // }
      this.firmForm.controls['assetType'].disable();
      this.firmForm.controls['assetModel'].disable();

    }
    if (action === 'Delete') {
      let res = Object.assign({});
      console.log($event.item);
      this.selectedItem = $event.item.firmwareVersionId;
      this.selectedName = $event.item.firmwareVersionNumber;
      this.selectedAssetFirmId = $event.item.assetFrimwareVersionId;
      this.selectedAssetType = $event.item.assetType;
      this.selectedAssetModel = $event.item.model;
      this.selectedFirmwareVersionNumber = $event.item.firmwareVersionNumber
      this.openPopup(this.deleteContent, 'xs');
      // res.modifiedBy = this.userService.getUserId();

    }

  }
  getAssetTypes() {
    this.spinner.show();
    this.firmwareService.getAssetsService('/api/assets/getAllAssetTypes').subscribe(res => {
      if (res.status.success === true) {
       
        let resFilter = res.response.assetTypeList.filter(ele => ele.deviceType != 'Other');
        // this.modelList = resFilter;
        this.assetTypes = resFilter;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });

  }

  changeDeviceType($event) {
    console.log("$eveng",$event.target.value)
  
    let asset =  $event.target.value ? $event.target.value.split(':')[1].trim() : '';
    if(asset) {
    this.firmForm.controls['assetModel'].enable();
    this.spinner.show();
    this.firmwareService.getAssetsService(`/api/assets/getDeviceModelById/${asset}`).subscribe(res => {
      if (res.status.success === true) {
        let resFilter = res.response.rows.filter(ele => ele.deviceModel != 'Other');
        this.modelList = resFilter;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
  }
  }

  openPopup(div, size) {
    console.log('div :::: ', div);
    this.firmForm.controls['assetModel'].disable();
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
  addNew() {
    this.AddFlag = true;
    this.firmForm.controls['assetType'].enable();
    this.openPopup(this.archiveContent, 'xs');
    this.firmForm.reset();
    this.firmForm.patchValue({
      'assetType': '',
      'assetModel': '',
      'firmwareVersion': '',
      'firmwareVersionId': '',
      'ModifedBy': ''
    })
  }

  addFirmware() {
    Object.keys(this.firmForm.controls).forEach(key => {
      this.firmForm.controls[key].markAsTouched();
    });
    if (this.firmForm.valid) {
      this.spinner.show();
      let res = Object.assign({});
      res.assetType = this.firmForm.value.assetType;
      res.model = this.firmForm.controls['assetModel'].value;
      res.firmwareVersionNumber = this.firmForm.value.firmwareVersion;
      res.createdBy = this.userService.getUserId();

      this.appService.addFirmware('/api/assets/addFirmwareVersion', res).subscribe(res => {
        if (res.status.success === true) {
          this.reloadDatatable();
          this.toastr.success('Firmware Version added successfully!');
        }
        else {
          this.toastr.error(res.errors[0].message);
        }
        this.spinner.hide();
        this.modalRef2.close();
      }, err => {
        console.log(err);
        if (err.status == 500) {
          this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
        }
        else {
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
        }
        this.spinner.hide();
        // this.modalRef2.close();
      }
      );
    }
  }

  UpdateFirmware() {
    if (this.firmForm.valid) {
      this.spinner.show();
      let res = Object.assign({});
      res.firmwareVersionId = this.firmForm.value.firmwareVersionId;
      res.modifiedBy = this.userService.getUserId();
      //  res.assetType = this.firmForm.value.assetType;
      //  res.model = this.firmForm.value.assetModel;
      res.assetType = this.firmForm.controls['assetType'].value;
      res.model = this.firmForm.controls['assetModel'].value;

      res.firmwareVersionNumber = this.firmForm.value.firmwareVersion;
      res.assetFrimwareVersionId = this.assetFirmId;
      this.appService.updateFirmware('/api/assets/updateFirmwareVersion/', res).subscribe(res => {
        if (res.status.success === true) {
          this.reloadDatatable();
          this.toastr.success('Firmware Version updated successfully!');
        }
        else {
          this.toastr.error(res.errors[0].message);
        }
        this.spinner.hide();
        this.modalRef2.close();
      },
        err => {
          console.log(err);
          if (err.status == 500) {
            this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
          }
          else {
            this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
          }
          this.spinner.hide();
          this.modalRef2.close();
        }
      );
    }
  }



  deleteRecord(selectedItem) {
    this.spinner.show();
    this.appService.deleteFirmware(`/api/assets/deleteFirmwareVersion/${selectedItem}/${this.selectedAssetFirmId}`, '').subscribe(res => {
      if (res.status.success === true) {
        this.reloadDatatable();
        this.toastr.success('Firmware Version deleted successfully!');
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
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    }
    )
  }

  public reloadDatatable() {
    this.showDataTable = false;
    setTimeout(() => {
      this.showDataTable = true;
    }, 1);
  }

  searchAction($event) {
    console.log("$event", $event);
    this.searchquery = $event.query;
  }

}
