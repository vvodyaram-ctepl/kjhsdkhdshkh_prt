import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { Router, ActivatedRoute, NavigationEnd, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import * as moment from 'moment';
import { ClinicService } from '../clinic.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { AlertService } from 'src/app/components/alert-modal/alert.service';




@Component({
  selector: 'app-study-image-scoring',
  templateUrl: './study-image-scoring.component.html',
  styleUrls: ['./study-image-scoring.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StudyImageScoringComponent implements OnInit {
  displayURLField: boolean = false;
  imageScoringForm: FormGroup;
  submitFlag: boolean = false;
  editFlag: boolean = false;
  editId: any;
  statusArr: { name: string; id: string; }[];
  mobileArr: any;
  meridian = true;
  pushList: any;
  arr: FormArray;
  pushlistUniqList: any[];
  maxDate: any = '';
  studyStartDate: any = '';
  studyEndDate: any = '';


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private tabservice: TabserviceService,
    private route: ActivatedRoute,
    private clinicService: ClinicService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public customDatePipe: CustomDateFormatPipe,
    private alertService: AlertService
  ) {

    this.imageScoringForm = this.fb.group({
      arr: this.fb.array([this.createItem()])
    });
  }

  createItem() {
    // moment().format("MM-DD-YYYY")
    return this.fb.group({
      'imageScoring': [''],
      'frequency': [''],
      'startDate': [''],
      'endDate': [''],
      'pushList': [],
      disabled: false
    })
  }
  addItem() {
    this.arr = this.imageScoringForm.get('arr') as FormArray;
    this.arr.push(this.createItem());
  }

  removeItem(i: number) {
    this.arr = this.imageScoringForm.get('arr') as FormArray;
    this.arr.removeAt(i);
    console.log(this.imageScoringForm.value.arr[i]);
  }

  populate($event, formId) {
    console.log("event trgrd", $event);
    this.imageScoringForm.controls.arr['controls'].forEach((ele, i) => {
      if (i == formId) {
        this.imageScoringForm.get('arr')['controls'][i].controls.startDate.setValidators([Validators.required]);
        this.imageScoringForm.get('arr')['controls'][i].controls.endDate.setValidators([Validators.required]);
        this.imageScoringForm.get('arr')['controls'][i].controls.frequency.setValidators([Validators.required]);
        this.imageScoringForm.get('arr')['controls'][i].controls.startDate.updateValueAndValidity();
        this.imageScoringForm.get('arr')['controls'][i].controls.endDate.updateValueAndValidity();
        this.imageScoringForm.get('arr')['controls'][i].controls.frequency.updateValueAndValidity();
      }
    })
  }
  onClear(i) {
    this.imageScoringForm.get('arr')['controls'][i].controls.startDate.setValidators([]);
    this.imageScoringForm.get('arr')['controls'][i].controls.endDate.setValidators([]);
    this.imageScoringForm.get('arr')['controls'][i].controls.frequency.setValidators([]);
    this.imageScoringForm.get('arr')['controls'][i].controls.startDate.updateValueAndValidity();
    this.imageScoringForm.get('arr')['controls'][i].controls.endDate.updateValueAndValidity();
    this.imageScoringForm.get('arr')['controls'][i].controls.frequency.updateValueAndValidity();
  }

  getUniqPushList(i) {
    this.pushlistUniqList = [];
    this.pushList.forEach(element => {
      element["available"] = true
    });
    console.log("this.addPlanForm", this.imageScoringForm.value.arr);
    const exitStudies = [];
    this.imageScoringForm.value.arr.forEach(element => {
      exitStudies.push(element.imageScoring?.imageScoringScaleId)
    });
    console.log("this.exitStudies", exitStudies, this.pushList);
    this.pushList.forEach(element => {
      if (exitStudies.includes(element.imageScoringScaleId)) {
        element["available"] = false;
      } else {
        element["available"] = true;
      }
    });;
    console.log("this.pushList", this.pushList);
    this.pushList.forEach(element => {
      console.log('element.available', element.available)
      if (element.available) {
        this.pushlistUniqList.push(element);
      }
    });
    console.log("this.pushlistUniqList", this.pushlistUniqList);
    this.imageScoringForm.controls.arr['controls'][i].patchValue({
      pushList: this.pushlistUniqList
    })
  }

  getImageScoringList() {
    this.spinner.show();
    this.clinicService.getStudy(`/api/imageScoringScales/getImageScoringScaleList`, '').subscribe(res => {
      if (res.status.success === true) {
        this.pushList = res.response.imageScoringScaleList;
        this.imageScoringForm.controls.arr['controls'].forEach((element, i) => {
          this.imageScoringForm.controls.arr['controls'][i].patchValue({
            pushList: this.pushList
          });
        })

        this.spinner.hide();
      }
      else {
        this.toastr.error(res.errors[0].message);
        this.spinner.hide();
      }
    },
      err => {
        if (err.status == 500) {
          this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
          this.spinner.hide();
        }
        else {
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
          this.spinner.hide();
        }
      }
    );
  }

  fSelected(i) {
    console.log(" this.imageScoringForm.", this.imageScoringForm.value.arr[i].frequency);
  }

  async ngOnInit() {

    await this.getImageScoringList();
    if (this.router.url.indexOf('/edit-clinic') > -1) {
      console.log("this.router.url", this.router.url);
      let str = this.router.url;
      let id = str.split("edit-clinic/")[1].split("/")[0];
      this.editFlag = true;
      this.editId = id;
    }

    let res = this.tabservice.getModelData() ? this.tabservice.getModelData() : {};

    if (!res || (res && !res.basicDetails)) {
      if (!this.editFlag)
        this.router.navigate(['/user/clinics/add-new-clinic/basic-details']);
      else
        this.router.navigate([`/user/clinics/edit-clinic/${this.editId}/basic-details`]);
      return;
    }

    if (res.basicDetails.start_date && res.basicDetails.end_date) {
      this.studyStartDate = moment(new Date(res.basicDetails.start_date)).format("MM-DD-YYYY");
      this.studyEndDate = moment(new Date(res.basicDetails.end_date)).format("MM-DD-YYYY");
    }

  }


  toggleMeridian() {
    this.meridian = !this.meridian;
  }


  startdateSelect() {
    console.log("sdsdsd");
    this.imageScoringForm.value.arr.forEach((ele, i) => {
      if (moment(ele.endDate) < moment(ele.startDate)) {
        this.imageScoringForm.controls.arr['controls'][i].patchValue({
          'endDate': ''
        })
      }
    })

  }


  next() {
    this.imageScoringForm.markAllAsTouched();
    if (this.imageScoringForm.valid) {
      this.submitFlag = true;
      this.clinicService.setNext();
      //push Notification empty remove
      let editData7 = Object.assign({});
      let editData7Arr = [];
      this.imageScoringForm.value.arr.forEach(ele => {

        if (ele.imageScoring != '') {
          editData7Arr.push(
            {
              imageScoring: ele.imageScoring ? ele.imageScoring : '',
              startDate: ele.startDate ? ele.startDate : '',
              endDate: ele.endDate ? ele.endDate : '',
              disabled: true,
              frequency: ele.frequency ? ele.frequency : ''
            }
          );
        }
      })
      editData7["arr"] = editData7Arr;
      this.tabservice.setModelData(editData7, 'imageScoring');

      // this.tabservice.setModelData(this.imageScoringForm.value, 'pushNotification'); //removed for checking empty

      this.tabservice.setModelData(this.imageScoringForm.valid, 'isImageScoringValid');
      let data = this.tabservice.getModelData();
      console.log("datadatadata", data);
      if (!this.editFlag) {
        this.router.navigate(['/user/clinics/add-new-clinic/questionnaire']);
      }
      else {
        this.router.navigate([`/user/clinics/edit-clinic/${this.editId}/questionnaire`]);
      }
    }
    else {
      this.submitFlag = false;
    }
  }

  backToList() {
    this.router.navigate(['/user/clinics']);
  }

  ngAfterViewInit() {

    this.spinner.show();
    this.tabservice.dataModel$.subscribe(res => {
      console.log(res);
      let data = this.tabservice.getModelData() ? this.tabservice.getModelData() : {};
      console.log("dattaaaa", data);
      if ((data.hasOwnProperty('imageScoring'))){
        res = res ? (res['imageScoring'] ? res['imageScoring'] : '') : '';
        console.log("imageScoring", res);
        let rest = res ? res.arr : '';
        if (rest) {
          console.log("restrest", rest);
          rest.forEach((ele, i) => {
            this.imageScoringForm.controls.arr['controls'][i].patchValue({
              imageScoring: {
                imageScaleName: ele.imageScoring.imageScaleName ? ele.imageScoring.imageScaleName : '',
                imageScoringScaleId: ele.imageScoring.imageScoringScaleId ? ele.imageScoring.imageScoringScaleId : ''
              },
              startDate: ele.startDate ? this.customDatePipe.transform(ele.startDate, 'MM-dd-yyyy') : '',
              endDate: ele.endDate ? this.customDatePipe.transform(ele.endDate, 'MM-dd-yyyy') : '',
              disabled: ele.disabled,
              frequency: ele.frequency ? ele.frequency : '',
              pushList: this.pushList
            });
            if (i < (rest.length - 1)) {
              console.log(i, rest.length - 1)
              this.addItem();
            }
          });
        }
      }
    });
    this.spinner.hide();
  }

  back() {
    let res = this.tabservice.getModelData() ? this.tabservice.getModelData() : {}
    debugger;
    if (!this.editFlag) {
      this.router.navigate(['/user/clinics/add-new-clinic/push-notification-study']);
    }
    else {
      this.router.navigate([`/user/clinics/edit-clinic/${this.editId}/push-notification-study`]);
    }
  }

  canDeactivate(component, route, state, next) {


    console.log('i am navigating away');
    console.log("routein basic", next.url);
    let modaldata = this.tabservice.getModelData();

    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }

    //add and edit both should be satisfied
    if (next.url.indexOf('/basic-details') > -1 || next.url.indexOf('/add-plans') > -1 || next.url.indexOf('/add-notes') > -1 || next.url.indexOf('/mobile-app-config') > -1 || next.url.indexOf('/push-notification-study') > -1){
 
      if (this.imageScoringForm.valid) {
        this.tabservice.setModelData(this.imageScoringForm.value, 'imageScoring');
      }
      return true;
    }

    if (next.url.indexOf('/add-new-clinic') > -1 || next.url.indexOf('/edit-clinic') > -1) {
      this.imageScoringForm.markAllAsTouched();
      if (this.imageScoringForm.valid) {
        console.log("this.submitFlag", this.submitFlag);
        this.submitFlag = true;
        console.log("this.imageScoringForm.value", this.imageScoringForm.value);

        //push Notification empty remove
        let editData7 = Object.assign({});
        let editData7Arr = [];
        this.imageScoringForm.value.arr.forEach(ele => {

          if (ele.imageScoring != '') {
            editData7Arr.push(
              {
                imageScoring: ele.imageScoring ? ele.imageScoring : '',
                startDate: ele.startDate ? ele.startDate : '',
                endDate: ele.endDate ? ele.endDate : '',
                disabled: true,
                frequency: ele.frequency ? ele.frequency : ''
              }
            );
          }
        })
        editData7["arr"] = editData7Arr;
        this.tabservice.setModelData(editData7, 'imageScoring');

        console.log("this.imageScoringForm.value.arr", this.imageScoringForm.value.arr);
        // this.tabservice.setModelData(this.imageScoringForm.value, 'pushNotification');
        this.tabservice.setModelData(this.imageScoringForm.valid, 'isPushValid');
        let data = this.tabservice.getModelData();
        console.log("datadatadata", data);
      }
      else {
        this.submitFlag = false;
      }
    }
    else {
      let data = this.tabservice.getModelData() ? this.tabservice.getModelData() : {}
      console.log("Data", data, data.length)
      if (this.imageScoringForm.pristine == false || Object.keys(data).length > 0) {
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
