import { Component, OnInit, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { AssetService } from 'src/app/services/util/asset.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { AlertService } from 'src/app/components/alert-modal/alert.service';
import { AddUserService } from 'src/app/clinical-users/components/add-user.service';


@Component({
  selector: 'app-pet-device',
  templateUrl: './pet-device.component.html',
  styleUrls: ['./pet-device.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PetDeviceComponent implements OnInit {
  deviceForm: FormGroup;
  arr: FormArray;
  UnassignForm: FormGroup;
  modalRef2: NgbModalRef;
  editFlag: boolean = false;
  @ViewChild('archiveContent') archiveContent: ElementRef;
  studyArr: any;
  isVirtual: boolean = true;
  deviceArr: any = [];
  editId: string;
  submitFlag: boolean = false;
  removedStudyDevices = [];
  assetTypeArr: any;
  assetModelArr: any;
  removedAssetIds: any = [];
  formIndex: any;
  reasonArr: any;
  addFilterFlag: boolean = true;
  displayStar: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private tabservice: TabserviceService,
    private assetService: AssetService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private customDatePipe: CustomDateFormatPipe,
    private alertService: AlertService,
    private adduserservice: AddUserService
  ) {

  }

  createItem() {
    return this.fb.group({
      'deviceNumber': ['', []],
      'assetType': [''],
      'model': [''],
      'study': ['', []],
      'studyName': [''],
      'assignedOn': [''],
      'petStudyDeviceId': [''],
      'petStudyId': [''],
      'deviceList': [''],
      'assetModelList': [''],
      'assetTypeList': [''],
      'unassignCheck': false,
      'reasonId': [''],
      'reasonValue': [''],
      'unAssignedOn': [''],
      'externalPetInfoId': [''],
      'externalPetValue': [''],
      'studyAssignedOn': [''],
      'studyEndDate': [''],
      'disabled': true,
      'time': ['']
    });
  }
  addItem() {
    this.arr = this.deviceForm.get('arr') as FormArray;
    this.arr.push(this.createItem());
    this.addDeviceArray();
  }
  onCheckboxChange(e, i) {
    if (e.target.checked == true) {
      // GET /assets/getAssetUnAssignReason
      this.UnassignForm.reset();
      this.openPopup(this.archiveContent, 'xs', i);
    }
  }
  addDeviceArray() {
    if (this.deviceArr.length) {
      this.deviceForm.controls.arr['controls'].forEach((element, i) => {
        this.deviceForm.controls.arr['controls'][i].patchValue({
          'deviceList': this.deviceArr,
          'assetModelList': this.assetModelArr,
          'assetTypeList': this.assetTypeArr
        });
      });
    }
  }

  removeItem(i: number) {
    this.arr = this.deviceForm.get('arr') as FormArray;
    if (this.editFlag && this.arr.value[i].petStudyId) {
      this.removedStudyDevices.push(this.arr.value[i].petStudyId);
    }
    this.arr.removeAt(i);

  }
  deviceSelected($event, i) {
    this.deviceForm.controls.arr['controls'][i].patchValue({
      model: $event.deviceModel ? { name: $event.deviceModel } : '',
      assetType: $event.deviceType ? { name: $event.deviceType } : ''
    });

  }
  assetTypeSelected($event, i) {
    // filter device number list based on selected asset type
    let tempDevice = [];
    let tempModelList = [];
    if ($event) {
      this.deviceArr.length > 0 && this.deviceArr.forEach(element => {
        if (element.deviceType && element.deviceType == $event.name) {
          tempDevice.push(element);
          if (element.deviceModel)
            tempModelList.push({ name: element.deviceModel })
        }
      });
      tempModelList = tempModelList.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
      tempDevice = tempDevice.filter((v, i, a) => a.findIndex(t => (t.deviceNumber === v.deviceNumber)) === i);

      let isDeviceExist = tempDevice.map(function (x) { return x.deviceNumber; }).indexOf(this.deviceForm.controls.arr['controls'][i].deviceNumber ? this.deviceForm.controls.arr['controls'][i].deviceNumber.deviceNumber : '');
      let isAssetModelExist = tempModelList.map(function (x) { return x.name; }).indexOf(this.deviceForm.controls.arr['controls'][i].model ? this.deviceForm.controls.arr['controls'][i].model.name : '');

      if (isDeviceExist < 0) {
        this.deviceForm.controls.arr['controls'][i].patchValue({
          'deviceNumber': '',
        });
      }
      if (isAssetModelExist < 0) {
        this.deviceForm.controls.arr['controls'][i].patchValue({
          'deviceModel': '',
        });
      }
      this.deviceForm.controls.arr['controls'][i].patchValue({
        'deviceList': tempDevice,
        'assetModelList': tempModelList
      });
    }
  }

  assetModelSelected($event, i) {
    // filter device number list based on selected asset model
    let tempDevice = [];
    let tempAssetType = [];
    if ($event) {
      this.deviceArr.length > 0 && this.deviceArr.forEach(element => {
        if (element.deviceModel && element.deviceModel == $event.name) {
          tempDevice.push(element);
          if (element.deviceType)
            tempAssetType.push({ name: element.deviceType })
        }
      });

      tempAssetType = tempAssetType.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
      tempDevice = tempDevice.filter((v, i, a) => a.findIndex(t => (t.deviceNumber === v.deviceNumber)) === i);

      let isDeviceExist = tempDevice.map(function (x) { return x.deviceNumber; }).indexOf(this.deviceForm.controls.arr['controls'][i].value.deviceNumber ? this.deviceForm.controls.arr['controls'][i].value.deviceNumber.deviceNumber : '');
      let isAssetModelExist = tempAssetType.map(function (x) { return x.name; }).indexOf(this.deviceForm.controls.arr['controls'][i].value.assetType ? this.deviceForm.controls.arr['controls'][i].value.assetType.name : '');
      if (isDeviceExist < 0) {
        this.deviceForm.controls.arr['controls'][i].patchValue({
          'deviceNumber': '',
        });
      }
      if (isAssetModelExist < 0) {
        this.deviceForm.controls.arr['controls'][i].patchValue({
          'assetType': '',
        });
      }
      this.deviceForm.controls.arr['controls'][i].patchValue({
        'deviceList': tempDevice,
        'assetTypeList': tempAssetType
      });
    }
  }

  ngOnInit() {

    if (this.router.url.indexOf('/edit-patient') > -1) {
      let str = this.router.url;
      let id = str.split("edit-patient/")[1].split("/")[0];
      this.editFlag = true;
      this.editId = id;
    }

    let res = this.tabservice.getModelData() ? this.tabservice.getModelData() : {}
    if (!res || (res && !res.petInfo)) {
      if (!this.editFlag)
        this.router.navigate(['/user/patients/add-patient/pet-info']);
      else
        this.router.navigate([`/user/patients/edit-patient/${this.editId}/pet-info`]);
      return;
    }

    // data model starts
    let petDeviceData = res ? (res['petDevice'] ? res['petDevice'] : '') : '';
    let petDevice = petDeviceData ? petDeviceData.arr : '';

    let petStudy = res ? (res['petStudy'] ? res['petStudy'] : '') : '';

    let rest = petStudy ? petStudy.arr : '';
    let newArr = [];
    rest && rest.forEach(ele => {
      if (ele.studyName != '') {
        newArr.push({ "studyName": ele.studyName.studyName, "studyId": ele.studyName.studyId, "studyassDate": ele.studyassDate, "externalPet": ele.externalPet, "studyEndDate": ele.endDate })
      }
    })
    this.studyArr = newArr;

    this.adduserservice.getStudy('/api/assets/getAssetUnAssignReason', '').subscribe(res => {
      this.reasonArr = res.response.unAssignReason;
    },
      err => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
      }
    );

    this.spinner.show();
    this.assetService.getDeviceDetails('/api/assets/getAllDevices', '').subscribe(res => {
      this.deviceArr = res.response.deviceInfos;
      if (this.editFlag && petDevice) {
        petDevice.forEach(element => {
          this.deviceArr.push(element.deviceNumber);
        });
      }
      this.deviceForm.controls.arr['controls'].forEach((elem, index) => {
        this.deviceForm.controls.arr['controls'][index].patchValue({
          'deviceList': this.deviceArr
        });
      });


      //for intializing in edit/change tab

      if (petDevice) {
        petDevice.forEach((ele, i) => {
          let isStudyExist: boolean = (this.studyArr.filter((study: any) => study.studyId == ele.study)).length;
          this.isVirtual = this.studyArr.length == 1 && (rest.filter((study: any) => study.isVirtual)).length;

          if (ele.unAssignedOn) {
            this.deviceForm.controls.arr['controls'][i].patchValue({
              'unassignCheck': true
            })
          }

          this.deviceForm.controls.arr['controls'][i].patchValue({
            "assignedOn": ele.assignedOn ? moment(ele.assignedOn).format("MM-DD-YYYY") : '',
            "deviceNumber": ele.deviceNumber.deviceId ? ele.deviceNumber : '',
            "model": ele.model ? ele.model : '',
            "study": (ele.study && isStudyExist) ? ele.study : (this.isVirtual ? this.studyArr[0].studyId : ''),
            "studyName": (ele.studyName && isStudyExist) ? ele.studyName : (this.isVirtual ? this.studyArr[0].studyName : ''),
            'petStudyDeviceId': ele.petStudyDeviceId,
            'petStudyId': ele.petStudyId,
            'assetType': ele.assetType ? ele.assetType : '',
            'deviceList': ele.deviceList ? ele.deviceList : this.deviceArr,
            'unAssignedOn': ele.unAssignedOn,
            'unassignCheck': ele.unassignCheck,
            'studyAssignedOn': (ele.studyName && isStudyExist) ? (ele.studyAssignedOn ? moment(ele.studyAssignedOn).format("MM-DD-YYYY") : '') : (this.isVirtual ? (this.studyArr[0].studyassDate ? moment(this.studyArr[0].studyassDate).format("MM-DD-YYYY") : '') : ''),
            'studyEndDate': ele.studyEndDate ? moment(ele.studyEndDate).format("MM-DD-YYYY") : '',
            'externalPetInfoId': ele.externalPetInfoId ? ele.externalPetInfoId : '',
            'disabled': ele.disabled
          });

          if (i < (petDevice.length - 1)) {
            this.addItem();
          }

        })
      }

      this.spinner.hide();
    },
      err => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
      }
    );

    this.assetService.getDeviceDetails('/api/assets/getDeviceTypesAndModels', '').subscribe(res => {
      if (res.response && res.response.deviceTypes && res.response.deviceTypes.length > 0) {
        let deviceTypeArr = [];
        res.response.deviceTypes.forEach(element => {
          deviceTypeArr.push({ 'name': element });
        });
        this.assetTypeArr = deviceTypeArr;
      }
      if (res.response && res.response.deviceModels && res.response.deviceModels.length > 0) {
        let deviceModelArr = [];
        res.response.deviceModels.forEach(element => {
          deviceModelArr.push({ 'name': element });
        });

        this.assetModelArr = deviceModelArr;
      }
      this.deviceForm.controls.arr['controls'].forEach((elem, index) => {
        this.deviceForm.controls.arr['controls'][index].patchValue({
          'assetModelList': this.assetModelArr,
          'assetTypeList': this.assetTypeArr
        });
      });
    },
      err => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
      });



    //  this.spinner.show();
    //  this.adduserservice.getStudy('/api/study/getStudyList','').subscribe(res => {
    //   console.log("res", res);
    //   this.studyArr = res.response.studyList;
    //   this.spinner.hide();
    // },
    //   err => {
    //    this.spinner.hide();
    //     this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
    //   }
    // );

    this.deviceForm = this.fb.group({
      arr: this.fb.array([this.createItem()])
    });


    this.UnassignForm = this.fb.group({
      'reason': ['', [Validators.required]],
      'deviceNumber': '',
      'model': '',
      'assignedOn': '',
      'time': [''],
      'unAssignedOn': ['', [Validators.required]]
    })

    //data model ends here

    //setting status as on study
    let data = this.tabservice.getModelData();

    if (Object.keys(data.petInfo).length > 0) {
      if (data.petInfo.status == '3') {
        this.addFilterFlag = false;
      }
    }
    //setting status as on study

    if (!(res.hasOwnProperty('petStudy'))) {
      this.toastr.error("Please select study in the study tab before navigating to the Asset details tab.");
      if (this.editFlag) {
        this.router.navigate([`/user/patients/edit-patient/${this.editId}/pet-study`]);
        return;
      }
      else {
        this.router.navigate(['/user/patients/add-patient/pet-study']);
        return;
      }

    }
    else {
      if (this.editFlag) {
        this.router.navigate([`/user/patients/edit-patient/${this.editId}/pet-device`]);
      }
      else {
        this.router.navigate(['/user/patients/add-patient/pet-device']);
      }
    }



  }
  onSubmit($event) {

  }
  onSelectStudy($event, i) {
    this.studyArr.forEach(ele => {
      if (ele.studyId == $event.target.value) {

        this.deviceForm.controls.arr['controls'][i].patchValue({
          // studyDesc:ele.studyDesc ? ele.studyDesc :'',
          assignedOn: '',
          studyName: ele.studyName ? ele.studyName : '',
          externalPetInfoId: ele.externalPet ? ele.externalPet.externalPetId : '',
          externalPetValue: ele.externalPet ? ele.externalPet.externalPetValue : '',
          studyAssignedOn: ele.studyassDate ? ele.studyassDate : '',
          studyEndDate: ele.studyEndDate ? ele.studyEndDate : ''
        });
        this.displayStar = true;
      } else {
        this.displayStar = false;
      }
    })

  }
  dateSelected($event, i) {
    if ($event) {
      // this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.setValidators([Validators.required]);
      // this.deviceForm.get('arr')['controls'][i].controls.assetType.setValidators([Validators.required]);
      // this.deviceForm.get('arr')['controls'][i].controls.study.setValidators([Validators.required]);
      // this.deviceForm.get('arr')['controls'][i].controls.model.setValidators([Validators.required]);

      // this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.updateValueAndValidity();
      // this.deviceForm.get('arr')['controls'][i].controls.assetType.updateValueAndValidity();
      // this.deviceForm.get('arr')['controls'][i].controls.study.updateValueAndValidity();
      // this.deviceForm.get('arr')['controls'][i].controls.model.updateValueAndValidity();



    }
  }
  onClearDate(i) {
    this.deviceForm.controls.arr['controls'][i].patchValue({
      'assignedOn': ''
    });
    //   this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.setValidators([]);
    //   this.deviceForm.get('arr')['controls'][i].controls.model.setValidators([]);
    //  this.deviceForm.get('arr')['controls'][i].controls.study.setValidators([]);
    //  this.deviceForm.get('arr')['controls'][i].controls.assetType.setValidators([]);

    //  this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.updateValueAndValidity();
    //  this.deviceForm.get('arr')['controls'][i].controls.model.updateValueAndValidity();
    //  this.deviceForm.get('arr')['controls'][i].controls.study.updateValueAndValidity();
    //  this.deviceForm.get('arr')['controls'][i].controls.assetType.updateValueAndValidity();

  }
  populate($event, i) {
    if ($event.deviceNumber) {
      //     console.log(this.deviceForm.get('arr')['controls'][i].controls.study)
      //  this.deviceForm.get('arr')['controls'][i].controls.model.setValidators([Validators.required]);
      //  this.deviceForm.get('arr')['controls'][i].controls.assignedOn.setValidators([Validators.required]);
      //  this.deviceForm.get('arr')['controls'][i].controls.study.setValidators([Validators.required]);
      //  this.deviceForm.get('arr')['controls'][i].controls.assetType.setValidators([Validators.required]);

      //  this.deviceForm.get('arr')['controls'][i].controls.model.updateValueAndValidity();
      //  this.deviceForm.get('arr')['controls'][i].controls.assignedOn.updateValueAndValidity();
      //  this.deviceForm.get('arr')['controls'][i].controls.study.updateValueAndValidity();
      //  this.deviceForm.get('arr')['controls'][i].controls.assetType.updateValueAndValidity();
    }

  }
  populateModel($event, i) {
    if ($event.model) {
      // this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.setValidators([Validators.required]);
      // this.deviceForm.get('arr')['controls'][i].controls.assignedOn.setValidators([Validators.required]);
      // this.deviceForm.get('arr')['controls'][i].controls.study.setValidators([Validators.required]);
      // this.deviceForm.get('arr')['controls'][i].controls.assetType.setValidators([Validators.required]);

      // this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.updateValueAndValidity();
      // this.deviceForm.get('arr')['controls'][i].controls.assignedOn.updateValueAndValidity();
      // this.deviceForm.get('arr')['controls'][i].controls.study.updateValueAndValidity();
      // this.deviceForm.get('arr')['controls'][i].controls.assetType.updateValueAndValidity();
    }

  }
  populateType($event, i) {
    if ($event.assetType) {
      // this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.setValidators([Validators.required]);
      // this.deviceForm.get('arr')['controls'][i].controls.assignedOn.setValidators([Validators.required]);
      // this.deviceForm.get('arr')['controls'][i].controls.study.setValidators([Validators.required]);
      // this.deviceForm.get('arr')['controls'][i].controls.model.setValidators([Validators.required]);

      // this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.updateValueAndValidity();
      // this.deviceForm.get('arr')['controls'][i].controls.assignedOn.updateValueAndValidity();
      // this.deviceForm.get('arr')['controls'][i].controls.study.updateValueAndValidity();
      // this.deviceForm.get('arr')['controls'][i].controls.model.updateValueAndValidity();
    }

  }

  onClearAssetType(i) {
    this.onClear(i);
    this.deviceForm.controls.arr['controls'][i].patchValue({
      'model': '',
      'deviceNumber': ''
    });
    if (!(this.deviceForm.controls.arr['controls'][i].value.model ||
      this.deviceForm.controls.arr['controls'][i].value.deviceNumber)) {
      this.deviceForm.controls.arr['controls'][i].patchValue({
        'assetModelList': this.assetModelArr,
        'deviceList': this.deviceArr,
        'assetTypeList': this.assetTypeArr
      });
    }
  }
  onClearModel(i) {
    this.onClear(i);
    if (!(this.deviceForm.controls.arr['controls'][i].value.assetType || this.deviceForm.controls.arr['controls'][i].value.deviceNumber)) {
      this.deviceForm.controls.arr['controls'][i].patchValue({
        'assetModelList': this.assetModelArr,
        'deviceList': this.deviceArr,
        'assetTypeList': this.assetTypeArr
      });
    }
  }
  onClearAssetNum(i) {
    this.onClear(i);
    if (!(this.deviceForm.controls.arr['controls'][i].value.assetType || this.deviceForm.controls.arr['controls'][i].value.model)) {
      this.deviceForm.controls.arr['controls'][i].patchValue({
        'assetModelList': this.assetModelArr,
        'deviceList': this.deviceArr,
        'assetTypeList': this.assetTypeArr
      });
    }
  }
  onClear(i) {
    // this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.setValidators([]);
    // this.deviceForm.get('arr')['controls'][i].controls.assignedOn.setValidators([]);
    // this.deviceForm.get('arr')['controls'][i].controls.study.setValidators([]);
    // this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.updateValueAndValidity();
    // this.deviceForm.get('arr')['controls'][i].controls.assignedOn.updateValueAndValidity();
    // this.deviceForm.get('arr')['controls'][i].controls.study.updateValueAndValidity();
  }

  openPopup(div, size, formIndex) {
    this.formIndex = formIndex;
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
  unasssign() {
    // this.openPopup(this.archiveContent, 'lg',i);
  }
  cancelCheck() {
    this.deviceForm.value.arr.forEach((element, index) => {
      if (this.formIndex == index) {
        this.deviceForm.controls.arr['controls'][index].patchValue({
          'unassignCheck': false
        });
      }
    });
  }
  unassignDevSubmit() {
    if (!this.UnassignForm.valid) {
      this.UnassignForm.markAllAsTouched();
      return false;
    }
    if (this.UnassignForm.value.reason == '') {
      this.toastr.error("Please select a reason for unassigning");
      return false;
    }

    this.modalRef2.close();

    // this.deviceForm.controls.arr['controls'].forEach((element,i) => {
    //   this.deviceForm.controls.arr['controls'][i].patchValue({
    //     'deviceList' : this.deviceArr,
    //     'assetModelList' : this.assetModelArr,
    //     'assetTypeList' : this.assetTypeArr
    //   });
    // });
    let reasonId = this.UnassignForm.value.reason;
    let unAssignedOn = this.UnassignForm.value.unAssignedOn;
    let time = this.UnassignForm.value.time;


    this.deviceForm.controls.arr['controls'].forEach((element, i) => {
      if (i == this.formIndex) {
        this.deviceForm.controls.arr['controls'][i].patchValue({
          'reasonId': reasonId.toString(),
          'time': time,
          'reasonValue': this.reasonArr.find(x => x.reasonId == reasonId),
          'unAssignedOn': this.customDatePipe.transform(unAssignedOn, 'yyyy-MM-dd')
        });
      }
    });
  }
  back() {

    let res = this.tabservice.getModelData() ? this.tabservice.getModelData() : {}

    if (!(res.hasOwnProperty('petStudy'))) {
      this.toastr.error("Please select studies in Pet Study tab to go to Asset Details Tab");
      if (this.editFlag) {
        this.router.navigate([`/user/patients/edit-patient/${this.editId}/pet-study`]);
        return;
      }
      else {
        this.router.navigate(['/user/patients/add-patient/pet-study']);
        return;
      }

    }
    else {
      if (!this.editFlag) {
        this.router.navigate(['/user/patients/add-patient/pet-study']);
      }
      else {
        this.router.navigate([`/user/patients/edit-patient/${this.editId}/pet-study`]);
      }
    }
  }
  next() {
    if (this.deviceForm.value.arr) {
      this.deviceForm.value.arr.forEach((ele, i) => {
        if (ele.study) {
          this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.setValidators([Validators.required]);
          this.deviceForm.get('arr')['controls'][i].controls.assetType.setValidators([Validators.required]);

          // this.deviceForm.get('arr')['controls'][i].controls.model.updateValueAndValidity();
          this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.updateValueAndValidity();
          this.deviceForm.get('arr')['controls'][i].controls.assetType.updateValueAndValidity();
          this.displayStar = true;
        }
        if (ele.assignedOn) {
          // this.deviceForm.get('arr')['controls'][i].controls.model.setValidators([Validators.required]);
          this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.setValidators([Validators.required]);
          this.deviceForm.get('arr')['controls'][i].controls.study.setValidators([Validators.required]);
          this.deviceForm.get('arr')['controls'][i].controls.assetType.setValidators([Validators.required]);

          // this.deviceForm.get('arr')['controls'][i].controls.model.updateValueAndValidity();
          this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.updateValueAndValidity();
          this.deviceForm.get('arr')['controls'][i].controls.study.updateValueAndValidity();
          this.deviceForm.get('arr')['controls'][i].controls.assetType.updateValueAndValidity();
        }
        if (ele.assetType) {
          // this.deviceForm.get('arr')['controls'][i].controls.model.setValidators([Validators.required]);
          this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.setValidators([Validators.required]);
          this.deviceForm.get('arr')['controls'][i].controls.study.setValidators([Validators.required]);
          // this.deviceForm.get('arr')['controls'][i].controls.assignedOn.setValidators([Validators.required]);

          // this.deviceForm.get('arr')['controls'][i].controls.model.updateValueAndValidity();
          this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.updateValueAndValidity();
          this.deviceForm.get('arr')['controls'][i].controls.study.updateValueAndValidity();
          // this.deviceForm.get('arr')['controls'][i].controls.assignedOn.updateValueAndValidity();
        }
        if (ele.model) {
          this.deviceForm.get('arr')['controls'][i].controls.assetType.setValidators([Validators.required]);
          this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.setValidators([Validators.required]);
          this.deviceForm.get('arr')['controls'][i].controls.study.setValidators([Validators.required]);
          // this.deviceForm.get('arr')['controls'][i].controls.assignedOn.setValidators([Validators.required]);

          this.deviceForm.get('arr')['controls'][i].controls.assetType.updateValueAndValidity();
          this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.updateValueAndValidity();
          this.deviceForm.get('arr')['controls'][i].controls.study.updateValueAndValidity();
          // this.deviceForm.get('arr')['controls'][i].controls.assignedOn.updateValueAndValidity();
        }
        if (ele.deviceNumber) {
          this.deviceForm.get('arr')['controls'][i].controls.assetType.setValidators([Validators.required]);
          // this.deviceForm.get('arr')['controls'][i].controls.assignedOn.setValidators([Validators.required]);
          this.deviceForm.get('arr')['controls'][i].controls.study.setValidators([Validators.required]);
          // this.deviceForm.get('arr')['controls'][i].controls.model.setValidators([Validators.required]);

          this.deviceForm.get('arr')['controls'][i].controls.assetType.updateValueAndValidity();
          // this.deviceForm.get('arr')['controls'][i].controls.assignedOn.updateValueAndValidity();
          this.deviceForm.get('arr')['controls'][i].controls.study.updateValueAndValidity();
          // this.deviceForm.get('arr')['controls'][i].controls.model.updateValueAndValidity();
        }
        if (ele.assignedOn == '' && ele.study == '' && ele.assetType == '' && ele.model == '' && ele.deviceNumber == '') {
          this.deviceForm.get('arr')['controls'][i].controls.assetType.setValidators([]);
          this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.setValidators([]);
          this.deviceForm.get('arr')['controls'][i].controls.assignedOn.setValidators([]);
          this.deviceForm.get('arr')['controls'][i].controls.model.setValidators([]);
          this.deviceForm.get('arr')['controls'][i].controls.study.setValidators([]);

          this.deviceForm.get('arr')['controls'][i].controls.assetType.updateValueAndValidity();
          this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.updateValueAndValidity();
          this.deviceForm.get('arr')['controls'][i].controls.assignedOn.updateValueAndValidity();
          this.deviceForm.get('arr')['controls'][i].controls.model.updateValueAndValidity();
          this.deviceForm.get('arr')['controls'][i].controls.study.updateValueAndValidity();
          this.displayStar = false;
        }

      })
    }
    this.deviceForm.markAllAsTouched();
    if (this.deviceForm.valid) {

      let array = []
      this.deviceForm.value.arr.forEach((element, index) => {
        if (!((element.study ? element.study == '' : element.study == '') && (element.deviceNumber ? element.deviceNumber.deviceId == '' : element.deviceNumber == ''))) {
          array.push(element);
        }
      });

      array.forEach((element, index) => {
        if (element.unassignCheck == true && element.petStudyDeviceId != 0) {
          this.removedAssetIds.push({ petAssetId: element.petStudyDeviceId, reasonId: element.reasonId, unAssignedOn: element.unAssignedOn, reasonValue: this.reasonArr.find(x => x.reasonId == element.reasonId) });
        }
      });

      let newdataArr = JSON.parse(JSON.stringify(array)); //shallow copy
      let arrayCopy = JSON.parse(JSON.stringify(array)); //shallow copy
      let arrayCopyAss = JSON.parse(JSON.stringify(array)); //shallow copy
      let uniqueStudies = arrayCopy.filter((obj, index, self) =>
        index === self.findIndex((t) => (
          // t.study.studyId === obj.study.studyId
          t.study == obj.study
        )));


      let uniqueAssets = arrayCopyAss.filter((obj, index, self) =>
        index === self.findIndex((t) => (
          (t.deviceNumber.deviceId == obj.deviceNumber.deviceId) && (obj.deviceNumber != '' && t.deviceNumber != '')
        )));


      if ((uniqueStudies.length > 0 && uniqueStudies.length != array.length) || (uniqueAssets.length > 0 && uniqueAssets.length != array.length)) {
        if (uniqueStudies.length > 0 && uniqueStudies.length != array.length) {
          // for non unique elements
          let nonuniqStudies = newdataArr.filter((obj, index, self) =>
            index != self.findIndex((t) => (
              t.study == obj.study
            )));

          // for non unique and filter duplicate  elements
          let nonuniqStudiesUniq = nonuniqStudies.filter((obj, index, self) =>
            index === self.findIndex((t) => (
              // t.study.studyId === obj.study.studyId
              t.study == obj.study
            )));

          //if same study but different unassignCheck
          //check if there are more than 2 objects
          //with one of it should be unassignCheck false and other true

          let compareArr = {};
          let bothFalseArr = {};
          uniqueStudies.forEach(ele => {
            nonuniqStudies.forEach((nonEle, i) => {
              if (ele.unassignCheck && ele.study == nonEle.study) {
                compareArr[nonEle.study] = (compareArr[nonEle.study] || 0) + 1;
              }
              if (!ele.unassignCheck && ele.study == nonEle.study) {
                // bothFalseArr.push({"study":nonEle.study});
                bothFalseArr[nonEle.study] = (bothFalseArr[nonEle.study] || 0) + 1;
              }
            });

          })

          //if 2 object then alow

          //if more than 2 objects dont allow
          let sfs = []
          let showErrorMessage = false;
          if (compareArr) {
            for (const [key, value] of Object.entries(compareArr)) {
              if (value == 1) {
              }
              else {
                sfs.push(true)
              }
            }
          }
          if (Object.keys(bothFalseArr).length > 0) {
            for (const [key, value] of Object.entries(bothFalseArr)) {
              sfs.push(true)
            }
          }

          if (sfs.includes(true)) {
            //unique studies

            if (uniqueAssets.length > 0 && uniqueAssets.length != array.length) {
              let numbers: any;
              uniqueAssets.forEach((ele, i) => {
                numbers = numbers + ele.deviceNumber.deviceNumber;
              })
              this.toastr.error('Asset Number already exists. Kindly provide another Asset Number.');

            }
            this.toastr.error('Study already associated with the pet. Kindly provide another Study.');
            return;
          }
          else {
            console.log("array in comparearr", array)
            // return;
          }

        }


      }



      this.submitFlag = true;
      let deviceObj = Object.assign({ arr: array });
      if (this.removedStudyDevices.length > 0 && this.editFlag) {
        deviceObj['removedStudyDevices'] = this.removedStudyDevices.toString();
      }
      if (this.removedAssetIds.length > 0 && this.editFlag) {
        deviceObj['removedAssetIds'] = this.removedAssetIds;
      }

      this.tabservice.setModelData(deviceObj, 'petDevice');

      let data = this.tabservice.getModelData();

      if (!this.editFlag) {
        this.router.navigate(['/user/patients/add-patient/pet-parent-info']);
      }
      else {
        this.router.navigate([`/user/patients/edit-patient/${this.editId}/pet-parent-info`]);
      }

    }
  }
  canDeactivate(component, route, state, next) {
    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if (next.url.indexOf('/add-patient/pet-info') > -1 || next.url.indexOf('/add-patient/pet-study') > -1) {
      return true;
    }
    if (next.url.indexOf('/add-patient') > -1 || next.url.indexOf('/edit-patient') > -1) {
      // if(next.url.indexOf('/user/patients/add-patient/pet-study') > -1 || next.url.indexOf(`/user/patients/edit-patient/${this.editId}/pet-study`) > -1) {
      //   this.submitFlag = true;
      // }
      // else { //else starts here
      if (this.deviceForm) {
        if (this.deviceForm.value.arr)
          this.deviceForm.value.arr.forEach((ele, i) => {
            if (ele.study) {
              this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.setValidators([Validators.required]);
              this.deviceForm.get('arr')['controls'][i].controls.assetType.setValidators([Validators.required]);

              // this.deviceForm.get('arr')['controls'][i].controls.model.updateValueAndValidity();
              this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.updateValueAndValidity();
              this.deviceForm.get('arr')['controls'][i].controls.assetType.updateValueAndValidity();
            }
            if (ele.assignedOn) {
              // this.deviceForm.get('arr')['controls'][i].controls.model.setValidators([Validators.required]);
              this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.setValidators([Validators.required]);
              this.deviceForm.get('arr')['controls'][i].controls.study.setValidators([Validators.required]);
              this.deviceForm.get('arr')['controls'][i].controls.assetType.setValidators([Validators.required]);

              // this.deviceForm.get('arr')['controls'][i].controls.model.updateValueAndValidity();
              this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.updateValueAndValidity();
              this.deviceForm.get('arr')['controls'][i].controls.study.updateValueAndValidity();
              this.deviceForm.get('arr')['controls'][i].controls.assetType.updateValueAndValidity();
            }
            if (ele.assetType) {
              // this.deviceForm.get('arr')['controls'][i].controls.model.setValidators([Validators.required]);
              this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.setValidators([Validators.required]);
              this.deviceForm.get('arr')['controls'][i].controls.study.setValidators([Validators.required]);
              // this.deviceForm.get('arr')['controls'][i].controls.assignedOn.setValidators([Validators.required]);

              // this.deviceForm.get('arr')['controls'][i].controls.model.updateValueAndValidity();
              this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.updateValueAndValidity();
              this.deviceForm.get('arr')['controls'][i].controls.study.updateValueAndValidity();
              // this.deviceForm.get('arr')['controls'][i].controls.assignedOn.updateValueAndValidity();
            }
            if (ele.model) {
              this.deviceForm.get('arr')['controls'][i].controls.assetType.setValidators([Validators.required]);
              this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.setValidators([Validators.required]);
              this.deviceForm.get('arr')['controls'][i].controls.study.setValidators([Validators.required]);
              // this.deviceForm.get('arr')['controls'][i].controls.assignedOn.setValidators([Validators.required]);

              this.deviceForm.get('arr')['controls'][i].controls.assetType.updateValueAndValidity();
              this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.updateValueAndValidity();
              this.deviceForm.get('arr')['controls'][i].controls.study.updateValueAndValidity();
              // this.deviceForm.get('arr')['controls'][i].controls.assignedOn.updateValueAndValidity();
            }
            if (ele.deviceNumber) {
              this.deviceForm.get('arr')['controls'][i].controls.assetType.setValidators([Validators.required]);
              // this.deviceForm.get('arr')['controls'][i].controls.assignedOn.setValidators([Validators.required]);
              this.deviceForm.get('arr')['controls'][i].controls.study.setValidators([Validators.required]);
              // this.deviceForm.get('arr')['controls'][i].controls.model.setValidators([Validators.required]);

              this.deviceForm.get('arr')['controls'][i].controls.assetType.updateValueAndValidity();
              // this.deviceForm.get('arr')['controls'][i].controls.assignedOn.updateValueAndValidity();
              this.deviceForm.get('arr')['controls'][i].controls.study.updateValueAndValidity();
              // this.deviceForm.get('arr')['controls'][i].controls.model.updateValueAndValidity();
            }
            if (ele.assignedOn == '' && ele.study == '' && ele.assetType == '' && ele.model == '' && ele.deviceNumber == '') {
              this.deviceForm.get('arr')['controls'][i].controls.assetType.setValidators([]);
              this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.setValidators([]);
              this.deviceForm.get('arr')['controls'][i].controls.assignedOn.setValidators([]);
              this.deviceForm.get('arr')['controls'][i].controls.model.setValidators([]);
              this.deviceForm.get('arr')['controls'][i].controls.study.setValidators([]);

              this.deviceForm.get('arr')['controls'][i].controls.assetType.updateValueAndValidity();
              this.deviceForm.get('arr')['controls'][i].controls.deviceNumber.updateValueAndValidity();
              this.deviceForm.get('arr')['controls'][i].controls.assignedOn.updateValueAndValidity();
              this.deviceForm.get('arr')['controls'][i].controls.model.updateValueAndValidity();
              this.deviceForm.get('arr')['controls'][i].controls.study.updateValueAndValidity();
            }

          });
        this.deviceForm.markAllAsTouched();
        if (this.deviceForm.valid) {

          let array = []
          this.deviceForm.value.arr.forEach((element, index) => {
            if (!((element.study ? element.study == '' : element.study == '') && (element.deviceNumber ? element.deviceNumber.deviceId == '' : element.deviceNumber == ''))) {
              array.push(element);
            }
          });

          array.forEach((element, index) => {
            if (element.unassignCheck == true && element.petStudyDeviceId != 0) {
              this.removedAssetIds.push({ petAssetId: element.petStudyDeviceId, reasonId: element.reasonId, unAssignedOn: element.unAssignedOn, reasonValue: this.reasonArr.find(x => x.reasonId == element.reasonId) });
            }
          });

          let newdataArr = JSON.parse(JSON.stringify(array)); //shallow copy
          let arrayCopy = JSON.parse(JSON.stringify(array)); //shallow copy
          let arrayCopyAss = JSON.parse(JSON.stringify(array)); //shallow copy
          let uniqueStudies = arrayCopy.filter((obj, index, self) =>
            index === self.findIndex((t) => (
              // t.study.studyId === obj.study.studyId
              t.study == obj.study
            )));


          let uniqueAssets = arrayCopyAss.filter((obj, index, self) =>
            index === self.findIndex((t) => (
              (t.deviceNumber.deviceId == obj.deviceNumber.deviceId) && (obj.deviceNumber != '' && t.deviceNumber != '')
            )));


          if ((uniqueStudies.length > 0 && uniqueStudies.length != array.length) || (uniqueAssets.length > 0 && uniqueAssets.length != array.length)) {
            if (uniqueStudies.length > 0 && uniqueStudies.length != array.length) {
              // for non unique elements
              let nonuniqStudies = newdataArr.filter((obj, index, self) =>
                index != self.findIndex((t) => (
                  t.study == obj.study
                )));

              // for non unique and filter duplicate  elements
              let nonuniqStudiesUniq = nonuniqStudies.filter((obj, index, self) =>
                index === self.findIndex((t) => (
                  // t.study.studyId === obj.study.studyId
                  t.study == obj.study
                )));

              //if same study but different unassignCheck
              //check if there are more than 2 objects
              //with one of it should be unassignCheck false and other true

              let compareArr = {};
              let bothFalseArr = {};
              uniqueStudies.forEach(ele => {
                nonuniqStudies.forEach((nonEle, i) => {
                  if (ele.unassignCheck && ele.study == nonEle.study) {
                    compareArr[nonEle.study] = (compareArr[nonEle.study] || 0) + 1;
                  }
                  if (!ele.unassignCheck && ele.study == nonEle.study) {
                    // bothFalseArr.push({"study":nonEle.study});
                    bothFalseArr[nonEle.study] = (bothFalseArr[nonEle.study] || 0) + 1;
                  }
                });

              })

              //if 2 object then alow

              //if more than 2 objects dont allow
              let sfs = []
              let showErrorMessage = false;
              if (compareArr) {
                for (const [key, value] of Object.entries(compareArr)) {
                  if (value == 1) {
                  }
                  else {
                    sfs.push(true)
                  }
                }
              }
              if (Object.keys(bothFalseArr).length > 0) {
                for (const [key, value] of Object.entries(bothFalseArr)) {
                  sfs.push(true)
                }
              }

              if (sfs.includes(true)) {
                if (uniqueAssets.length > 0 && uniqueAssets.length != array.length) {
                  let numbers: any;
                  uniqueAssets.forEach((ele, i) => {
                    numbers = numbers + ele.deviceNumber.deviceNumber;
                  })
                  this.toastr.error('Asset Number already exists. Kindly provide another Asset Number.');
                }
                this.toastr.error('Study already associated with the pet. Kindly provide another Study.');
                return;
              }
              else {
                console.log("array in comparearr", array)
                // return;
              }

            }
            //unique studies



            // return;
          }

          this.submitFlag = true;
          let deviceObj = Object.assign({ arr: array });
          if (this.removedStudyDevices.length > 0 && this.editFlag) {
            deviceObj['removedStudyDevices'] = this.removedStudyDevices.toString();
          }
          if (this.removedAssetIds.length > 0 && this.editFlag) {
            deviceObj['removedAssetIds'] = this.removedAssetIds;
          }

          this.tabservice.setModelData(deviceObj, 'petDevice');

          let data = this.tabservice.getModelData();
        }
        else {
          this.submitFlag = false;
        }
      }
      else {
        return true;
      }
      // }else ends here
    }
    else {
      let data = this.tabservice.getModelData() ? this.tabservice.getModelData() : {};
      if (this.deviceForm.pristine == false || Object.keys(data).length > 0) {
        return this.alertService.confirm();
      }
      else {
        return true;
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
