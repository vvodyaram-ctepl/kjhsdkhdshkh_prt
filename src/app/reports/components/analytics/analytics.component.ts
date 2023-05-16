import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { ReportsService } from '../../reports.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  reports: any[] = [];
  public selectedReport: any;
  public selectedReportUrl: any = '';
  userId: any;
  loader: boolean = false;

  constructor(
    private userDataService: UserDataService,
    private reportsService: ReportsService,
    private activatedRoute: ActivatedRoute,
    private _sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit(): void {
    this.userId = this.userDataService.getUserId();

    this.activatedRoute.params.subscribe(params => {
      this.spinner.show();
      let reportGroupId = params.reportGroupId;
      this.reportsService.getReportsByReportGroupId(`/api/analyticalReports/getReportsByReportGroupId?filterType=reportGroupId&filterValue=${reportGroupId}`).subscribe(res => {
        if (res.status.success === true) {
          this.reports = res.response.rows;
          this.selectedReport = this.reports[0];
          this.onChangeReport();
        }
        else {
          this.toastr.error(res.errors[0].message);
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
      })
    });
  }

  onChangeReport() {
    this.loader = true;
    var params = {
      "userId": this.userId
    };
    var encodedParams = encodeURIComponent(JSON.stringify(params));
    if (this.reports.length)
      this.selectedReportUrl = this._sanitizer.bypassSecurityTrustResourceUrl(this.selectedReport.reportUrl + `?params=${encodedParams}`);

    setTimeout(() => {
      this.loader = false;
    }, 2000);
  }

}
