import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ViewEncapsulation } from '@angular/core';
import { AddUserService } from 'src/app/clinical-users/components/add-user.service';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { ClinicService } from '../clinic.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import * as moment from 'moment';
import { AlertService } from 'src/app/components/alert-modal/alert.service';

@Component({
  selector: 'app-view-notes',
  templateUrl: './view-notes.component.html',
  styleUrls: ['./view-notes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewNotesComponent implements OnInit {
  headers: any;
  dataArr: any[];
  dataNotesArr: any[];
  dataDateArr: any[];
  dataUserArr: any[];
  id: string;
  viewFlag: boolean;
  editFlag: boolean;
  addNotesForm: FormGroup;
  today = moment().format("MM-DD-YYYY");

  userProfileData: any;
  submitFlag: boolean;
  noteDataArray: any = [];
  constructor(
    public router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private clinicService: ClinicService,
    public customDatePipe: CustomDateFormatPipe,
    private fb: FormBuilder,
    private userDataService: UserDataService,
    private tabservice: TabserviceService,
    private alertService: AlertService
  ) {

    this.addNotesForm = this.fb.group({
      'notes': [''],
      'date': this.today,
      'userName': ['']
    })
  }

  ngOnInit() {
    this.headers = [
      // { label: "S.No", checked: true, clickable: true },
      { label: "Date", checked: true },
      { label: "Created By", checked: true },
      { label: "Notes", checked: true },
      // { label: "Description", checked: true },
      // { label: "Date", checked: true },
      // { label: "", checked: true, clickable: true, width: 85 }
    ];
    this.userProfileData = this.userDataService.getUserDetails();
    if (this.router.url.indexOf('/clinics/edit-clinic/') > -1 || this.router.url.indexOf('/clinics/view-clinic/') > -1) {
      let str = this.router.url;
      this.id = '';

      if (this.router.url.indexOf('/clinics/view-clinic/') > -1) {
        this.viewFlag = true;
        this.id = str.split("view-clinic/")[1].split("/")[0];
      }
      if (this.router.url.indexOf('/clinics/edit-clinic/') > -1) {
        this.editFlag = true;
        this.id = str.split("edit-clinic/")[1].split("/")[0];
        let res = this.tabservice.getModelData() ? this.tabservice.getModelData() : {},
          resp = res ? (res['addNotes'] ? res['addNotes'] : '') : '';
        if ((!res || (res && !res.basicDetails)) && this.router.url.indexOf('/view-clinic') == -1) {
          if (!this.editFlag)
            this.router.navigate(['/user/clinics/add-new-clinic/basic-details']);
          else
            this.router.navigate([`/user/clinics/edit-clinic/${this.id}/basic-details`]);
          return;
        }
        this.addNotesForm.patchValue({
          'notes': resp.notes ? resp.notes : '',
          'date': this.today
        })
      }

      this.spinner.show();
      //list service of notes

      this.clinicService.getStudy(`/api/study/${this.id}`, '').subscribe(res => {
        this.spinner.hide();
        let notes = res.response.rows.notes;
        if (notes.length > 0) {
          notes.forEach(element => {
            if (element && element.createdDate) {
              element.createdDate = this.customDatePipe.transform(element.createdDate, 'MM/dd/yyyy HH:mm:ss');
            }
          });
          this.noteDataArray = notes;
        }
      },
        err => {
          this.spinner.hide();
          this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
        }
      );

    }
    this.addNotesForm.patchValue({ 'userName': this.userProfileData.userName })

  }
  back() {
    if (this.editFlag) {
      this.router.navigate([`/user/clinics/edit-clinic/${this.id}/add-plans`])
    }
    if (this.viewFlag) {
      this.router.navigate([`/user/clinics/view-clinic/${this.id}/view-associated-pets`]);
    }

  }
  next() {
    this.addNotesForm.markAllAsTouched();
    if (this.addNotesForm.valid) {
      this.submitFlag = true;
      this.tabservice.setModelData(this.addNotesForm.value, 'addNotes');
      if (this.editFlag) {
        this.router.navigate([`/user/clinics/edit-clinic/${this.id}/mobile-app-config`]);
      }
      if (this.viewFlag) {
        this.router.navigate([`/user/clinics/view-clinic/${this.id}/mobile-app-config`]);
      }
    }
  }

  canDeactivate(component, route, state, next) {
    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if (next.url.indexOf('/add-new-clinic') > -1 || next.url.indexOf('/edit-clinic') > -1) {
      this.addNotesForm.markAllAsTouched();
      if (this.addNotesForm.valid) {
        this.submitFlag = true;
        this.tabservice.setModelData(this.addNotesForm.value, 'addNotes');
      }
    }
    else {
      let data = this.tabservice.getModelData() ? this.tabservice.getModelData() : {}
      if (this.addNotesForm.pristine == false || Object.keys(data).length > 0) {
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

  removeTags(str) {
    if ((str === null) || (str === ''))
      return false;
    else
      str = str.toString();
    return str.replace(/(<([^>]+)>)/ig, '');
  }

}
