import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClinicService } from '../clinic.service';
import { ToastrService } from 'ngx-toastr';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';

@Component({
  selector: 'app-view-study-questionnaire',
  templateUrl: './view-study-questionnaire.component.html',
  styleUrls: ['./view-study-questionnaire.component.scss']
})
export class ViewStudyQuestionnaireComponent implements OnInit {

  headers: any;
  editFlag: boolean;
  editId: string;
  dataArr: any;
  isexternal: any;
  preludeUrl: string;
  constructor(
    public router: Router,
    private spinner: NgxSpinnerService,
    private clinicService: ClinicService,
    private toastr: ToastrService,
    public customDatePipe: CustomDateFormatPipe
  ) { }

  ngOnInit(): void {

    this.headers = [
      { label: "Questionnaire Name", checked: true },
      { label: "Occurrence", checked: true },
      { label: "Frequency", checked: true },
      { label: "Start Date", checked: true },
      { label: "End Date", checked: true },
    ];
    if (this.router.url.indexOf('/view-clinic') > -1) {
      console.log("this.router.url", this.router.url);
      let str = this.router.url;
      let id = str.split("view-clinic/")[1].split("/")[0];
      this.editFlag = true;
      this.editId = id;
      this.spinner.show();
      this.clinicService.getStudy(`/api/study/${id}`, '').subscribe(res => {
        console.log("res", res);
        if (res.status.success == true) {
          let study = res.response.rows;
          this.dataArr = study.questionnairesAssociated;
          this.isexternal = study.isExternal;
          this.preludeUrl = study.preludeUrl;
          console.log("this.dataArr", this.dataArr);
          this.dataArr.forEach(ele => {
            ele.startDate = this.customDatePipe.transform(ele.startDate, 'MM/dd/yyyy');
            ele.endDate = this.customDatePipe.transform(ele.endDate, 'MM/dd/yyyy');
          })
          this.spinner.hide();
        }
      },
        err => {
          this.spinner.hide();
          this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
        }
      );
    }
  }
  back() {
    this.router.navigate([`/user/clinics/view-clinic/${this.editId}/view-study-image-scoring`]);

  }
  next() {
    if (this.isexternal == 1 && this.preludeUrl != '') {
      this.router.navigate([`/user/clinics/view-clinic/${this.editId}/view-prelude-config`]);
    } else {
      this.router.navigate([`/user/clinics/view-clinic/${this.editId}/view-activity-factor`]);
    }
  }
}




