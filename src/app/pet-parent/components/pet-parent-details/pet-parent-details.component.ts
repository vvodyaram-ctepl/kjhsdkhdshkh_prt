import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PetParentService } from '../../pet-parent.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { ValidationService } from 'src/app/components/validation-message/validation.service';
import { AlertService } from 'src/app/components/alert-modal/alert.service';

@Component({
  selector: 'app-pet-parent-details',
  templateUrl: './pet-parent-details.component.html',
  styleUrls: ['./pet-parent-details.component.scss']
})
export class PetParentDetailsComponent implements OnInit {
  addPetParentForm: FormGroup;
  statuses: any = [];
  submitFlag: boolean = false;
  editFlag: boolean = false;
  editId: string;
  viewFlag: boolean = false;
  petParentDetails: any = [];
  isRecordSaved = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private petParentService: PetParentService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private tabservice: TabserviceService,
    private customDatePipe: CustomDateFormatPipe,
    private alertService: AlertService
  ) {

    this.addPetParentForm = this.fb.group({
      // 'petParentName': [''],
      'petParentFirstName': ['', [ValidationService.whiteSpaceValidator,ValidationService.exceptSpecialChar]],
      'petParentLastName': ['', [Validators.required, ValidationService.whiteSpaceValidator,ValidationService.exceptSpecialChar]],
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      'status': ['', [Validators.required]],
      'phoneNumberCode': '',
      'phoneNumberValue': [''],
      'address': ['', [ValidationService.whiteSpaceValidator]],
    })
    //(123)343-2333 phone number format
  }

  formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ')' + match[2] + '-' + match[3];
    }
    return null;
  }
  formatPhoneNumberUk(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^[0-9]{2}-[0-9]{4}-[0-9]{4}$/);
    if (match) {
      return '(' + match[1] + ')' + match[2] + '-' + match[3];
    }
    return null;
  }
  removeSpaces(val){
    if(val)
    return val.replace(/\s/g, '')
  }

  ngOnInit(): void {

    this.getInitialdata();

    //check for edit and view
    if (this.router.url.indexOf('/edit-pet-parent') > -1 || this.router.url.indexOf('/view-pet-parent') > -1) {
      console.log("this.router.url", this.router.url);
      let str = this.router.url;
      if (this.router.url.indexOf('/edit-pet-parent') > -1) {
        let id = str.split("edit-pet-parent/")[1].split("/")[0];
        this.editFlag = true;
        this.editId = id;
      }
      if (this.router.url.indexOf('/view-pet-parent') > -1) {
        let id = str.split("view-pet-parent/")[1].split("/")[0];
        this.viewFlag = true;
        this.editId = id;
      }


      let data = this.tabservice.getModelData() ? this.tabservice.getModelData() : {}
      if (Object.keys(data).length == 0) {
        this.spinner.show();
        this.petParentService.getPetParentService(`/api/petParents/${this.editId}`).subscribe(res => {
          console.log("", res);
          console.log("petparent edit::", res);
          if (res.status.success == true) {
            let ppDetails = res.response.petParent;
            this.petParentDetails = res.response.petParent;

            let editData1 = Object.assign({});
            let phone = ppDetails.phoneNumber ? ppDetails.phoneNumber : '';
            if (phone) {
              if (phone.includes("US")) {
                phone = phone.replace("US", "");
              }
              if (phone.includes("UK")) {
                phone = phone.replace("UK", "");
              }
              // if (phone.includes("+1(")) {
              //   phone = phone.replace("+1(", "(+1)(");
              // }
              // if (phone.includes("+44(")) {
              //   phone = phone.replace("+1(", "(+44)(");
              // }
              console.log("phonephone", phone)
             
              if(phone.includes("+1")) {
                console.log("us number");
                let phoneArr = phone ? phone.toString().split("+1") : '';
                console.log("phoneArr[0]",phoneArr[0]);
                console.log(phoneArr[1]);
                editData1["phoneNumberCode"] = '+1';
                editData1["phoneNumberValue"] = phoneArr[1] ? phoneArr[1] : '';
              }
              else if(phone.includes("+44")) {
                console.log("uk number");
                let phoneArr = phone ? phone.toString().split("+44") : '';
                editData1["phoneNumberCode"] = '+44';
                editData1["phoneNumberValue"] = phoneArr[1] ? phoneArr[1] : '';
              }
              else {
                console.log("us number");
                editData1["phoneNumberCode"] = '+1';
                editData1["phoneNumberValue"] = this.formatPhoneNumber(phone) ? this. formatPhoneNumber(phone) : '';

              }
            }
            else {
              editData1["phoneNumberCode"] = '+1';
              editData1["phoneNumberValue"] = '';
            }
            //  editData1["petParentName"] = ppDetails.petParentName ? ppDetails.petParentName : '';
            editData1["petParentFirstName"] = ppDetails.firstName ? ppDetails.firstName : '';
            editData1["petParentLastName"] = ppDetails.lastName ? ppDetails.lastName : '';

            editData1["email"] = ppDetails.email ? ppDetails.email : '';
            editData1["status"] = ppDetails.status;
            editData1["address"] = ppDetails.shippingAddress ? ppDetails.shippingAddress : '';
            editData1["petParentId"] = ppDetails.petParentId;
            this.tabservice.setModelData(editData1, 'parentDetails');

            let editData2Arr = [];
            ppDetails.petsAssociated.forEach(ele => {
              editData2Arr.push({
                "petName": ele.petName,
                "breedName": ele.breedName,
                "gender": ele.gender ? ele.gender : '',
                "petId": ele.petId,
                "petStatus" : ele.petStatus ? ele.petStatus : ''
              });
            })
            this.tabservice.setModelData(editData2Arr, 'associatePet');
          }
          else {
            this.toastr.error(res.errors[0].message);
          }
          this.spinner.hide();
        }, err => {
          this.spinner.hide();
          console.log(err);
          this.errorMsg(err);
        }
        );
      }
    }
    
  }

  phoneCodeChange() {
    if(this.addPetParentForm.value.phoneNumberCode == '+1') {
      this.addPetParentForm.controls['phoneNumberValue'].setValidators([ValidationService.usPhoneValidator]);
    this.addPetParentForm.controls['phoneNumberValue'].updateValueAndValidity();
    }
    else {
      this.addPetParentForm.controls['phoneNumberValue'].setValidators([ValidationService.ukPhoneValidator]);
      this.addPetParentForm.controls['phoneNumberValue'].updateValueAndValidity();
    }
    this.addPetParentForm.patchValue({
      'phoneNumberValue': ''
    })
  }

  getInitialdata() {
    this.spinner.show();
    this.petParentService.getPetParentService('/api/lookup/getPetStatuses').subscribe(res => {
      if (res.status.success === true) {
        console.log(res);
        this.statuses = res.response.petStatuses;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.toastr.error(err.error.errors[0] ?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
  }
  errorMsg(err) {
    this.spinner.hide();
    if (err.status == 500) {
      this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
    }
    else {
      this.toastr.error(err.error.errors[0] ?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    }
  }

  submit() {
    if(this.addPetParentForm.value.phoneNumberValue == '(') {
      this.addPetParentForm.patchValue({
        phoneNumberValue:''
      })
    }
    if(this.addPetParentForm.value.phoneNumberValue){
      if(this.addPetParentForm.value.phoneNumberCode == '+1') {
        this.addPetParentForm.controls['phoneNumberValue'].setValidators([ValidationService.usPhoneValidator]);
      this.addPetParentForm.controls['phoneNumberValue'].updateValueAndValidity();
      }
      else {
        this.addPetParentForm.controls['phoneNumberValue'].setValidators([ValidationService.ukPhoneValidator]);
        this.addPetParentForm.controls['phoneNumberValue'].updateValueAndValidity();
      }
    }
    else {
      this.addPetParentForm.controls['phoneNumberValue'].setValidators([]);
      this.addPetParentForm.controls['phoneNumberValue'].updateValueAndValidity();
    }
    this.addPetParentForm.markAllAsTouched();
      if (this.addPetParentForm.valid) {
    let res = Object.assign({});

    // let data = this.tabservice.getModelData();
    // console.log(data);

    // this.tabservice.setModelData(json, 'parentDetails');
    let data = this.addPetParentForm.value;

    if (this.editFlag) {
      res["petParentId"] = this.editId;
    }
    //res["petParentName"] = data.petParentName;
    res["petParentFirstName"] = data.petParentFirstName;
    res["petParentLastName"] = data.petParentLastName;
    res["email"] = data.email;
    // res["status"] = data.status;
    res["isActive"] = data.status == '1' ? true : false;
    res["phoneNumber"] = data.phoneNumberValue ? (data.phoneNumberCode + data.phoneNumberValue) : '';
    res["shippingAddress"] = data.address;
    res["status"] = parseInt(data.status);


    this.submitFlag = true;
 

    if (!this.editFlag) {

      this.spinner.show();
      this.petParentService.addPetParentService('/api/petParents', res).subscribe(res => {
        if (res.status.success === true) {
          this.isRecordSaved = true;
          this.toastr.success('Pet Parent added successfully!');
          this.spinner.hide();
          this.tabservice.clearDataModel();
          this.router.navigate(['/user/petparent']);
        }
        else {
          this.toastr.error(res.errors[0].message);
          this.spinner.hide();
        }
      }, err => {
        console.log(err);
        this.errorMsg(err);
      });
    }
    else {
      this.spinner.show();
      this.petParentService.updatePetParentService('/api/petParents', res).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success('Pet Parent updated successfully!');
          this.spinner.hide();
          this.tabservice.clearDataModel();
          this.router.navigate(['/user/petparent']);
        }
        else {
          this.toastr.error(res.errors[0].message);
          this.spinner.hide();
        }
      }, err => {
        console.log(err);
        this.errorMsg(err);
      });

    }
  }
  }

  next() {
   
    if(this.addPetParentForm.value.phoneNumberValue == '(') {
      this.addPetParentForm.patchValue({
        phoneNumberValue:''
      })
    }
    if(this.addPetParentForm.value.phoneNumberValue){
      if(this.addPetParentForm.value.phoneNumberCode == '+1') {
        this.addPetParentForm.controls['phoneNumberValue'].setValidators([ValidationService.usPhoneValidator]);
      this.addPetParentForm.controls['phoneNumberValue'].updateValueAndValidity();
      }
      else {
        this.addPetParentForm.controls['phoneNumberValue'].setValidators([ValidationService.ukPhoneValidator]);
        this.addPetParentForm.controls['phoneNumberValue'].updateValueAndValidity();
      }
    }
    else {
      this.addPetParentForm.controls['phoneNumberValue'].setValidators([]);
      this.addPetParentForm.controls['phoneNumberValue'].updateValueAndValidity();
    }
    this.addPetParentForm.markAllAsTouched();
    if (this.addPetParentForm.valid) {
      this.submitFlag = true;
      let data = this.tabservice.getModelData();
      let json = this.addPetParentForm.value;
      if (this.editFlag) {
        json['petParentId'] = data.parentDetails.petParentId;
      }
      this.tabservice.setModelData(json, 'parentDetails');

      console.log("datadatadata", data);
      console.log("datadatadata json", json);
      if (this.editFlag) {
        this.router.navigate([`/user/petparent/edit-pet-parent/${this.editId}/associate-pet`]);
      }
      else if (this.viewFlag) {
        this.router.navigate([`/user/petparent/view-pet-parent/${this.editId}/associate-pet`]);
      }
      else {
        this.router.navigate(['/user/petparent/add-pet-parent/associate-pet']);
      }
    }
    else {
      this.submitFlag = false;
    }
  }

  ngAfterViewInit() {

    this.tabservice.dataModel$.subscribe(res => {
      let data = this.tabservice.getModelData() ? this.tabservice.getModelData() : {};
      console.log("dattaaaa", data);
      if (!(data.hasOwnProperty('parentDetails'))) {
        this.addPetParentForm.patchValue({
          'status': 1,
          'phoneNumberCode': '+1'
        });
        //   this.addPetParentForm.controls['phoneNumberValue'].setValidators([ValidationService.usPhoneValidator]);
        // this.addPetParentForm.controls['phoneNumberValue'].updateValueAndValidity();
        
      }
      else {
        res = res ? (res['parentDetails'] ? res['parentDetails'] : '') : '';
        console.log("edit data", res);
        console.log(this.removeSpaces(res.phoneNumberValue))
        this.addPetParentForm.patchValue({
          // 'petParentName': res.petParentName ? res.petParentName : '',
          'petParentFirstName': res.petParentFirstName ? res.petParentFirstName : '',
          'petParentLastName': res.petParentLastName ? res.petParentLastName : '',
          'email': res.email ? res.email : '',
          'status': res.status,
          'phoneNumberCode': res.phoneNumberCode ? res.phoneNumberCode : '',
          'phoneNumberValue': res.phoneNumberValue ? this.removeSpaces(res.phoneNumberValue) : '',
          'address': res.address ? res.address : '',
        });
        // if(this.addPetParentForm.value.phoneNumberCode == '+1') {
        //   this.addPetParentForm.controls['phoneNumberValue'].setValidators([ValidationService.usPhoneValidator]);
        // this.addPetParentForm.controls['phoneNumberValue'].updateValueAndValidity();
        // }
        // else {
        //   this.addPetParentForm.controls['phoneNumberValue'].setValidators([ValidationService.ukPhoneValidator]);
        //   this.addPetParentForm.controls['phoneNumberValue'].updateValueAndValidity();
        // }
      }
    });

   
  }

  canDeactivate(component, route, state, next) {
    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if(this.isRecordSaved){
      return true;
    }
    if (!this.editFlag && next.url.indexOf('/user/petparent') > -1) {
      let data = this.tabservice.getModelData() ? this.tabservice.getModelData() : {}
      console.log("Data", data, data.length)
      if (this.addPetParentForm.pristine == false || (data.length && Object.keys(data).length > 0)) {
        return this.alertService.confirm();
      }
      else {
        return true
      }
    }
    
    if ((next.url.indexOf('/petparent/add-pet-parent') > -1 || next.url.indexOf('/petparent/edit-pet-parent') > -1)) {
      //logic for validations
      if(this.addPetParentForm.value.phoneNumberValue == '(') {
        this.addPetParentForm.patchValue({
          phoneNumberValue:''
        })
      }
      if(this.addPetParentForm.value.phoneNumberValue){
        if(this.addPetParentForm.value.phoneNumberCode == '+1') {
          this.addPetParentForm.controls['phoneNumberValue'].setValidators([ValidationService.usPhoneValidator]);
        this.addPetParentForm.controls['phoneNumberValue'].updateValueAndValidity();
        }
        else {
          this.addPetParentForm.controls['phoneNumberValue'].setValidators([ValidationService.ukPhoneValidator]);
          this.addPetParentForm.controls['phoneNumberValue'].updateValueAndValidity();
        }
      }
      else {
        this.addPetParentForm.controls['phoneNumberValue'].setValidators([]);
        this.addPetParentForm.controls['phoneNumberValue'].updateValueAndValidity();
      }
      //logic for validations
      this.addPetParentForm.markAllAsTouched();
      if (this.addPetParentForm.valid) {
        this.submitFlag = true;
        let json = this.addPetParentForm.value;
        let data = this.tabservice.getModelData();
        if (this.editFlag) {
          json['petParentId'] = data.parentDetails.petParentId;
        }
        this.tabservice.setModelData(json, 'parentDetails');
        //this.tabservice.setModelData(this.addPetParentForm.value, 'parentDetails');

        console.log("datadatadata", data);
      }
      else {
        this.submitFlag = false;
      }
    }
    else {
      let data = this.tabservice.getModelData() ? this.tabservice.getModelData() : {}
      console.log("Data", data, data.length)
      if (this.addPetParentForm.touched) { //this.addPetParentForm.pristine == false || Object.keys(data).length > 0
        return this.alertService.confirm();
      }
      else {
        return true
      }
    }

    
    if (!this.submitFlag) {
      return false;
    }
    else {
      return true;
    }
  }


}
