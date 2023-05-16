import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AssetsService } from '../../assets.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/components/alert-modal/alert.service';

@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddAssetComponent implements OnInit {
  editProd: boolean = false;
  disabledFlag:boolean = false;
  id: any = '';
  deviceLocations: any = [];
  deviceStatuses: any = [];
  public assetsForm: FormGroup;
  submitFlag: boolean = false;
  showOtherLocation: boolean;
  showOtherAssetType: boolean = false;
  showOtherAssetModel: boolean = false;
  assetTypes: any;
  modelList: any;
  firmwareList: any;
  assetRequiredType: any;
  firmList: any;
  pageEditStatuses: boolean =false;
  inValidFlag: boolean;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private assetsService: AssetsService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.getInitialData();
   
    this.activatedRoute.params.subscribe(async params => {
      const path = this.activatedRoute.snapshot.url[0].path;
      if (path !== 'edit') {
        this.pageEditStatuses=false;
        this.getStatusData();
        }
      if (path === 'edit') {
        
        this.spinner.show();
        this.editProd = true;
        this.assetsForm.controls['deviceLocationOthers'].setValidators([]);
        let str = this.router.url;
        this.id = str.split("edit/")[1].split("/")[0];
        this.assetsService.getAssetsService(`/api/assets/${this.id}`).subscribe(res => {
          if(res.response.deviceInfo.statusId ==4 || res.response.deviceInfo.statusId ==5 ){
          this.pageEditStatuses=true;
          this.getStatusData();
          }
          else{
            this.pageEditStatuses=false;
            this.getStatusData();
          }
          
          if (res.response.deviceInfo.deviceLocationId == 4) {
            this.showOtherLocation = true;
            // this.assetsForm.controls['deviceLocationOthers'].setValidators([Validators.required]);
          }
          else {
            this.showOtherLocation = false;
            // this.assetsForm.controls['deviceLocationOthers'].setValidators([]);

          }
          if (res.status.success === true) {
            console.log(res.response);
            let assetsData = res.response.deviceInfo;
            this.assetsService.getAssetsService(`/api/assets/getDeviceModelById/${assetsData.deviceType}`).subscribe(res => {
              if (res.status.success === true) {

                this.modelList = res.response.rows;
              }
              else {
                this.toastr.error(res.errors[0].message);
              }
              this.spinner.hide();
            }, err => {
              this.spinner.hide();
              this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
            });

            this.assetsService.getFirmwareList(`/api/assets/getAllFirmwareVersions/${assetsData.deviceType}/${assetsData.deviceModel}`, '').subscribe(res => {
              if (res.status.success === true) {

                this.firmList = res.response.firmwareVersions;
              }
              else {
                this.toastr.error(res.errors[0].message);
              }
              this.spinner.hide();
            }, err => {
              this.spinner.hide();
              this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
            });
            if (assetsData.mfgFirmware == "" || assetsData.mfgFirmware == null) {
              // this.assetsForm.controls['mfgFirmware'].enable();
              this.assetsForm.patchValue({
                disabledMfg : false
              })
            }
            else {
              // this.assetsForm.controls['mfgFirmware'].disable();
              this.assetsForm.patchValue({
                disabledMfg : true
              })
              
            }
            // this.assetsForm.controls['deviceType'].disable();
            // this.assetsForm.controls['deviceModel'].disable();
            this.assetsForm.patchValue({
              disabledDevice : true,
              disabledDeviceModel:true
            })
            if(assetsData.statusId==4 || assetsData.statusId==5){
              this.assetsForm.patchValue({
                disabledStatus : true
              })
            // this.assetsForm.controls['statusId'].disable();
            }
            this.assetsForm.patchValue({
              "deviceType": assetsData.deviceType,
              "deviceModel": assetsData.deviceModel,
              "deviceNumber": assetsData.deviceNumber,
              "deviceLocationId": assetsData.deviceLocationId,
              "deviceLocationOthers": assetsData.deviceLocationOthers,
              "mfgSerialNumber": assetsData.mfgSerialNumber,
              "mfgFirmware": assetsData.mfgFirmware,
              "mfgMacAddr": assetsData.mfgMacAddr ? assetsData.mfgMacAddr : '',
              "wifiMacAddr": assetsData.wifiMacAddr ? assetsData.wifiMacAddr : '',
              "trackingNumber": assetsData.trackingNumber ? assetsData.trackingNumber : '',
              "statusId": assetsData.statusId,
              "otherAssetType": assetsData.otherAssetType,
              "otherAssetModel": assetsData.otherAssetModel,

            })
            this.spinner.hide();
          }
        })
      }
      else {
        this.editProd = false;
      }

    });
    this.getAssetTypes()
  }
  getAssetTypes() {
    this.spinner.show();
    this.assetsService.getAssetsService('/api/assets/getAllAssetTypes').subscribe(res => {
      if (res.status.success === true) {
        this.assetTypes = res.response.assetTypeList;
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
    let asset = $event.target.value == "" ? "" : $event.target.value.split(':')[1].trim();

    if (asset == "Other") {
      this.showOtherAssetType = true;
      this.assetsForm.controls['otherAssetType'].setValidators([Validators.required]);
      // this.assetsForm.controls['deviceModel'].disable();
      this.assetsForm.patchValue({
        "deviceModel": 'Other',
        "disabledDeviceModel": true
      });
      this.showOtherAssetModel = true;
      this.assetsForm.controls['otherAssetModel'].setValidators([Validators.required]);

    }
    else {
      this.spinner.show();
      this.showOtherAssetType = false;
      this.assetsForm.controls['otherAssetType'].setValidators([]);
      this.assetsForm.controls['deviceModel'].enable();
      this.assetsForm.patchValue({
        "deviceModel": '',
      });
      this.showOtherAssetModel = false;
      this.assetsForm.controls['otherAssetModel'].setValidators([]);
      this.assetRequiredType = asset;
      if(!(asset=="")){
      this.assetsService.getAssetsService(`/api/assets/getDeviceModelById/${asset}`).subscribe(res => {
        if (res.status.success === true) {

          this.modelList = res.response.rows;
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
    else{
      this.modelList=[];
      this.spinner.hide();
    }
  }
  }

  ValidateSensor() { 

    let value = this.assetsForm.value.deviceNumber;
    // let value = document.getElementById(""txtSensorNumber"").value; 
    let tempValue; 
    // alert(value); 
    let thisIsValid = true; 
    if (value.length == 0) { 
        this.toastr.error("Enter Asset Number.");
        thisIsValid = false; 
        return false;
    } 
    if (thisIsValid) { 
        tempValue = value.replace(/_/g, '').replace(/-/g, ''); 
        if (new RegExp(/[^0-9A-F]/g).test(tempValue)) { 
            this.toastr.error("Please enter a valid Asset Number.");
            thisIsValid = false;
            this.inValidFlag = thisIsValid;
            return false;
        } 
    } 
    if (thisIsValid) { 
        if (value.replace(/_/g, '').length != 7) { 
            this.toastr.error("Please enter a valid Asset Number.");
            thisIsValid = false;
            this.inValidFlag = thisIsValid;
            return false;
        } 
    } 
    // alert(thisIsValid); 
    if (thisIsValid) { 
        let lastChar = tempValue.substr(tempValue.length - 1, 1); 
        // alert(lastChar); 
        tempValue = "0C8A87" + tempValue.substr(0, tempValue.length - 1); 
        // alert(tempValue); 
        let hex; 
        let sum = 0; 
        let n = 16; 
        let checkedChar:any; 
        for (let i = tempValue.length - 1; i >= 0; i--) { 
            let currentValue = 0; 
            let codePoint = parseInt(tempValue.substr(i, 1), n); 
            // alert(codePoint); 
            if ((i + 1) % 2 == 0) { 
                hex = (codePoint * 2).toString(n); 
                // alert(hex); 
                for (let j = 0; j < hex.length; j++) { 
                    if (isFinite(hex.substr(j, 1))) { 
                        currentValue += parseInt(hex.substr(j, 1)); 
                    } 
                    else { 
                        currentValue += parseInt(hex.substr(j, 1), n); 
                    }                            
                } 
            } 
            else { 
                currentValue += codePoint; 
            } 
            // alert(currentValue); 
            sum += currentValue; 
        } 
        if (sum % 16 > 0) { 
            checkedChar =  16 - (sum % 16); 
        } 
        else { 
            checkedChar = 0; 
        } 
        // alert(checkedChar.toString(n))
        // alert(checkedChar.toString(n).toUpperCase() + ' - ' + lastChar); 
        if (checkedChar.toString(n).toUpperCase() != lastChar) { 
            // $(curEle).data(""content"", ""Please enter a valid sensor number.""); 
            this.toastr.error("Please enter a valid Asset Number.")
            thisIsValid = false;
            this.inValidFlag = thisIsValid;
            return false; 
        } 
    }
    this.inValidFlag =  thisIsValid;
    return thisIsValid; 
} 


  changeDeviceModel($event) {
    let model = $event.target.value == "" ? "" : $event.target.value.split(':')[1].trim();

    // if($event.target.value == ""){
    //   this.toastr.error("Please select Asset Type as it is a mandatory field.")
    // }
    // this.assetsForm.controls['deviceModel'].enable();
    if (model == "Other") {
      this.showOtherAssetModel = true;
      this.assetsForm.controls['otherAssetModel'].setValidators([Validators.required]);
    }
    else {
      this.showOtherAssetModel = false;
      this.assetsForm.controls['otherAssetModel'].setValidators([]);
      this.spinner.show();
      if(!(model=="")){
      this.assetsService.getFirmwareList(`/api/assets/getAllFirmwareVersions/${this.assetRequiredType}/${model}`, '').subscribe(res => {
        if (res.status.success === true) {

          this.firmList = res.response.firmwareVersions;
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
    else{
      this.firmList=[];
    }
    }
  }
  getFirmwareList(type, model) {
    this.assetsService.getFirmwareList(`/api/assets/getAllFirmwareVersions/${type}/${model}`, '').subscribe(res => {
      console.log("ress", res);
      this.firmwareList = res.response.firmwareVersions;
    })
  }
  getInitialData() {
    this.assetsService.getAssetsService('/api/lookup/getDeviceLocations').subscribe(res => {
      if (res.status.success === true) {
        this.deviceLocations = res.response.deviceLocations;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
  }
  getStatusData() {
    this.assetsService.getAssetsService('/api/lookup/getDeviceStatuses').subscribe(res => {
      if (res.status.success === true) {
        if( this.pageEditStatuses===false){
          
          let filterIds =[4,5];
          this.deviceStatuses =res.response.deviceStatuses.filter(element => {

            return !filterIds.includes(element.deviceStatusId);
          });
        }
         if( this.pageEditStatuses===true){
          this.deviceStatuses = res.response.deviceStatuses;
         }
       // this.deviceStatuses = res.response.deviceStatuses;
        
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
  }

  
        
     
      
  public buildForm(): void {
    this.assetsForm = this.fb.group({
      deviceType: ['', [Validators.required]],
      deviceModel: ['', [Validators.required]],
      deviceNumber: ['', [Validators.required]],
      deviceLocationId: ['', [Validators.required]],
      deviceLocationOthers: [''],
      mfgSerialNumber: ['', [Validators.required]],
      mfgFirmware: [''],
      mfgMacAddr: [''],
      wifiMacAddr: [''],
      firmwareVersionNumber: [''],
      trackingNumber: [''],
      statusId: ['2', [Validators.required]],
      otherAssetType: [''],
      otherAssetModel: [''],
      disabledDevice: [''],
      disabledDeviceModel: [''],
      disabledMfg:[''],
      disabledStatus:['']
    })
  }

  backToList() {
    this.router.navigate(['/user/assets/management']);
  }
  clearOtherLocation($event) {
    let locationid = this.assetsForm.value.deviceLocationId;
    if (locationid !== 4) {
      this.showOtherLocation = false;
      this.assetsForm.controls['deviceLocationOthers'].setValidators([]);
    } else {
      this.showOtherLocation = true;
      this.assetsForm.controls['deviceLocationOthers'].setValidators([Validators.required]);
    }
  }
  submitForm() {
    console.log(this.assetsForm.valid);
    console.log("this.assetsForm.",this.assetsForm.value);
    if(this.assetsForm.value.deviceModel.includes("AGL") || this.assetsForm.value.deviceModel.includes("CMAS")) {
    this.ValidateSensor();

    if(!this.inValidFlag) {
      return false;
    }
  }
   
  if (!this.assetsForm.valid) {
    this.assetsForm.markAllAsTouched();
    return false;
  }
  
    this.submitFlag = true;
    if (this.editProd) {
      //let reqObject = Object.assign({});

      // reqObject["ticketId"] = this.id;
      let reqObject = this.assetsForm.getRawValue();
      reqObject["deviceId"] = this.id;
      this.spinner.show();
      this.assetsService.updateRecord('/api/assets', reqObject).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success('Asset updated successfully!');
          this.assetsForm.markAsPristine();
          this.backToList();
        }
        else {
          this.toastr.error(res.errors[0].message);
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        if (err.status == 500) {
          this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
        }
        else {
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
        }
      });
    } else {
      //let reqObject = Object.assign({});
      let reqObject = this.assetsForm.getRawValue();
      // reqObject["ticketTypeId"] = this.assetsForm.value.ticketTypeId;
      // reqObject["ticketTitle"] = this.assetsForm.value.ticketTitle;
      this.spinner.show();
      this.assetsService.addRecord('/api/assets', reqObject).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success('Asset added successfully!');
          this.assetsForm.markAsPristine();
          this.backToList();
        }
        else {
          this.toastr.error(res.errors[0].message);
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        if (err.status == 500) {
          this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
        }
        else {
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
        }
      });
    }
  }
  canDeactivate(component, route, state, next) {
    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if (next.url.indexOf('/user/assets/management/list') > -1 && this.submitFlag) {
      return true;
    }

    if (this.assetsForm.touched) { //pristine == false 
      return this.alertService.confirm();
    }
    else {
      return true;
    }
  }
}
