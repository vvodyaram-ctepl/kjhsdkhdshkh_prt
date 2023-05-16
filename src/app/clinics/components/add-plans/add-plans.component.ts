import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { Router } from '@angular/router';
import { LookupService } from 'src/app/services/util/lookup.service';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClinicService } from '../clinic.service';
import { ToastrService } from 'ngx-toastr';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/components/alert-modal/alert.service';

@Component({
  selector: 'app-add-plans',
  templateUrl: './add-plans.component.html',
  styleUrls: ['./add-plans.component.scss']
})
export class AddPlansComponent implements OnInit {

  addPlanForm: FormGroup;
  arr: FormArray;
  dataFromB: string;
  planlist: any;
  startDate: any;
  submitFlag: boolean = false;
  editFlag: boolean = false;
  editId: string;
  private modalRef: NgbModalRef;
  modalRef2: NgbModalRef;
  planlistUniqList: any[];

  constructor(private router: Router,
    private fb: FormBuilder,
    private tabservice: TabserviceService,
    private lookupservie: LookupService,
    private spinnerService: NgxSpinnerService,
    private clinicService: ClinicService,
    private toastr: ToastrService,
    public customDatePipe: CustomDateFormatPipe,
    private modalService: NgbModal,
    private alertService: AlertService
  ) {

  }

  getStudyById() {
    this.spinnerService.show();
    this.clinicService.getStudy(`/api/study/${this.editId}`, '').subscribe(res => {
      console.log("study", res);
      if (res.status.success == true) {
        let plan = res.response.rows.plansSubscribed;

        let editData2 = Object.assign({});
        let editData2Arr = [];
        plan.forEach(ele => {
          editData2Arr.push({
            planName: { "planName": ele.planName ? ele.planName : '', "planId": ele.planId ? ele.planId : '' },
            dateSubscribed: ele.subscribedDate ? this.customDatePipe.transform(ele.subscribedDate, 'MM-dd-yyyy') : ''
          });
        })
        editData2["arr"] = editData2Arr;
        this.tabservice.setModelData(editData2, 'addPlan');

        this.spinnerService.hide();
      }
    }, err => {

      console.log(err);
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
      this.spinnerService.hide();
    }
    )
  }
  async ngOnInit() {
    if (this.router.url.indexOf('/edit-clinic') > -1) {
      console.log("this.router.url", this.router.url);
      let str = this.router.url;
      let id = str.split("edit-clinic/")[1].split("/")[0]
      this.editFlag = true;
      this.editId = id;

      //  await this.getStudyById();
    }
    this.startDate = moment().format("MM-DD-YYYY");

    this.addPlanForm = this.fb.group({
      arr: this.fb.array([this.createItem()])
    });


    await this.getPlans();
    // this.tabservice.dataModel$.subscribe(res => {
    let res = this.tabservice.getModelData() ? this.tabservice.getModelData() : {}
    console.log("in edit plans on add");
    if (!res || (res && !res.basicDetails)) {
      if (!this.editFlag)
        this.router.navigate(['/user/clinics/add-new-clinic/basic-details']);
      else
        this.router.navigate([`/user/clinics/edit-clinic/${this.editId}/basic-details`]);
      return;
    }
    res = res ? (res['addPlan'] ? res['addPlan'] : '') : '';
    console.log("addPlan", res);
    let rest = res ? res.arr : '';
    if (rest) {
      console.log("restrest", rest);
      rest.forEach((ele, i) => {
        this.addPlanForm.controls.arr['controls'][i].patchValue({
          planName: ele.planName ? ele.planName : '',
          dateSubscribed: ele.dateSubscribed ? ele.dateSubscribed : '',
          disabled: ele.disabled,
          planlist: this.planlist
        });

        if (i < (rest.length - 1)) {
          console.log(i, rest.length - 1)
          this.addItem();
        }

      })

    }
    // })
  }

  getPlans() {
    this.spinnerService.show();
    this.lookupservie.getPlans('/api/plans/getPlans').subscribe(res => {
      console.log("ress", res);
      this.planlist = res.response.rows;
      this.addPlanForm.controls.arr['controls'].forEach((element, i) => {
        this.addPlanForm.controls.arr['controls'][i].patchValue({
          planlist: this.planlist
        });
      });
      this.spinnerService.hide();
    })
  }
  createItem() {
    return this.fb.group({
      planName: ['', [Validators.required]],
      dateSubscribed: [moment().format("MM-DD-YYYY"), [Validators.required]],
      disabled: false,
      planlist: []
    })
  }

  addItem() {
    this.arr = this.addPlanForm.get('arr') as FormArray;
    this.arr.push(this.createItem());
  }

  removeItem(i: number) {
    this.arr = this.addPlanForm.get('arr') as FormArray;
    this.arr.removeAt(i);
    console.log(this.addPlanForm.value.arr[i]);

  }

  // onSubmit($event) {
  //   console.log("addPlan",$event);

  // }

  findDuplicates() {
    let data = this.tabservice.getModelData();
    let dataArr = data.addPlan.arr;

    let newdataArr = JSON.parse(JSON.stringify(dataArr)); //shallow copy
    let newdataArr1 = JSON.parse(JSON.stringify(dataArr)); //shallow copy

    // for unique elements
    let uniqPlans = newdataArr1.filter((obj, index, self) =>
      index === self.findIndex((t) => (
        t.planName.planId == obj.planName.planId
      )));

    // for non unique elements
    let nonuniqPlans = newdataArr.filter((obj, index, self) =>
      index != self.findIndex((t) => (
        t.planName.planId == obj.planName.planId
      )));

    console.log("uniqPlans", uniqPlans);
    console.log("nonuniqPlans", nonuniqPlans);

    // for non unique and filter duplicate  elements
    let nonuniqPlansUniq = nonuniqPlans.filter((obj, index, self) =>
      index === self.findIndex((t) => (
        // t.study.studyId === obj.study.studyId
        t.planName.planId == obj.planName.planId
      )));

    console.log("nonuniqPlansUniq", nonuniqPlansUniq);

    let str = '';
    if (nonuniqPlansUniq) {
      if (nonuniqPlansUniq.length == 1) {
        str = str + nonuniqPlansUniq[0].planName.planName
      }
      else {
        nonuniqPlansUniq.forEach((ele, last) => {
          str = str + ele.planName.planName;
          if (!last) {
            str = str + ','
          }
        })
      }
    }

    if (uniqPlans.length > 0 && uniqPlans.length != dataArr.length) {
      this.toastr.error('Plan(s) ' + ' ' + str + ' ' + 'already associated with the study.');
      return false;
    }
  }

  getUniqStudyList(i) {
    this.planlistUniqList = [];
    this.planlist.forEach(element => {
      element["available"] = true
    });;
    console.log("this.addPlanForm", this.addPlanForm.value.arr);
    const exitStudies = [];
    this.addPlanForm.value.arr.forEach(element => {
      exitStudies.push(element.planName?.planId)
    });
    console.log("this.exitStudies", exitStudies, this.planlist);
    this.planlist.forEach(element => {
      if (exitStudies.includes(element.planId)) {
        element["available"] = false;
      } else {
        element["available"] = true;
      }
    });;
    console.log("this.planlist", this.planlist);
    this.planlist.forEach(element => {
      console.log('element.available', element.available)
      if (element.available) {
        this.planlistUniqList.push(element);
      }
    });
    console.log("this.planlistUniqList", this.planlistUniqList);
    this.addPlanForm.controls.arr['controls'][i].patchValue({
      planlist: this.planlistUniqList
    })
  }

  next() {
    console.log("dsd")
    console.log("formm", this.addPlanForm)
    this.addPlanForm.markAllAsTouched();
    if (this.addPlanForm.valid) {
      this.submitFlag = true;
      this.tabservice.setModelData(this.addPlanForm.value, 'addPlan');
      this.tabservice.setModelData(this.addPlanForm.valid, 'isPlanValid');
      let data = this.tabservice.getModelData();
      console.log("datadatadata", data.addPlan.arr);

      let st = this.findDuplicates();
      console.log("st", st);
      if (st != undefined && !st) {
        return;
      }

      if (!this.editFlag) {
        this.router.navigate(['/user/clinics/add-new-clinic/add-notes']);
      }
      else {
        this.router.navigate([`/user/clinics/edit-clinic/${this.editId}/view-notes`]);
      }
    }
    else {
      this.submitFlag = false;
    }


  }
  back() {
    if (!this.editFlag) {
      this.router.navigate(['/user/clinics/add-new-clinic/basic-details']);
    }
    else {
      this.router.navigate([`/user/clinics/edit-clinic/${this.editId}/basic-details`]);
    }
  }
  canDeactivate(component, route, state, next) {
    console.log('i am navigating away');
    console.log("routein basic", next.url);
    let modaldata = this.tabservice.getModelData();

    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    // if (next.url.indexOf('/add-new-clinic/basic-details') > -1){
    //   return true;
    // }
    if (next.url.indexOf('/add-new-clinic/questionnaire') > -1) {
      if (modaldata == '' || modaldata == undefined || modaldata.isNoteValid == false || modaldata.isNoteValid == undefined) {
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

    if (next.url.indexOf('/add-new-clinic/push-notification-study') > -1) {
      if (modaldata == '' || modaldata == undefined || modaldata.isNoteValid == false || modaldata.isNoteValid == undefined) {
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
    if (next.url.indexOf('/add-new-clinic/mobile-app-config') > -1) {
      if (modaldata == '' || modaldata == undefined || modaldata.isNoteValid == false || modaldata.isNoteValid == undefined) {
        this.toastr.error('Please select notes in the notes tab. Before navigating to the  Mobile App Config tab.');
        return false;
      }
    }
    if (next.url.indexOf('/add-new-clinic/study-image-scoring') > -1) {
      if (modaldata == '' || modaldata == undefined || modaldata.isNoteValid == false || modaldata.isNoteValid == undefined) {
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

    if ((!this.editFlag && next.url.indexOf('/add-new-clinic/basic-details') > -1) || (this.editFlag && next.url.indexOf(`/edit-clinic/${this.editId}/basic-details`) > -1)) {
      let formValue = this.addPlanForm.value;
      formValue.arr.forEach((ele, i) => {
        if (ele.planName == '') {
          formValue.arr.splice(i, 1);
        }
      })
      this.tabservice.setModelData(formValue, 'addPlan');
      this.tabservice.setModelData(this.addPlanForm.valid, 'isPlanValid');
      return true;
      // let findDuplicates =  this.findDuplicates();
      //   console.log("findDuplicates",findDuplicates);
      //   if(findDuplicates != undefined && !findDuplicates) {
      //     return;
      //   }
      // return true;
    }
    if (next.url.indexOf('/add-new-clinic') > -1 || next.url.indexOf('/edit-clinic') > -1) {
      this.addPlanForm.markAllAsTouched();
      if (this.addPlanForm.valid) {

        this.tabservice.setModelData(this.addPlanForm.value, 'addPlan');
        this.tabservice.setModelData(this.addPlanForm.valid, 'isPlanValid');
        let data = this.tabservice.getModelData();
        console.log("datadatadata", data);

        let findDuplicates = this.findDuplicates();
        console.log("findDuplicates", findDuplicates);
        if (findDuplicates != undefined && !findDuplicates) {
          return;
        }

        this.submitFlag = true;
      }
      else {
        this.submitFlag = false;
      }
    }
    else {
      let data = this.tabservice.getModelData() ? this.tabservice.getModelData() : {}
      if (this.addPlanForm.pristine == false || Object.keys(data).length > 0) {
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

  updateStudy() {
    if (this.editFlag) {
      this.router.navigate([`/user/clinics/edit-clinic/${this.editId}/add-plans`]).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      });
    }
    // this.spinnerService.show();
    //   this.clinicService.getStudy(`/api/study/${this.editId}`, '').subscribe(res => {
    //     console.log("study", res);
    //     if(res.status.success == true) {
    //       let plan = res.response.rows.plansSubscribed;
    //       plan.forEach((ele,i) => {
    //       this.addPlanForm.controls.arr['controls'][i].patchValue({
    //         planName:{"planName": ele.planName ? ele.planName : '',"planId":ele.planId ? ele.planId :''},
    //         dateSubscribed: ele.subscribedDate ?  this.customDatePipe.transform(ele.subscribedDate, 'MM-dd-yyyy') :''
    //       });
    //     });
    //     this.spinnerService.hide();
    //   }
    // }, err => {

    //   console.log(err);
    //   if (err.status == 500) {
    //     this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
    //   }
    //   else {
    //     this.toastr.error(err.error.errors[0] ?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    //   }
    //   this.spinnerService.hide();
    // }
    // )
  }


}
