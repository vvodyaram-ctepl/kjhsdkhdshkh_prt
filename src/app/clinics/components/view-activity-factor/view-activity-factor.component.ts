import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ClinicService } from '../clinic.service';

@Component({
  selector: 'app-view-activity-factor',
  templateUrl: './view-activity-factor.component.html',
  styleUrls: ['./view-activity-factor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewActivityFactorComponent implements OnInit {
  editId: string;
  activityFactorData: any;
  isexternal: any;
  preludeUrl: string;

  constructor(
    public router: Router,
    private spinner: NgxSpinnerService,
    private clinicService: ClinicService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    if (this.router.url.indexOf('/view-clinic') > -1) {
      let str = this.router.url;
      let id = str.split("view-clinic/")[1].split("/")[0];
      this.editId = id;
      this.spinner.show();
      this.clinicService.getStudy(`/api/study/${id}`, '').subscribe((res: any) => {
        if (res.status.success == true) {
          this.activityFactorData = res.response.rows.activityFactorConfig;
          if (!this.activityFactorData.googleSheetUrl || this.activityFactorData.googleSheetUrl == '' || this.activityFactorData.googleSheetUrl == 'null') {
            this.activityFactorData.googleSheetUrl = '';
          }
          this.isexternal = res.response.rows.isExternal;
          this.preludeUrl = res.response.rows.preludeUrl;
          this.spinner.hide();
        }
      },
        (err: any) => {
          this.spinner.hide();
          this.toastr.error(err.error.message || 'Something went wrong. Please try after sometime or contact administrator.');
        }
      );
    }
  }

  back() {
    if (this.router.url.indexOf('/clinical-user/view-clinic-users/') > -1) {
      this.router.navigate([`/user/clinical-user/view-clinic-users/${this.editId}/view-associated-study`])
    }
    if (this.router.url.indexOf('/clinics/view-clinic/') > -1) {
      if (this.isexternal == 1 && this.preludeUrl != '') {
        this.router.navigate([`/user/clinics/view-clinic/${this.editId}/view-prelude-config`]);
      } else {
        this.router.navigate([`/user/clinics/view-clinic/${this.editId}/view-questionnaire`]);
      }
    }

  }
  next() {
    if (this.router.url.indexOf('/clinics/view-clinic/') > -1) {
      this.router.navigate([`/user/clinics/view-clinic/${this.editId}/view-activity`]);
    }
  }
}



