// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-add-shipment',
//   templateUrl: './add-shipment.component.html',
//   styleUrls: ['./add-shipment.component.scss']
// })
// export class AddShipmentComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/components/alert-modal/alert.service';
import { AssetsService } from 'src/app/assets/components/assets.service';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { ValidationService } from 'src/app/components/validation-message/validation.service';

@Component({
  selector: 'app-add-shipment',
  templateUrl: './add-shipment.component.html',
  styleUrls: ['./add-shipment.component.scss'],
encapsulation: ViewEncapsulation.None
})

export class AddShipmentComponent implements OnInit {
  shipmentCompanies: any;
  public assetsForm: FormGroup;
  submitFlag: boolean;
  unConfiguredAssetList: any;
  editProd: boolean;
  trackingId: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private assetsService: AssetsService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private userService:UserDataService,
    public customDatePipe: CustomDateFormatPipe
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.getInitialData();
    this.activatedRoute.params.subscribe(async params => {
      const path = this.activatedRoute.snapshot.url[0].path;
      console.log("params",params, path)
      if (path == 'edit') {
        this.editProd = true;
        let str = this.router.url;
        this.trackingId = str.split("edit/")[1].split("/")[0];
      }
      else {
        this.editProd = false;
      }
      this.patchData(params, path);
      })
  }


  patchData(params, path): void {
    if (params.id) {
      this.assetsService.getAssetsService(`/api/shipments/${params.id}`).subscribe(res => {
        if (res.status.success === true) {
          let trackDetails = res.response.shipment;
          if (path === 'edit') {
            this.assetsForm.patchValue({
              "assetId": { "deviceId": trackDetails.deviceId, "deviceNumber": trackDetails.deviceNumber },
              "petId":trackDetails.petName,
              "shipmentCompany":trackDetails.shipmentCompanyId,
              "shipTrackingId":trackDetails.trackingNumber,
              "shipDate": this.customDatePipe.transform(trackDetails.shipmentDate, 'MM-dd-yyyy')
              
            })
          }
        }
      })
    }
  }

  getInitialData() {
    // GET /lookup/getShipmentCompanies
    this.assetsService.getAssetsService('/api/lookup/getShipmentCompanies').subscribe(res => {
      if (res.status.success === true) {
        this.shipmentCompanies = res.response.shipmentCompanies;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });

      // GET /lookup/getShipmentCompanies
      this.assetsService.getAssetsService('/api/assets/getUnConfiguredDevices').subscribe(res => {
        if (res.status.success === true) {
          this.unConfiguredAssetList = res.response.unConfiguredAssetList;
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
      assetId: ['', [Validators.required]],
      petId: [''],
      shipmentCompany: ['', [Validators.required]],
      shipTrackingId: ['', [Validators.required, ValidationService.alphaNumeric]],
      shipDate:['', [Validators.required]]
    })
  }

  backToList() {
    this.router.navigate(['/user/shipment']);
  }
  
  changeDeviceType($event) {
    let asset = $event;
    console.log("asset",asset);
    this.assetsForm.patchValue({
      petId:asset.petName
    })
    //  this.firmForm.controls['assetModel'].enable();

  }
  clearModel() {
    this.assetsForm.patchValue({
      petId:''
    })
  }

  submitForm() {
    if (!this.assetsForm.valid) {
      this.assetsForm.markAllAsTouched();
      return false;
    }
    this.submitFlag = true;
    let form = this.assetsForm.value;
    let res = Object.assign({});
    res['createdBy'] = parseInt(this.userService.getUserId());
    res["petName"] = form.petId ? form.petId : '';
    res["petId"] = form.assetId.petId ? parseInt(form.assetId.petId) : '';
    
    res["deviceId"] = form.assetId.deviceId;
    res["deviceNumber"] = form.assetId.deviceNumber;
    res["trackingNumber"] = form.shipTrackingId;
    res["shipmentCompanyId"] = form.shipmentCompany;
    res["status"] = "In-Transit";
    res["shipmentDate"] = this.customDatePipe.transform(form.shipDate, 'yyyy-MM-dd');
    
    console.log("resss",res);

    if (this.editProd) {
      res['modifiedBy'] = parseInt(this.userService.getUserId());
      res['deviceShipmentId'] = parseInt(this.trackingId);
      this.assetsService.updateRecord('/api/shipments', res).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success('Shipment updated successfully!');
          this.assetsForm.markAsPristine();
          this.backToList();
        }
        else {
          this.toastr.error(res.errors[0].message);
        }
      }, err => {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
      });
    }
    else {
    this.assetsService.addRecord('/api/shipments', res).subscribe(res => {
      if (res.status.success === true) {
        this.toastr.success('Shipment added successfully!');
        this.assetsForm.markAsPristine();
        this.backToList();
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
    });
  }

  }
   
  canDeactivate(component, route, state, next) {
    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if (next.url.indexOf('/user/shipment') > -1 && this.submitFlag) {
      return true;
    }

    if (this.assetsForm.touched) { //this.assetsForm.pristine == false || this.assetsForm.dirty == false
      return this.alertService.confirm();
    }
    else {
      return true;
    }
  }
}
