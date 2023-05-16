import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PetService } from '../../pet.service';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from 'src/app/components/validation-message/validation.service';
import { AlertService } from 'src/app/components/alert-modal/alert.service';


@Component({
  selector: 'app-pet-parent-info',
  templateUrl: './pet-parent-info.component.html',
  styleUrls: ['./pet-parent-info.component.scss']
})
export class PetParentInfoComponent implements OnInit {
  recordtype: number = 1;
  headers: any;
  newPetheaders: any;
  dataArr: any[];
  petInfoForm: FormGroup;
  existingpetInfoForm: FormGroup;
  arr: FormArray;
  petParentArrList: any;
  existingPetParentArr: any[] = [];
  newPetParentArr: any[] = [];
  editFlag: boolean = false;
  editId: string;
  submitFlag: boolean = false;
  removedPetParents = [];
  addFilterFlag: boolean = true;
  internalStudy: boolean = true;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private tabservice: TabserviceService,
    private spinner: NgxSpinnerService,
    private petService: PetService,
    private toastr: ToastrService,
    private alertService: AlertService
  ) {

  }

  ngOnInit() {
    if (this.router.url.indexOf('/edit-patient') > -1) {
      console.log("this.router.url", this.router.url);
      let str = this.router.url;
      let id = str.split("edit-patient/")[1].split("/")[0];
      this.editFlag = true;
      this.editId = id;
    }

    this.existingpetInfoForm = this.fb.group({
      'petParent': ['', [Validators.required]],
    })

    this.petInfoForm = this.fb.group({
      // 'ppName': ['', [Validators.required]],
      'petParentFirstName': ['', [ValidationService.whiteSpaceValidator, ValidationService.exceptSpecialChar]],
      'petParentLastName': ['', [Validators.required, ValidationService.whiteSpaceValidator, ValidationService.exceptSpecialChar]],
      'ppEmail': ['', [Validators.required, ValidationService.emailValidator]],
      'phoneNumberCode': '',
      'phoneNumberValue': [''],
      'addr': ['']
    });
    this.spinner.show();
    this.petService.getPet('/api/petParents/getPetParents', '').subscribe(res => {
      console.log("res", res);
      this.petParentArrList = res.response.petParentList;
      this.spinner.hide();
    },
      err => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
      }
    );

    this.headers = [
      // { label: "S.No", key:"serialNumber" , checked: true, clickable: true },
      { label: "Pet Parent Name", key: "petParentName", checked: true },
      { label: "Pet Parent Email", key: "petParentEmail", checked: true },
      { label: "Mobile", key: "phone", checked: true },
      { label: "Shipping Address", key: "address", checked: true },
      { label: "", checked: true, clickable: true, width: 85 },
    ];

    this.newPetheaders = [
      // { label: "S.No", key:"serialNumber" , checked: true, clickable: true },
      { label: "Pet Parent Name", key: "petParentName", checked: true },
      { label: "Pet Parent Email", key: "petParentEmail", checked: true },
      { label: "Mobile", key: "phone", checked: true },
      { label: "Shipping Address", key: "address", checked: true },
      { label: "", checked: true, clickable: true, width: 85 }
    ];


    // this.tabservice.dataModel$.subscribe(res => {
    let res = this.tabservice.getModelData() ? this.tabservice.getModelData() : {}
    console.log(res);
    console.log(res);
    if (!res || (res && !res.petInfo)) {
      if (!this.editFlag)
        this.router.navigate(['/user/patients/add-patient/pet-info']);
      else
        this.router.navigate([`/user/patients/edit-patient/${this.editId}/pet-info`]);
      return;
    }
    //   res = res ? (res['petParentInfo'] ? res['petParentInfo'] : '') : '';
    //   console.log("petParentInfo", res);
    //   if(res) {
    //   this.existingPetParentArr = res;
    // } 

    let existingArr = res ? (res['petExistingArr'] ? res['petExistingArr'] : '') : '';
    if (existingArr) {
      this.existingPetParentArr = existingArr;
    }
    let newArr = res ? (res['petNewArr'] ? res['petNewArr'] : '') : '';
    if (newArr) {
      this.newPetParentArr = newArr;
    }

    //setting status as on study
    let data = this.tabservice.getModelData();
    console.log("datadatadata", data);

    if (Object.keys(data.petInfo).length > 0) {
      if (data.petInfo.status == '3') {
        this.addFilterFlag = false;
      }
    }
    //setting status as on study

    //checking Pet Study external or not

    if (Object.keys(data.petStudy).length > 0) {
      console.log("data.petStudy.arr", data.petStudy.arr[0].isExternal);
      if (data.petStudy.arr[0].isExternal == false) {
        this.internalStudy = true;
      }
      else {
        this.internalStudy = false;
      }
    }
    //checking Pet Study external or not

    // })

  }

  phoneCodeChange() {
    if (this.petInfoForm.value.phoneNumberCode == '+1') {
      this.petInfoForm.controls['phoneNumberValue'].setValidators([ValidationService.usPhoneValidator]);
      this.petInfoForm.controls['phoneNumberValue'].updateValueAndValidity();
    }
    else {
      this.petInfoForm.controls['phoneNumberValue'].setValidators([ValidationService.ukPhoneValidator]);
      this.petInfoForm.controls['phoneNumberValue'].updateValueAndValidity();
    }
    this.petInfoForm.patchValue({
      'phoneNumberValue': ''
    })
  }

  deleteExPetArr(list) {
    console.log(list);
    console.log(this.existingPetParentArr);
    this.existingPetParentArr.forEach((ele, i) => {
      if (list.ppId != undefined && list.ppId == ele.ppId) {
        this.existingPetParentArr.splice(i, 1);
        if (this.editFlag) {
          this.removedPetParents.push(ele.ppId);
        }
      }
    })
    console.log(this.removedPetParents);
  }
  deleteNewPetArr(list) {
    console.log(list);
    console.log(this.newPetParentArr);
    this.newPetParentArr.forEach((ele, i) => {
      if (list.ppEmail != undefined && list.ppEmail == ele.ppEmail) {
        this.newPetParentArr.splice(i, 1);
      }
    })
  }
  editNewPet(list) {
    console.log(list);
    this.petInfoForm.patchValue({
      'petParentFirstName': list.petParentFirstName,
      'petParentLastName': list.petParentLastName,
      'ppEmail': list.ppEmail,
      'phoneNumberCode': list.phoneNumberCode,
      'phoneNumberValue': list.phoneNumberValue,
      'addr': list.addr
    })
  }
  newPetSubmit() {
    if (this.petInfoForm.value.phoneNumberValue == '(') {
      this.petInfoForm.patchValue({
        phoneNumberValue: ''
      })
    }
    if (this.petInfoForm.value.phoneNumberValue) {
      if (this.petInfoForm.value.phoneNumberCode == '+1') {
        this.petInfoForm.controls['phoneNumberValue'].setValidators([ValidationService.usPhoneValidator]);
        this.petInfoForm.controls['phoneNumberValue'].updateValueAndValidity();
      }
      else {
        this.petInfoForm.controls['phoneNumberValue'].setValidators([ValidationService.ukPhoneValidator]);
        this.petInfoForm.controls['phoneNumberValue'].updateValueAndValidity();
      }
    }
    else {
      this.petInfoForm.controls['phoneNumberValue'].setValidators([]);
      this.petInfoForm.controls['phoneNumberValue'].updateValueAndValidity();
    }
    this.petInfoForm.markAllAsTouched();
    if (this.petInfoForm.valid) {
      console.log("this.petInfoForm", this.petInfoForm.value);
      let duplicateRecord = false;
      let newPetForm = this.petInfoForm.value;
      //check for duplicates with the array list
      this.newPetParentArr && this.newPetParentArr.forEach(ele => {
        if (ele.ppEmail == newPetForm.ppEmail) {
          duplicateRecord = true;
          this.toastr.error("Pet Parent" + " " + ele.ppEmail + " " + "already mapped");
          this.petInfoForm.patchValue({
            // 'ppName': '',
            'petParentFirstName': '',
            'petParentLastName': '',
            'ppEmail': '',
            'phoneNumberCode': '+1',
            'phoneNumberValue': '',
            'addr': ''
          });
          this.petInfoForm.markAsUntouched();
        }
      })
      console.log(this.newPetParentArr.length, duplicateRecord);
      if (!duplicateRecord || this.newPetParentArr.length == 0) {
        this.newPetParentArr.push({
          // "ppName": newPetForm.ppName, 
          'petParentFirstName': newPetForm.petParentFirstName,
          'petParentLastName': newPetForm.petParentLastName,
          "ppEmail": newPetForm.ppEmail,
          "phoneNumberCode": newPetForm.phoneNumberCode,
          "phoneNumberValue": newPetForm.phoneNumberValue,
          "addr": newPetForm.addr
        });
        this.petInfoForm.patchValue({
          // 'ppName': '',
          'petParentFirstName': '',
          'petParentLastName': '',
          'ppEmail': '',
          'phoneNumberCode': '+1',
          'phoneNumberValue': '',
          'addr': ''
        });
        this.petInfoForm.markAsUntouched();
      }
      console.log(this.newPetParentArr)

    }
  }
  existingPetSubmit() {
    this.existingpetInfoForm.markAllAsTouched();
    if (this.existingpetInfoForm.valid) {
      console.log("this.existingpetInfoForm", this.existingpetInfoForm.value.petParent);
      let pParent = this.existingpetInfoForm.value.petParent;
      let duplicateRecord = false;
      //check for duplicates with the array list
      this.existingPetParentArr && this.existingPetParentArr.forEach(ele => {
        console.log("ele.petParentId", ele.ppId);
        console.log("pParent.petParentId", pParent.petParentId);
        if (ele.ppId == pParent.petParentId) {
          duplicateRecord = true;
          this.toastr.error("Pet Parent" + " " + pParent.email + " " + "already mapped");
          this.existingpetInfoForm.patchValue({
            'petParent': ''
          })
          this.existingpetInfoForm.markAsUntouched();
        }
      })

      if (!duplicateRecord || this.existingPetParentArr.length == 0) {
        if (this.existingPetParentArr.length == 0) {
          this.existingPetParentArr = [];
        }

        //format mobile number
        let phoneNumber = pParent.phoneNumber;
        console.log("phoneNumber", phoneNumber);
        if (phoneNumber) {

          phoneNumber = phoneNumber.replace(/ /g, "");
          let desired = phoneNumber.replace(/[^\w\s]/gi, '');
          console.log("desired", desired);
          phoneNumber = desired;

          if (desired.startsWith("44")) {
            phoneNumber = this.formatUKPhoneNumber(phoneNumber);
          }
          else {
            phoneNumber = this.formatUSPhoneNumber(phoneNumber);
          }
          pParent.phoneNumber = phoneNumber;
        }
        this.existingPetParentArr.push({
          "phoneNumberValue": pParent.phoneNumber ? pParent.phoneNumber : '',
          "ppId": pParent.petParentId,
          // "ppName": pParent.petParentName,
          'petParentFirstName': pParent.petParentFirstName ? pParent.petParentFirstName : '',
          'petParentLastName': pParent.petParentLastName ? pParent.petParentLastName : '',
          "ppEmail": pParent.email ? pParent.email : '',
          "addr": pParent.shippingAddress ? pParent.shippingAddress : ''
        })


        this.existingpetInfoForm.patchValue({
          'petParent': ''
        })
        this.existingpetInfoForm.markAsUntouched();
      }


    }
  }
  createItem() {
    return this.fb.group({
      // 'ppName': '',
      'petParentFirstName': '',
      'petParentLastName': '',
      'ppEmail': ['', [Validators.required, ValidationService.emailValidator]],
      'phoneNumberCode': '',
      'phoneNumberValue': '',
      'addr': ['', [Validators.required]],
    })
  }

  addItem() {
    this.arr = this.petInfoForm.get('arr') as FormArray;
    this.arr.push(this.createItem());
  }

  removeItem(i: number) {
    this.arr = this.petInfoForm.get('arr') as FormArray;
    this.arr.removeAt(i);
  }
  ngAfterViewInit() {
    this.petInfoForm.patchValue({
      'phoneNumberCode': '+1'
    });
    // this.petInfoForm.controls['phoneNumberValue'].setValidators([Validators.required, ValidationService.usPhoneValidator]);
    // this.petInfoForm.controls['phoneNumberValue'].updateValueAndValidity();
  }
  onSubmit($event) {

  }
  formatUSPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = (match[1] ? '+1 ' : '+1 ');
      return [intlCode, ' ', '(', match[2], ')', match[3], '-', match[4]].join('');
    }
    return null;
  }
  formatUKPhoneNumber(phoneNumber) {
    console.log("phoneNumberphoneNumber in uk", phoneNumber)
    // let substring = phoneNumber.substring(0, 2);
    let phoneNumberArr = phoneNumber.toString().split(/44(.+)/);
    console.log("phoneNumberArr", phoneNumberArr)
    let genPh = phoneNumberArr[1]
    // return phoneNumberArr[1].replace(/\s+/g, '').replace(/(.)(\d{4})(\d)/, '+44 $1 - $2 - $3');
    let newString = '+44' + ' ' + genPh.substr(0, 2) + '-' + genPh.substr(2, 4) + '-' + genPh.substr(6, 4);
    return newString
  }

  next() {

    let petParentArr = [];
    this.newPetParentArr && this.newPetParentArr.forEach(ele => {
      if (ele.phoneNumberValue == '') {
        ele.phoneNumberCode = '';
      }
    })
    petParentArr = (this.existingPetParentArr ? this.existingPetParentArr : []).concat(this.newPetParentArr ? this.newPetParentArr : []);
    console.log(this.newPetParentArr);
    console.log(petParentArr);
    // if (petParentArr.length == 0) {
    //   this.toastr.error('Please select at least one pet parent', 'Error!');
    //   return;
    // }
    // this.tabservice.setModelData(petParentArr, 'petParentInfo');
    this.tabservice.setModelData(this.removedPetParents, 'removedPetParents');
    this.tabservice.setModelData(this.existingPetParentArr, 'petExistingArr');
    this.tabservice.setModelData(this.newPetParentArr, 'petNewArr');
    let data = this.tabservice.getModelData();
    console.log("datadatadata", data);

    if (!this.editFlag) {
      this.router.navigate(['/user/patients/add-patient/review']);
    }
    else {
      this.router.navigate([`/user/patients/edit-patient/${this.editId}/review`]);
    }
  }
  back() {

    if (!this.editFlag) {
      this.router.navigate(['/user/patients/add-patient/pet-device']);
    }
    else {
      this.router.navigate([`/user/patients/edit-patient/${this.editId}/pet-device`]);
    }
  }
  canDeactivate(component, route, state, next) {
    console.log('i am navigating away');
    console.log("routein basic", next.url);
    let petParentArr = [];
    this.newPetParentArr && this.newPetParentArr.forEach(ele => {
      if (ele.phoneNumberValue == '') {
        ele.phoneNumberCode = '';
      }
    })
    petParentArr = (this.existingPetParentArr ? this.existingPetParentArr : []).concat(this.newPetParentArr ? this.newPetParentArr : []);
    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if (next.url.indexOf('/add-patient') > -1 || next.url.indexOf('/edit-patient') > -1) {

      // if (petParentArr.length == 0) {
      //   this.toastr.error('Please select at least one pet parent', 'Error!');
      // }
      // else {
      console.log("this.submitFlag", this.submitFlag);
      this.submitFlag = true;
      // this.tabservice.setModelData(petParentArr, 'petParentInfo');
      this.tabservice.setModelData(this.removedPetParents, 'removedPetParents');
      this.tabservice.setModelData(this.existingPetParentArr, 'petExistingArr');
      this.tabservice.setModelData(this.newPetParentArr, 'petNewArr');
      let data = this.tabservice.getModelData();
      console.log("datadatadata", data);
      // }
    }
    else {
      let data = this.tabservice.getModelData() ? this.tabservice.getModelData() : {}
      if (petParentArr.length > 0 || Object.keys(data).length > 0) {
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
