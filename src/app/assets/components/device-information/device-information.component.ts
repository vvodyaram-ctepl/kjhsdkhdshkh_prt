import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssetService } from 'src/app/services/util/asset.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserDataService } from 'src/app/services/util/user-data.service';


@Component({
  selector: 'app-device-information',
  templateUrl: './device-information.component.html',
  styleUrls: ['./device-information.component.scss']
})
export class DeviceInformationComponent implements OnInit {

  headers: any;
  public showDataTable: boolean = true;
  firmForm: FormGroup;
  modalRef2: NgbModalRef;
  selectable: object = {
    title: '',
    selectAll: true
  };
  @ViewChild('archiveContent') archiveContent: ElementRef;
  filterTypeArr: any[];
  firmwareList: any;
  devArr: any[];
  RWFlag: boolean;
  assetArr: any[];
  assetCheckValid: boolean = false;
  assetModelArr: any;
  assetModelCheckValid: any;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private assetservice: AssetService,
    private toastr: ToastrService,
    private userDataService: UserDataService
  ) {
    this.firmForm = this.fb.group({
      'firmwareVersion': ['', [Validators.required]],
      'firmwareVersionId': '',
      'ModifedBy': ''
    })
  }

  ngOnInit() {
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "19") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }
    this.headers = [
      { key: "deviceNumber", label: "Asset Number", checked: true, sortable : true },
      { key: "deviceModel", label: "Asset Model", checked: true, sortable : true },
      { key: "deviceType", label: "Asset Type", checked: true, sortable : true },
      { key: "location", label: "Location", checked: true, sortable : true },
      { key: "mfgSerialNumber", label: "Serial Number", checked: true },
      { key: "firmwareVersionNumber", label: "Current Firmware", checked: true },
      { key: "mfgMacAddr", label: "Bluetooth MAC", checked: true },
      { key: "wifiMacAddr", label: "Wifi MAC", checked: true },
      // { key: "firmwareVersionNumber", label: "Device Firmware", checked: true, width: 80 },
      // { key: "trackingNumber", label: "Tracking Number", checked: true }
    ];
    this.filterTypeArr =
      [
        {
          name: "Asset Type",
          id: "deviceType"
        },
        {
          name: "Asset Location",
          id: "location"
        },
        {
          name: "Asset Model",
          id: "Model"
        }
      ];
    
  }

  public reloadDatatable() {
    this.showDataTable = false;
    setTimeout(() => {
      this.showDataTable = true;
    }, 1);
  }

  onSubmit() {
    console.log("Sdjsb", this.firmForm.value.firmwareVersion);
    console.log("valid", this.firmForm.valid);
    console.log("Sds");
    Object.keys(this.firmForm.controls).forEach(key => {
      this.firmForm.controls[key].markAsTouched();
    });

    if (this.firmForm.valid) {
      this.spinner.show();


      let fid = this.firmForm.value.firmwareVersion
      this.assetservice.updateFirmware(`/api/assets/updateDeviceFirmware/${fid}/${this.devArr.toString()}`, {}).subscribe(res => {
        console.log("resss", res);
        if (res.status.success === true) {
          this.reloadDatatable();
          this.spinner.hide();
          this.toastr.success('Firmware Version updated successfully!');
        }
        else {
          this.spinner.hide();
          this.toastr.error(res.errors[0].message);
        }
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
          this.modalRef2.close();
          this.spinner.hide();
        }
      )
    }


  }
  selectedRecords($event) {
    console.log("$event", $event);
    if ($event) {
      this.devArr = [];
      $event.forEach(ele => {
        this.devArr.push(ele.deviceId);
      })
    }
  }
  selectedRecordsForVersion($event) {
    console.log("$event", $event);
    if ($event) {
      this.assetArr = [];
      this.assetModelArr = []   
      
        $event.forEach(ele => {
          this.assetArr.push(ele.deviceType);
          this.assetModelArr.push(ele.deviceModel)
        })
    //     let indexValue=this.assetArr.length;
    //     for (let i = 0; i < indexValue-1; i++) {
    //   this.assetArr.find({this.assetArr.indexOf[i]}) =>{

    //   })
    
     }

     
  }
  lowerCaseModelFunction(){
    console.log(this.assetModelArr)
  let j = this.assetModelArr.length;
  while ( --j >= 0 ) {
    console.log(this.assetModelArr[j]);
    console.log(typeof this.assetModelArr[j]);
      if ( typeof this.assetModelArr[j] === "string" ) {
        this.assetModelArr[j] = this.assetModelArr[j].toLowerCase();
      }
      
    }
    return this.assetModelArr;
  }
  lowerCaseFunction(){
    console.log(this.assetArr)
  let i = this.assetArr.length;
  while ( --i >= 0 ) {
    console.log(this.assetArr[i]);
    console.log(typeof this.assetArr[i]);
      if ( typeof this.assetArr[i] === "string" ) {
        this.assetArr[i] = this.assetArr[i].toLowerCase();
      }
      
    }
    return this.assetArr;
  }
  checkAssetType(){
    // let values: (string)[] = this.assetArr;
    
    const allEqual =  this.assetArr.every(v => v ==this.assetArr[0]);
    console.log(allEqual);
    this.assetCheckValid =allEqual;
    // ?allEqual(this.assetArr);
  }

  checkAssetModel(){
    // let values: (string)[] = this.assetArr;
    
    const allEqual =  this.assetModelArr.every(v => v ==this.assetModelArr[0]);
    console.log(allEqual);
    this.assetModelCheckValid =allEqual;
    // ?allEqual(this.assetArr);
  }

  getFirmwareList(type,model) {
    this.assetservice.getFirmwareList(`/api/assets/getAllFirmwareVersions/${type}/${model}`,'').subscribe(res => {
      console.log("ress", res);
      this.firmwareList = res.response.firmwareVersions;
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

  addNew() {

  }
  updateFirm() {
    console.log(this.assetArr)
    this.assetArr=this.lowerCaseFunction();
    this.assetModelArr= this.lowerCaseModelFunction();
    this.checkAssetType();
    this.checkAssetModel();
    
    if((!this.assetCheckValid) || (!this.assetModelCheckValid)){
      
      this.toastr.error("Selected assets should be of same asset type and asset model.")
      return false;
    }
    if (this.devArr.length != 0) {
      this.getFirmwareList(this.assetArr[0], this.assetModelArr[0]);
      this.openPopup(this.archiveContent, 'xs');
      this.firmForm.reset();
      this.firmForm.patchValue({
        firmwareVersion: ''
      })
    }
    else {
      this.toastr.error("Please select at least one record to update firmware version.")
    }
  }

  fmSelect() {
    console.log("firmForm.value.firmwareVersion", this.firmForm.value.firmwareVersion);
  }
}
