import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ValidationService } from 'projects/validation-message/src/lib/validation.service';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { Router, ActivatedRoute, NavigationEnd, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import * as moment from 'moment';
import { ClinicService } from '../clinic.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { AlertService } from 'src/app/components/alert-modal/alert.service';



@Component({
  selector: 'app-push-notification-study',
  templateUrl: './push-notification-study.component.html',
  styleUrls: ['./push-notification-study.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PushNotificationStudyComponent implements OnInit {
  displayURLField: boolean = false;
  addClinicForm: FormGroup;
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

    // this.addClinicForm = this.fb.group({
    //   'notificationName': ['', [Validators.required, ValidationService.whiteSpaceValidator]],
    //   'frequency': [''],
    //   'time':[''],
    //   'startDate': ['', [Validators.required]],
    //   'endDate': ['', [Validators.required]]
    // })
    this.addClinicForm = this.fb.group({
      arr: this.fb.array([this.createItem()])
    });
  }

  createItem() {
    // moment().format("MM-DD-YYYY")
    return this.fb.group({
      'notificationName': [''],
      'frequency': [''],
      'time':[''],
      'startDate': [''],
      'endDate': [''],
      'pushList': [],
      disabled: false
    })
  }
  addItem() {
    this.arr = this.addClinicForm.get('arr') as FormArray;
    this.arr.push(this.createItem());
  }

  removeItem(i: number) {
    this.arr = this.addClinicForm.get('arr') as FormArray;
    this.arr.removeAt(i);
    console.log(this.addClinicForm.value.arr[i]);

  }

  populate($event, formId) {
    console.log("event trgrd", $event);
    this.addClinicForm.controls.arr['controls'].forEach((ele, i) => {
      if (i == formId) {
        this.addClinicForm.get('arr')['controls'][i].controls.startDate.setValidators([Validators.required]);
        this.addClinicForm.get('arr')['controls'][i].controls.endDate.setValidators([Validators.required]);
        this.addClinicForm.get('arr')['controls'][i].controls.frequency.setValidators([Validators.required]);
        this.addClinicForm.get('arr')['controls'][i].controls.time.setValidators([Validators.required]);
        this.addClinicForm.get('arr')['controls'][i].controls.startDate.updateValueAndValidity();
        this.addClinicForm.get('arr')['controls'][i].controls.endDate.updateValueAndValidity();
        this.addClinicForm.get('arr')['controls'][i].controls.frequency.updateValueAndValidity();
        this.addClinicForm.get('arr')['controls'][i].controls.time.updateValueAndValidity();
      }
    })
  }
  onClear(i) {
    this.addClinicForm.get('arr')['controls'][i].controls.startDate.setValidators([]);
    this.addClinicForm.get('arr')['controls'][i].controls.endDate.setValidators([]);
    this.addClinicForm.get('arr')['controls'][i].controls.frequency.setValidators([]);
    this.addClinicForm.get('arr')['controls'][i].controls.time.setValidators([]);
    this.addClinicForm.get('arr')['controls'][i].controls.startDate.updateValueAndValidity();
    this.addClinicForm.get('arr')['controls'][i].controls.endDate.updateValueAndValidity();
    this.addClinicForm.get('arr')['controls'][i].controls.frequency.updateValueAndValidity();
    this.addClinicForm.get('arr')['controls'][i].controls.time.updateValueAndValidity();
  }

  getUniqPushList(i) {
    this.pushlistUniqList = [];
    this.pushList.forEach(element => {
      element["available"] = true
    });
    console.log("this.addPlanForm", this.addClinicForm.value.arr);
    const exitStudies = [];
    this.addClinicForm.value.arr.forEach(element => {
      exitStudies.push(element.notificationName ?.notificationId)
    });
    console.log("this.exitStudies", exitStudies, this.pushList);
    this.pushList.forEach(element => {
      if (exitStudies.includes(element.notificationId)) {
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
    this.addClinicForm.controls.arr['controls'][i].patchValue({
      pushList: this.pushlistUniqList
    })
  }
  
  getPushNotification() {
    this.spinner.show();
    this.clinicService.getStudy(`/api/lookup/getStudyPushNotifications`, '').subscribe(res => {
      if (res.status.success === true) {
        this.pushList = res.response.rows;
        this.addClinicForm.controls.arr['controls'].forEach((element, i) => {
        this.addClinicForm.controls.arr['controls'][i].patchValue({
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
    console.log(" this.addClinicForm." ,this.addClinicForm.value.arr[i].frequency);
    let freq = this.addClinicForm.value.arr[i].frequency;
    // if(freq == 'Only Once') {
    //     // end data is same as start date 
    //     // this.addClinicForm.
    //     this.maxDate = this.addClinicForm.value.arr[i].startDate;
    // }
  }

  async ngOnInit() {

    await this.getPushNotification();
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
  this.addClinicForm.value.arr.forEach((ele, i) => {
    if (moment(ele.endDate) < moment(ele.startDate)) {
      this.addClinicForm.controls.arr['controls'][i].patchValue({
        'endDate': ''
      })
    }
  })

}


  next() {

    this.addClinicForm.markAllAsTouched();
    if (this.addClinicForm.valid) {
      this.submitFlag = true;

       //push Notification empty remove
       let editData7 = Object.assign({});
       let editData7Arr = [];
       this.addClinicForm.value.arr.forEach(ele => {

         if(ele.notificationName != '') {
         editData7Arr.push(
           {
             notificationName : ele.notificationName ? ele.notificationName : '',
             startDate: ele.startDate ? ele.startDate : '',
             endDate: ele.endDate ? ele.endDate : '',
             disabled: true,
             frequency:ele.frequency ? ele.frequency : '',
             time:ele.time ? ele.time :''
           }
         );
       }
       })
       editData7["arr"] = editData7Arr;
       this.tabservice.setModelData(editData7, 'pushNotification');

      // this.tabservice.setModelData(this.addClinicForm.value, 'pushNotification'); //removed for checking empty

      this.tabservice.setModelData(this.addClinicForm.valid, 'isPushValid');
      let data = this.tabservice.getModelData();
      console.log("datadatadata", data);
      if (!this.editFlag) {
        this.router.navigate(['/user/clinics/add-new-clinic/study-image-scoring']);
      }
      else {
        this.router.navigate([`/user/clinics/edit-clinic/${this.editId}/study-image-scoring`]);
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
      if (!(data.hasOwnProperty('pushNotification'))) {
       
      }
      else {
    //     res = res ? (res['pushNotification'] ? res['pushNotification'] : '') : '';
    //     let rest = res ? res.arr : '';
    //     if (rest) {
    //       console.log("restrest", rest);
    //       rest = rest[0]
    //     this.addClinicForm.patchValue({
    //       'notificationName': rest.notificationName ? rest.notificationName : '',
    //       'frequency': rest.frequency ? rest.frequency : '',
    //       'time': rest.time ? rest.time :'',
    //       'startDate': rest.startDate ? this.customDatePipe.transform(rest.startDate, 'MM-dd-yyyy') : '',
    //       'endDate': rest.endDate ? this.customDatePipe.transform(rest.endDate, 'MM-dd-yyyy') : '',
    //     })

    //     console.log("this.addClinicFormthis.timee",this.addClinicForm.value.time)
 
    // }
    res = res ? (res['pushNotification'] ? res['pushNotification'] : '') : '';
    console.log("questionnaire", res);
    let rest = res ? res.arr : '';
    if (rest) {
      console.log("restrest", rest);
      rest.forEach((ele, i) => {
        this.addClinicForm.controls.arr['controls'][i].patchValue({
          notificationName: {
            notificationName: ele.notificationName.notificationName ? ele.notificationName.notificationName : '',
            notificationId: ele.notificationName.notificationId ? ele.notificationName.notificationId : ''
          },
          startDate: ele.startDate ? this.customDatePipe.transform(ele.startDate, 'MM-dd-yyyy') : '',
          endDate: ele.endDate ? this.customDatePipe.transform(ele.endDate, 'MM-dd-yyyy') : '',
          disabled: ele.disabled,
          frequency: ele.frequency ? ele.frequency : '',
          time: ele.time ? ele.time :'',
          pushList: this.pushList
        });

        if (i < (rest.length - 1)) {
          console.log(i, rest.length - 1)
          this.addItem();
        }

      })

    }
      }
   
    });
    this.spinner.hide();
  }

  back() {
    let res = this.tabservice.getModelData() ? this.tabservice.getModelData() : {}
    debugger;
    if (!this.editFlag) {
      this.router.navigate(['/user/clinics/add-new-clinic/mobile-app-config']);
    }
    else {
      this.router.navigate([`/user/clinics/edit-clinic/${this.editId}/mobile-app-config`]);
    }
  }
  
  canDeactivate(component, route, state, next) {


    console.log('i am navigating away');
    console.log("routein basic", next.url);
    let modaldata = this.tabservice.getModelData();

    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if (next.url.indexOf('/basic-details') > -1 || next.url.indexOf('/add-plans') > -1 || next.url.indexOf('/add-notes') > -1 || next.url.indexOf('/mobile-app-config') > -1){
      if(this.addClinicForm.valid) {
        this.tabservice.setModelData(this.addClinicForm.value, 'pushNotification');
      }
      return true;
    }
    
    if (next.url.indexOf('/add-new-clinic/add-notes') > -1){
      if(modaldata == '' || modaldata == undefined || modaldata.isPlanValid == false || modaldata.isPlanValid == undefined){
        this.toastr.error('Please select plan in the plan tab. Before navigating to the Notes tab.');
        return false;
      }
    }
    if (next.url.indexOf('/add-new-clinic/mobile-app-config') > -1){
      if(modaldata == '' || modaldata == undefined || modaldata.isPlanValid == false ||  modaldata.isPlanValid == undefined){
        this.toastr.error('Please select plan in the plan tab. Before navigating to the Mobile App Config tab.');
        return false;
      }else if(modaldata == '' || modaldata == undefined || modaldata.isNoteValid == false || modaldata.isNoteValid == undefined){
        this.toastr.error('Please select notes in the notes tab. Before navigating to the Mobile App Config tab.');
        return false;
      }
    }
    if (next.url.indexOf('/add-new-clinic') > -1 || next.url.indexOf('/edit-clinic') > -1) {
      this.addClinicForm.markAllAsTouched();
      if (this.addClinicForm.valid) {
        console.log("this.submitFlag", this.submitFlag);
        this.submitFlag = true;
        console.log("this.addClinicForm.value",this.addClinicForm.value);
    
        //push Notification empty remove
        let editData7 = Object.assign({});
        let editData7Arr = [];
        this.addClinicForm.value.arr.forEach(ele => {

          if(ele.notificationName != '') {
          editData7Arr.push(
            {
              notificationName : ele.notificationName ? ele.notificationName : '',
              startDate: ele.startDate ? ele.startDate : '',
              endDate: ele.endDate ? ele.endDate : '',
              disabled: true,
              frequency:ele.frequency ? ele.frequency : '',
              time:ele.time ? ele.time :''
            }
          );
        }
        })
        editData7["arr"] = editData7Arr;
        this.tabservice.setModelData(editData7, 'pushNotification');

        console.log("this.addClinicForm.value.arr",this.addClinicForm.value.arr);
        // this.tabservice.setModelData(this.addClinicForm.value, 'pushNotification');
        this.tabservice.setModelData(this.addClinicForm.valid, 'isPushValid');
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
      if (this.addClinicForm.pristine == false || Object.keys(data).length > 0) {
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
