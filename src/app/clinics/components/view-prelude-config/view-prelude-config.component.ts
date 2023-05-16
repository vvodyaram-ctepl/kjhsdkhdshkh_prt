import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ClinicService } from '../clinic.service';

@Component({
  selector: 'app-view-prelude-config',
  templateUrl: './view-prelude-config.component.html',
  styleUrls: ['./view-prelude-config.component.scss']
})
export class ViewPreludeConfigComponent implements OnInit {
  studyDetails: any;
  editId: any;
  preludeMandatory: any;
  optionalFields: any;

  constructor(
    private router: Router,
    private clinicService: ClinicService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    if (this.router.url.indexOf('/view-clinic') > -1) {
      console.log("this.router.url", this.router.url);
      let str = this.router.url;
      let id = str.split("view-clinic/")[1].split("/")[0];
      this.editId = id;
      this.spinner.show();
      this.clinicService.getStudy(`/api/study/${id}`, '').subscribe(res => {
        if (res.status.success == true) {
          let preludeData = res.response.rows;
          this.preludeMandatory = preludeData.preludeMandatory;
          this.optionalFields = preludeData.preludeAssociated;
        } else {
          this.toastr.error(res.errors[0].message);
        }
        this.spinner.hide();
      }, err => {
        if (err.status == 500) {
          this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
        }
        else {
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
        }
      })
    }
  }
  back() {
    this.router.navigate([`/user/clinics/view-clinic/${this.editId}/view-questionnaire`]);
  }
  next() {
    this.router.navigate([`/user/clinics/view-clinic/${this.editId}/view-activity-factor`]);
  }

}
