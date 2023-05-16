import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from 'projects/validation-message/src/lib/validation.service';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { Router, ActivatedRoute, NavigationEnd, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import * as moment from 'moment';
import { ClinicService } from '../clinic.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { AlertService } from 'src/app/components/alert-modal/alert.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { ValidationService as validation } from 'src/app/components/validation-message/validation.service';


@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.scss']
})
export class BasicDetailsComponent implements OnInit {
  displayURLField: boolean = false;
  addClinicForm: FormGroup;
  submitFlag: boolean = false;
  editFlag: boolean = false;
  editId: any;
  statusArr: { name: string; id: string; }[];
  mobileArr: any;
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

    this.addClinicForm = this.fb.group({
      'clinicName': ['', [Validators.required, ValidationService.whiteSpaceValidator, validation.exceptSpecialChar]],
      'start_date': ['', [Validators.required]],
      'end_date': ['', [Validators.required]],
      'description': [''],
      'pinv': [''],
      'status': [1, [Validators.required]],
      'disable': false,
      'isNotificationEnable': [1],
      'isExternalFlag': [0],
      'externalDisable': false,
      'externalLink': ['']
    })
  }

  async ngOnInit() {

    this.checkIsExternal();
    if (this.router.url.indexOf('/edit-clinic') > -1) {
      console.log("this.router.url", this.router.url);
      let str = this.router.url;
      let id = str.split("edit-clinic/")[1].split("/")[0];

      this.editFlag = true;
      this.editId = id;

      let data = this.tabservice.getModelData() ? this.tabservice.getModelData() : {};
      if (Object.keys(data).length == 0 || !data.basicDetails) {
        await this.getMenuItems();
        this.spinner.show();
        this.clinicService.getStudy(`/api/study/${id}`, '').subscribe(res => {
          this.spinner.show();
          if (res.status.success == true) {
            let studyDetails = res.response.rows;

            let editData1 = Object.assign({});
            editData1["clinicName"] = studyDetails.studyName ? studyDetails.studyName : '';
            editData1["start_date"] = studyDetails.startDate ? this.customDatePipe.transform(studyDetails.startDate, 'MM-dd-yyyy') : '';
            editData1["end_date"] = studyDetails.endDate ? this.customDatePipe.transform(studyDetails.endDate, 'MM-dd-yyyy') : '';
            editData1["pinv"] = studyDetails.principleInvestigator ? studyDetails.principleInvestigator : '';
            editData1["status"] = studyDetails.status;
            editData1["description"] = studyDetails.description ? studyDetails.description : '';
            editData1["externalLink"] = studyDetails.preludeUrl;
            editData1["isExternalFlag"] = studyDetails.isExternal;
            if (studyDetails.status == 0) {
              editData1["disable"] = true;
              editData1["isNotificationEnable"] = 0;
              this.addClinicForm.controls['isNotificationEnable'].disable();
            }
            else {
              editData1["disable"] = false;
              editData1["isNotificationEnable"] = studyDetails.isNotificationEnable;
              this.addClinicForm.controls['isNotificationEnable'].enable();
            }
            if (studyDetails.isExternal == 1) {
              editData1["externalDisable"] = true;
            }
            else {
              editData1["externalDisable"] = false;
            }

            this.tabservice.setModelData(editData1, 'basicDetails');

            //push Notification
            let editData7 = Object.assign({});
            let editData7Arr = [];
            studyDetails.pushNotificationsAssociated.forEach(ele => {

              let time = ele.displayTime ? ele.displayTime : '';
              let timeArr = time.split(":")
              let tgen: any = '';
              if (time) {
                tgen = { 'hour': parseInt(timeArr[0]), 'minute': parseInt(timeArr[1]), 'second': parseInt(timeArr[2]) }
              }

              editData7Arr.push(
                {
                  notificationName: {
                    notificationName: ele.notificationName ? ele.notificationName : '',
                    notificationId: ele.notificationId ? ele.notificationId : '',
                  },
                  startDate: ele.startDate ? ele.startDate : '',
                  endDate: ele.endDate ? ele.endDate : '',
                  disabled: true,
                  frequency: ele.frequency ? ele.frequency : '',
                  time: tgen
                }
              );
            })
            editData7["arr"] = editData7Arr;
            this.tabservice.setModelData(editData7, 'pushNotification');

            //Image scoring starts..
            let editDataImgScoring = Object.assign({});
            let editDataImgScoringArr = [];
            studyDetails.imageScoringSaclesAssociated.forEach(ele => {
              editDataImgScoringArr.push(
                {
                  imageScoring: {
                    imageScaleName: ele.imageScaleName ? ele.imageScaleName : '',
                    imageScoringScaleId: ele.imageScoringId ? ele.imageScoringId : '',
                  },
                  startDate: ele.startDate ? ele.startDate : '',
                  endDate: ele.endDate ? ele.endDate : '',
                  disabled: true,
                  frequency: ele.frequencyId ? ele.frequencyId : ''
                }
              );
            })
            editDataImgScoring["arr"] = editDataImgScoringArr;
            this.tabservice.setModelData(editDataImgScoring, 'imageScoring');
            //Image scoring ends...

            let editData2 = Object.assign({});
            let editData2Arr = [];
            studyDetails.plansSubscribed.forEach(ele => {
              editData2Arr.push(
                {
                  disabled: true,
                  planName: { "planName": ele.planName ? ele.planName : '', "planId": ele.planId ? ele.planId : '', "available": false },
                  dateSubscribed: ele.subscribedDate ? this.customDatePipe.transform(ele.subscribedDate, 'MM-dd-yyyy') : ''
                }
              );
            })
            editData2["arr"] = editData2Arr;
            this.tabservice.setModelData(editData2, 'addPlan');


            let editData4 = Object.assign({});
            let editData4Arr = [];

            this.mobileArr.forEach((rele, i) => {
              studyDetails.mobileAppConfigs.forEach((ele, j) => {
                if (rele.mobileAppConfigId == ele) {
                  editData4Arr.push({
                    'menuName': { mobileAppConfigName: rele.mobileAppConfigName, mobileAppConfigId: ele },
                    'menuCheck': true,
                    'weightUnit': studyDetails.weightUnit,
                    'eatingStartDate': studyDetails.entsmScaleStartDate ? this.customDatePipe.transform(studyDetails.entsmScaleStartDate, 'MM-dd-yyyy') : '',
                    'eatingEndDate': studyDetails.entsmScaleEndDate ? this.customDatePipe.transform(studyDetails.entsmScaleEndDate, 'MM-dd-yyyy') : ''
                  });
                }
              });
            });
            editData4["permissionMap"] = editData4Arr;
            this.tabservice.setModelData(editData4, 'mobileApp');

            this.tabservice.setModelData(studyDetails.weightUnit, 'weightUnit')

            let editData5 = Object.assign({});
            let editData5Arr = [];
            studyDetails.questionnairesAssociated.forEach(ele => {
              editData5Arr.push(
                {
                  questionnaireName: {
                    questionnaireName: ele.questionnaireName ? ele.questionnaireName : '',
                    questionnaireId: ele.questionnaireId ? ele.questionnaireId : '',
                  },
                  startDate: ele.startDate ? ele.startDate : '',
                  endDate: ele.endDate ? ele.endDate : '',
                  occuranceId: ele.occuranceId ? ele.occuranceId : '',
                  frequencyId: ele.frequencyId ? ele.frequencyId : '',
                  disabled: true
                }
              );
            })
            editData5["arr"] = editData5Arr;
            this.tabservice.setModelData(editData5, 'questionnaire');

            //prelude data
            let editData6 = Object.assign({});
            let editData6Arr = [];
            studyDetails.preludeAssociated && studyDetails.preludeAssociated.forEach(ele => {
              editData6Arr.push(
                {
                  // questionnaireName: {
                  //   questionnaireName: ele.questionnaireName ? ele.questionnaireName : '',
                  //   questionnaireId: ele.questionnaireId ? ele.questionnaireId : '',
                  // },
                  formName: ele.formName ? ele.formName : '',
                  category: ele.category ? ele.category : '',
                  preludeGroup: ele.preludeGroup ? ele.preludeGroup : '',
                  fieldName: ele.fieldName ? ele.fieldName : '',
                  extractDefId: ele.extractDefId ? ele.extractDefId : '',
                  disabled: true
                }
              );
            })
            editData6["arr"] = editData6Arr;
            editData6["preludeMandatory"] = studyDetails.preludeMandatory;
            this.tabservice.setModelData(editData6, 'preludeConfig');


            //activity factor
            this.tabservice.setModelData(studyDetails.activityFactorConfig, "activityFactorConfig");

          }
          else {
            this.toastr.error(res.errors[0].message);
          }
          this.spinner.hide();
        }, err => {

          console.log(err);
          if (err.status == 500) {
            this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
          }
          else {
            this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
          }
          this.spinner.hide();
        }
        );
      }
    }

  }

  checkIsExternal() {
    if (this.addClinicForm.value.isExternalFlag == true || this.addClinicForm.value.isExternalFlag == 1) {
      this.clinicService.setModelData({ external: true });
      localStorage.setItem('external', 'true');

      this.checkTabs();

      this.displayURLField = true;
      this.addClinicForm.controls['start_date'].setValidators([]);
      this.addClinicForm.controls['end_date'].setValidators([]);
      this.addClinicForm.controls['start_date'].updateValueAndValidity();
      this.addClinicForm.controls['end_date'].updateValueAndValidity();
      this.addClinicForm.controls['externalLink'].enable();
      /* this.addClinicForm.controls['externalLink'].setValidators([Validators.required]);
      this.addClinicForm.controls['externalLink'].updateValueAndValidity(); */
    } else {
      this.clinicService.setModelData({ external: false });
      localStorage.setItem('external', 'false');

      this.checkTabs();

      this.displayURLField = false;
      this.addClinicForm.controls['start_date'].setValidators([Validators.required]);
      this.addClinicForm.controls['end_date'].setValidators([Validators.required]);
      this.addClinicForm.controls['start_date'].updateValueAndValidity();
      this.addClinicForm.controls['end_date'].updateValueAndValidity();
      this.addClinicForm.controls['externalLink'].disable();
      this.addClinicForm.controls['externalLink'].patchValue('');

      // this.tabservice.setModelData({}, 'preludeConfig');
    }
  }

  private async getMenuItems() {
    this.spinner.show();
    let res: any = await (
      this.clinicService.getMobileConData(`/api/lookup/getMobileAppConfigs`, '').pipe(
        catchError(err => {
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
          return of(false);
        })
      )
    ).toPromise();
    if (res.status.success === true) {
      this.mobileArr = res.response.mobileAppConfigs;
      this.spinner.hide();
    }
  }

  startdateSelect() {
    if (moment(this.addClinicForm.value.end_date) < moment(this.addClinicForm.value.start_date)) {
      this.addClinicForm.patchValue({
        'end_date': ''
      })
    }
  }

  statusChange() {
    if (this.addClinicForm.value.status == '0') {
      this.addClinicForm.controls['isNotificationEnable'].disable();
      if (this.addClinicForm.controls['isNotificationEnable'].value == '1') {
        this.addClinicForm.patchValue({
          'isNotificationEnable': 0
        });
      }
    } else {
      this.addClinicForm.controls['isNotificationEnable'].enable();
    }
  }

  next() {

    this.addClinicForm.markAllAsTouched();
    if (this.addClinicForm.valid) {
      this.submitFlag = true;
      this.tabservice.setModelData(this.addClinicForm.value, 'basicDetails');
      if (!this.editFlag) {
        this.router.navigate(['/user/clinics/add-new-clinic/add-plans']);
      }
      else {
        this.router.navigate([`/user/clinics/edit-clinic/${this.editId}/add-plans`]);
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
      let data = this.tabservice.getModelData() ? this.tabservice.getModelData() : {};
      if (!(data.hasOwnProperty('basicDetails'))) {
        this.addClinicForm.patchValue({
          'status': 1
        })
      }
      else {
        res = res ? (res['basicDetails'] ? res['basicDetails'] : '') : '';
        this.addClinicForm.patchValue({
          'clinicName': res.clinicName ? res.clinicName : '',
          'start_date': res.start_date ? this.customDatePipe.transform(res.start_date, 'MM-dd-yyyy') : '',
          'end_date': res.end_date ? this.customDatePipe.transform(res.end_date, 'MM-dd-yyyy') : '',
          'pinv': res.pinv ? res.pinv : '',
          'status': res.status,
          'description': res.description,
          'isNotificationEnable': res.isNotificationEnable,
          'externalLink': res.externalLink,
          'isExternalFlag': res.isExternalFlag == 1 ? true : false,
          'disable': res.disable,
          'externalDisable': res.externalDisable
        })
      }
      this.checkIsExternal();
    });
    this.spinner.hide();
  }

  checkTabs() {
    let evt = document.createEvent("Event");
    evt.initEvent("isAmCliniClicked", true, true);
    window.dispatchEvent(evt);
  }

  canDeactivate(component, route, state, next) {
    console.log('i am navigating away');
    console.log("routein basic", next.url);
    localStorage.setItem('isPreludeUrl', this.addClinicForm.value.externalLink || '');
    this.checkTabs();
    let modaldata = this.tabservice.getModelData();

    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if (next.url.indexOf('/add-new-clinic/questionnaire') > -1) {
      if (modaldata == '' || modaldata == undefined || modaldata.isPlanValid == false || modaldata.isPlanValid == undefined) {
        this.toastr.error('Please select plan in the plan tab. Before navigating to the Questionnaire tab.');
        return false;
      } else if (modaldata == '' || modaldata == undefined || modaldata.isNoteValid == false || modaldata.isNoteValid == undefined) {
        this.toastr.error('Please select notes in the notes tab. Before navigating to the Questionnaire tab.');
        return false;
      } else if (modaldata == '' || modaldata == undefined || modaldata.isMobileAppValid == false || modaldata.isMobileAppValid == undefined) {
        let formArr = modaldata.mobileApp.permissionMap;
        //filter array
        let result = formArr.filter(item => item.menuCheck === true);
        if (result.length == 0)
          this.toastr.error('Please select at least one menu. Before navigating to the Questionnaire tab.');
        else
          this.toastr.error("Please select all mandatory fields in Mobile app config tab");
        return false;
      }
    }
    if (next.url.indexOf('/add-new-clinic/add-notes') > -1) {
      if (modaldata == '' || modaldata == undefined || modaldata.isPlanValid == false || modaldata.isPlanValid == undefined) {
        this.toastr.error('Please select plan in the plan tab. Before navigating to the Notes tab.');
        return false;
      }
    }

    if (next.url.indexOf('/add-new-clinic/push-notification-study') > -1) {
      if (modaldata == '' || modaldata == undefined || modaldata.isPlanValid == false || modaldata.isPlanValid == undefined) {
        this.toastr.error('Please select plan in the plans tab. Before navigating to the Push Notification tab.');
        return false;
      }
      else if (modaldata == '' || modaldata == undefined || modaldata.isNoteValid == false || modaldata.isNoteValid == undefined) {
        this.toastr.error('Please select notes in the Notes tab. Before navigating to the Push Notification tab.');
        return false;
      }
      else if (modaldata == '' || modaldata == undefined || modaldata.isMobileAppValid == false || modaldata.isMobileAppValid == undefined) {
        let formArr = modaldata.mobileApp.permissionMap;
        //filter array
        let result = formArr.filter(item => item.menuCheck === true);
        if (result.length == 0)
          this.toastr.error('Please select at least one menu. Before navigating to the Push Notification tab.');
        else
          this.toastr.error("Please select all mandatory fields in Mobile app config tab");
        return false;
      }
    }

    if (next.url.indexOf('/add-new-clinic/study-image-scoring') > -1) {
      if (modaldata == '' || modaldata == undefined || modaldata.isPlanValid == false || modaldata.isPlanValid == undefined) {
        this.toastr.error('Please select plan in the plans tab. Before navigating to the Image Scoring tab.');
        return false;
      }
      else if (modaldata == '' || modaldata == undefined || modaldata.isNoteValid == false || modaldata.isNoteValid == undefined) {
        this.toastr.error('Please select notes in the Notes tab. Before navigating to the Image Scoring tab.');
        return false;
      }
      else if (modaldata == '' || modaldata == undefined || modaldata.isMobileAppValid == false || modaldata.isMobileAppValid == undefined) {
        let formArr = modaldata.mobileApp.permissionMap;
        //filter array
        let result = formArr.filter(item => item.menuCheck === true);
        if (result.length == 0)
          this.toastr.error('Please select at least one menu. Before navigating to the Image Scoring tab.');
        else
          this.toastr.error("Please select all mandatory fields in Mobile app config tab");
        return false;
      }
    }

    if (next.url.indexOf('/add-new-clinic/mobile-app-config') > -1) {
      if (modaldata == '' || modaldata == undefined || modaldata.isPlanValid == false || modaldata.isPlanValid == undefined) {
        this.toastr.error('Please select plan in the plan tab. Before navigating to the Mobile App Config tab.');
        return false;
      } else if (modaldata == '' || modaldata == undefined || modaldata.isNoteValid == false || modaldata.isNoteValid == undefined) {
        this.toastr.error('Please select notes in the notes tab. Before navigating to the Mobile App Config tab.');
        return false;
      }
    }
    if (next.url.indexOf('/add-new-clinic') > -1 || next.url.indexOf('/edit-clinic') > -1) {
      this.addClinicForm.markAllAsTouched();
      if (this.addClinicForm.valid) {
        this.submitFlag = true;
        this.tabservice.setModelData(this.addClinicForm.value, 'basicDetails');
      }
      else {
        this.submitFlag = false;
      }
    }
    else {
      let data = this.tabservice.getModelData() ? this.tabservice.getModelData() : {};
      if (this.addClinicForm.touched) { //this.addClinicForm.pristine == false
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
