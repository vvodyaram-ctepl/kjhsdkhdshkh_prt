import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from 'src/app/components/alert-modal/alert.service';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { ClinicService } from '../clinic.service';

@Component({
  selector: 'app-activity-factor',
  templateUrl: './activity-factor.component.html',
  styleUrls: ['./activity-factor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ActivityFactorComponent implements OnInit {
  dataSourceArr: any[] = [];

  activityFactorForm: FormGroup;
  hasGoogleSheet: any

  editFlag: boolean;
  editId: string;
  submitFlag: boolean = false;

  constructor(
    private fb: FormBuilder,
    private tabservice: TabserviceService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private clinicService: ClinicService,
    private customDatePipe: CustomDateFormatPipe,
    private alertService: AlertService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.buildForm();

    if (this.router.url.indexOf('/edit-clinic') > -1) {
      let str = this.router.url;
      let id = str.split("edit-clinic/")[1].split("/")[0]
      this.editFlag = true;
      this.editId = id;
    }
    let res = this.tabservice.getModelData() ? this.tabservice.getModelData() : {};
    if (!res || (res && !res.basicDetails)) {
      if (!this.editFlag)
        this.router.navigate(['/user/clinics/add-new-clinic/basic-details']);
      else
        this.router.navigate([`/user/clinics/edit-clinic/${this.editId}/basic-details`]);
      return false;
    }

    if (res.basicDetails.isExternalFlag && res.basicDetails.externalLink) {
      if (!res.preludeDataList) {
        this.clinicService.getStudy('/api/study/getPreludeDataList/' + this.editId, '').subscribe(resp => {
          if (resp.response.preludeList.length)
            this.dataSourceArr = [{ name: "Google Sheet" }, { name: "Prelude" }];
          else
            this.dataSourceArr = [{ name: "Google Sheet" }];
        });
      }
      else if (res.preludeDataList.length) {
        this.dataSourceArr = [{ name: "Google Sheet" }, { name: "Prelude" }];
      }
      else {
        this.dataSourceArr = [{ name: "Google Sheet" }];
      }
    }
    else {
      this.dataSourceArr = [{ name: "Google Sheet" }];
      this.activityFactorForm.get('dataSource').patchValue([{ name: 'Google Sheet' }]);
      this.selectedSource(this.activityFactorForm.value.dataSource);
    }

    let activityFactorRes = res ? (res.activityFactorConfig ? res.activityFactorConfig : '') : '';
    if (activityFactorRes) {
      let sourceArr = [];
      if (activityFactorRes.googleSheetUrl && activityFactorRes.googleSheetUrl != '' &&
      activityFactorRes.googleSheetUrl != 'null' ) {
        sourceArr.push({ name: 'Google Sheet' });
      }
      if (activityFactorRes.hasPrelude) {
        sourceArr.push({ name: 'Prelude' });
      }
      activityFactorRes.startDate = activityFactorRes.startDate ? this.customDatePipe.transform(activityFactorRes.startDate, 'MM-dd-yyyy') : '';
      activityFactorRes.endDate = activityFactorRes.endDate ? this.customDatePipe.transform(activityFactorRes.endDate, 'MM-dd-yyyy') : '';
      this.activityFactorForm.patchValue({ dataSource: sourceArr });
      this.activityFactorForm.patchValue(activityFactorRes);
      this.selectedSource(this.activityFactorForm.value.dataSource)
    }
  }

  public buildForm(): void {
    this.activityFactorForm = this.fb.group({
      dataSource: [[]],
      hasPrelude: [],
      googleSheetUrl: [],
      startDate: [],
      endDate: []
    });
  }

  selectedSource(event: any) {
    this.hasGoogleSheet = event.filter((source: any) => source.name == 'Google Sheet');
    let hasPrelude = event.filter((source: any) => source.name == 'Prelude');
    if (this.hasGoogleSheet.length) {
      this.setAndUpdateValidators(this.activityFactorForm.get('googleSheetUrl'));
      this.setAndUpdateValidators(this.activityFactorForm.get('startDate'));
    }
    else {
      this.clearAndUpdateValidators(this.activityFactorForm.get('googleSheetUrl'));
      this.clearAndUpdateValidators(this.activityFactorForm.get('startDate'));
      this.activityFactorForm.get('endDate').reset();
    }
    if (hasPrelude.length) {
      this.activityFactorForm.get('hasPrelude').patchValue(1);
    }
    else {
      this.activityFactorForm.get('hasPrelude').patchValue(0);
    }
  }

  setAndUpdateValidators(ctrl: any) {
    ctrl.setValidators([Validators.required]);
    ctrl.updateValueAndValidity();
  }

  clearAndUpdateValidators(ctrl: any) {
    ctrl.clearValidators();
    ctrl.reset();
    ctrl.updateValueAndValidity();
  }

  back() {
    let external = (localStorage.getItem('external') == "true");
    if (external && localStorage.getItem('isPreludeUrl') != '') {
      this.router.navigate([`/user/clinics/edit-clinic/${this.editId}/prelude-config`]);
    }
    else {
      if (this.editFlag)
        this.router.navigate([`/user/clinics/edit-clinic/${this.editId}/questionnaire`]);
      else
        this.router.navigate([`/user/clinics/add-new-clinic/questionnaire`]);
    }
  }

  submit() {
    this.activityFactorForm.markAllAsTouched();
    if (!this.activityFactorForm.valid)
      return false;
    this.submitFlag = true;
    this.tabservice.setModelData(this.activityFactorForm.value, 'activityFactorConfig');

    let data = this.tabservice.getModelData() ? this.tabservice.getModelData() : {};
    console.log(data);
    let flag = false;
    if (this.editFlag) {
      flag = (!(data.hasOwnProperty('basicDetails')) || (!(data.hasOwnProperty('addPlan')) || data.isPlanValid == false) || (!(data.hasOwnProperty('mobileApp')) || data.isMobileAppValid == false) || (data.basicDetails.isExternalFlag && data.basicDetails.externalLink && (!(data.hasOwnProperty('preludeConfig')) || !(data.preludeConfig.preludeMandatory.length) || data.isPreludeValid == false)));
    } else {
      flag = (!(data.hasOwnProperty('basicDetails')) || !(data.hasOwnProperty('addPlan')) || !(data.hasOwnProperty('addNotes')) || !(data.hasOwnProperty('mobileApp')));
    }
    if (flag) {
      if (!(data.hasOwnProperty('basicDetails'))) {
        this.toastr.error("Please select all mandatory fields in basic details tab");
      }
      if (!(data.hasOwnProperty('addPlan')) || data.isPlanValid == false) {
        this.toastr.error("Please select all mandatory fields in plans tab");
      }
      if (!this.editFlag && !(data.hasOwnProperty('addNotes')) || data.isNoteValid == false) {
        this.toastr.error("Please select all mandatory fields in Notes tab");
      }
      if (!(data.hasOwnProperty('mobileApp')) || data.isMobileAppValid == false) {
        this.toastr.error("Please select all mandatory fields in Mobile app config tab");
      }
      if (data.basicDetails.isExternalFlag && data.basicDetails.externalLink && (!(data.hasOwnProperty('preludeConfig')) || !(data.preludeConfig.preludeMandatory.length) || data.isPreludeValid == false)) {
        this.toastr.error("Please select all mandatory fields in Prelude config tab");
      }
      return;
    }

    let res = Object.assign({});

    // Questionnaire Data
    let questionnaireArr = [];
    data.questionnaire.arr && data.questionnaire.arr.forEach(ele => {
      if (ele.questionnaireName != "" && ele.questionnaireName.questionnaireName != "") {
        questionnaireArr.push({
          "questionnaireId": ele.questionnaireName ? ele.questionnaireName.questionnaireId : '',
          "questionnaireName": ele.questionnaireName ? ele.questionnaireName.questionnaireName : '',
          "occuranceId": ele.occuranceId ? ele.occuranceId : '',
          "frequencyId": ele.frequencyId ? ele.frequencyId : '',
          "startDate": ele.startDate ? this.customDatePipe.transform(ele.startDate, 'yyyy-MM-dd') : '',
          "endDate": ele.endDate ? this.customDatePipe.transform(ele.endDate, 'yyyy-MM-dd') : ''
        })
      }
    });
    res['questionnairesAssociated'] = questionnaireArr;
    // Questionnaire Data

    //PRELUDE CONFIG DATA PREP
    if (this.editFlag) {
      let preludeAssociatedArr = [];
      data.preludeConfig.arr && data.preludeConfig.arr.forEach(ele => {
        if (ele.formName != "" && ele.formName.name != "") {
          preludeAssociatedArr.push({
            "formName": ele.formName ? (ele.formName.name ? ele.formName.name : ele.formName) : '',
            "category": ele.category ? (ele.category.name ? ele.category.name : ele.category) : '',
            "preludeGroup": ele.preludeGroup ? (ele.preludeGroup.name ? ele.preludeGroup.name : ele.preludeGroup) : '',
            "fieldName": ele.fieldName ? (ele.fieldName.name ? ele.fieldName.name : ele.fieldName) : '',
          })
        }
      });
      let preludeMandatoryArr = [];
      data.preludeConfig.preludeMandatory && data.preludeConfig.preludeMandatory.forEach(ele => {
        if (ele.formName != "" && ele.formName.name != "") {
          preludeMandatoryArr.push({
            "label": ele.label ? ele.label : '',
            "formName": ele.formName ? (ele.formName.name ? ele.formName.name : ele.formName) : '',
            "category": ele.category ? (ele.category.name ? ele.category.name : ele.category) : '',
            "preludeGroup": ele.preludeGroup ? (ele.preludeGroup.name ? ele.preludeGroup.name : ele.preludeGroup) : '',
            "fieldName": ele.fieldName ? (ele.fieldName.name ? ele.fieldName.name : ele.fieldName) : '',
          })
        }
      });
      res['preludeAssociated'] = preludeAssociatedArr;
      res['preludeMandatory'] = preludeMandatoryArr;
      res['patientId'] = "";
      res['petName'] = "";
      res['ownerLastName'] = "";
      res['ownerEmail'] = "";
    }
    //PRELUDE CONFIG DATA PREP

    if (this.editFlag) {
      res["studyId"] = this.editId;
    }
    let menu = [];
    let weightUnit = '';
    let entsmScaleStartDate: any;
    let entsmScaleEndDate: any;

    // MobileApp Config
    res["mobileAppConfigs"] = [];
    if (data.mobileApp && data.mobileApp.permissionMap.length > 0) {
      data.mobileApp.permissionMap.forEach(ele => {
        let menucheck = ele.menuCheck == true ? ele.menuCheck : false;
        if (menucheck == true) {
          menu.push(ele.menuName.mobileAppConfigId);
        }
        if (ele.menuName.mobileAppConfigId == 7) {
          weightUnit = ele.weightUnit
        }
        if (ele.menuName.mobileAppConfigId == 8) {
          entsmScaleStartDate = ele.eatingStartDate;
          entsmScaleEndDate = ele.eatingEndDate
        }
      });
      res["mobileAppConfigs"] = menu;
      res["weightUnit"] = weightUnit;
      res["entsmScaleStartDate"] = entsmScaleStartDate ? this.customDatePipe.transform(entsmScaleStartDate, 'yyyy-MM-dd') : '';
      res["entsmScaleEndDate"] = entsmScaleEndDate ? this.customDatePipe.transform(entsmScaleEndDate, 'yyyy-MM-dd') : '';
    }
    // MobileApp Config

    // Basic Details
    res["studyName"] = data.basicDetails.clinicName ? data.basicDetails.clinicName : '';
    res["principleInvestigator"] = data.basicDetails.pinv ? data.basicDetails.pinv : '';
    res["startDate"] = data.basicDetails.start_date ? this.customDatePipe.transform(data.basicDetails.start_date, 'yyyy-MM-dd') : '';
    res["endDate"] = data.basicDetails.end_date ? this.customDatePipe.transform(data.basicDetails.end_date, 'yyyy-MM-dd') : '';
    res["description"] = data.basicDetails.description ? data.basicDetails.description : '';
    res["status"] = data.basicDetails.status ? data.basicDetails.status : '';
    if (data.basicDetails.isNotificationEnable || data.basicDetails.isNotificationEnable == '1') {
      res["isNotificationEnable"] = 1;
    } else {
      res["isNotificationEnable"] = 0;
    }
    if (data.basicDetails.isExternalFlag || data.basicDetails.isExternalFlag == '1') {
      res["isExternal"] = 1;
    } else {
      res["isExternal"] = 0;
    }
    res["externalLink"] = data.basicDetails.externalLink ? data.basicDetails.externalLink : '';
    // Basic Details

    // Notes
    if (data.addNotes) {
      res["notes"] = data.addNotes.notes ? data.addNotes.notes : '';
    }
    // Notes

    //Push Notification
    let pushNotificationsArr = [];
    data.pushNotification && data.pushNotification.arr.forEach(ele => {
      if (ele.notificationName != "" && ele.notificationName.notificationName != "") {

        let time = ele.time ? ele.time : '';
        let hour: any = '';
        let minute: any = '';
        if (time) {
          hour = time.hour;
          if (hour < 10) {
            hour = '0' + hour
          }
          minute = time.minute;
          if (minute < 10) {
            minute = '0' + minute
          }
        }
        let tgen = time ? hour + ':' + minute : ''


        pushNotificationsArr.push({
          "notificationId": ele.notificationName ? ele.notificationName.notificationId : '',
          "notificationName": ele.notificationName ? ele.notificationName.notificationName : '',
          "startDate": ele.startDate ? this.customDatePipe.transform(ele.startDate, 'yyyy-MM-dd') : '',
          "endDate": ele.endDate ? this.customDatePipe.transform(ele.endDate, 'yyyy-MM-dd') : '',
          "frequency": ele.frequency ? ele.frequency : '',
          "displayTime": tgen,
        })
      }
    });
    res['pushNotificationsAssociated'] = pushNotificationsArr;
    //Push Notification

    //Image Scoring starts here...
    let imageScoringArr = [];
    data.imageScoring && data.imageScoring.arr.forEach(ele => {
      if (ele.imageScoring != "" && ele.imageScoring.imageScaleName != "") {
        imageScoringArr.push({
          "imageScoringId": ele.imageScoring.imageScoringScaleId ? ele.imageScoring.imageScoringScaleId : '',
          "startDate": ele.startDate ? this.customDatePipe.transform(ele.startDate, 'yyyy-MM-dd') : '',
          "endDate": ele.endDate ? this.customDatePipe.transform(ele.endDate, 'yyyy-MM-dd') : '',
          "frequencyId": ele.frequency ? ele.frequency : ''
        })
      }
    });
    res['imageScoringSaclesAssociated'] = imageScoringArr;
    //Image scoring ends here..

    // Plans
    let planArr = [];
    data.addPlan.arr && data.addPlan.arr.forEach(ele => {
      planArr.push({
        "planId": ele.planName.planId,
        "planName": ele.planName.planName,
        "subscribedDate": this.customDatePipe.transform(ele.dateSubscribed, 'yyyy-MM-dd')
      })
    });

    res["plansSubscribed"] = planArr;
    // Plans

    //Activity Factor Config
    res["activityFactorConfig"] = data.activityFactorConfig;
    res.activityFactorConfig.startDate = data.activityFactorConfig.startDate ? this.customDatePipe.transform(data.activityFactorConfig.startDate, 'yyyy-MM-dd') : '';
    res.activityFactorConfig.endDate = data.activityFactorConfig.endDate ? this.customDatePipe.transform(data.activityFactorConfig.endDate, 'yyyy-MM-dd') : '';

    this.spinner.show();
    this.clinicService.updateStudy('/api/study/', res).subscribe(res => {
      if (res.status.success === true) {
        this.toastr.success('Study updated successfully!');
        this.spinner.hide();
        this.tabservice.clearDataModel();
        this.router.navigate(['/user/clinics']);
      }
      else {
        this.toastr.error(res.errors[0].message);
        this.spinner.hide();
      }
    }, err => {
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
      this.spinner.hide();
    });
  }

  dateValidation() {
    if (this.activityFactorForm.value.startDate && this.activityFactorForm.value.endDate) {
      if (moment(this.activityFactorForm.value.endDate) < moment(this.activityFactorForm.value.startDate)) {
        this.activityFactorForm.patchValue({
          'endDate': ''
        })
      }
    }
  }

  canDeactivate(component, route, state, next) {
    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if (next.url.indexOf('/user/clinics') > -1 && this.submitFlag) {
      return true;
    }
    if (this.editFlag && (next.url.indexOf(`/edit-clinic/${this.editId}/basic-details`) > -1 || next.url.indexOf(`edit-clinic/${this.editId}/add-plans`) > -1 || next.url.indexOf(`/edit-clinic/${this.editId}/view-notes`) > -1 || next.url.indexOf(`/edit-clinic/${this.editId}/mobile-app-config`) > -1 || next.url.indexOf(`/edit-clinic/${this.editId}/questionnaire`) > -1 || (localStorage.getItem('external') && next.url.indexOf(`/edit-clinic/${this.editId}/prelude-config`) > -1))) {
      this.tabservice.setModelData(this.activityFactorForm.value, 'activityFactorConfig');
      return true;
    }
    if (next.url.indexOf('/add-new-clinic') > -1 || next.url.indexOf('/edit-clinic') > -1) {
      this.activityFactorForm.markAllAsTouched();
      if (this.activityFactorForm.valid) {
        this.submitFlag = true;
        this.tabservice.setModelData(this.activityFactorForm.value, 'activityFactorConfig');
      }
      else {
        this.submitFlag = false;
      }
    }
    else {
      let data = this.tabservice.getModelData() ? this.tabservice.getModelData() : {}
      if (this.activityFactorForm.pristine == false || Object.keys(data).length > 0) {
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