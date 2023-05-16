import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from 'src/app/components/alert-modal/alert.service';
import { ValidationService } from 'src/app/components/validation-message/validation.service';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { ReportsService } from '../../reports.service';

@Component({
  selector: 'app-add-new-report',
  templateUrl: './add-new-report.component.html',
  styleUrls: ['./add-new-report.component.scss']
})
export class AddNewReportComponent implements OnInit {

  public reportsForm: FormGroup;
  editReport: boolean = false;
  reportGroups: any = [];
  submitFlag: boolean = false;
  reportUrl: any;
  loader: boolean = false;

  @ViewChild('testUrl') testUrl: ElementRef;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private reportsService: ReportsService,
    private toastr: ToastrService,
    private userService: UserDataService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.getReportGroups();
    this.activatedRoute.params.subscribe(params => {
      const path = this.activatedRoute.snapshot.url[0].path;
      if (path === 'edit') {
        this.spinner.show();
        this.editReport = true;
        let id = this.router.url.split("edit/")[1].split("/")[0];
        this.getReportByIdAndPatch(id);
      }
      else {
        this.editReport = false;
      }
    });
  }

  getReportGroups() {
    this.reportsService.getReportGroups('/api/analyticalReports/getReportGroups').subscribe(res => {
      if (res.status.success === true) {
        this.spinner.hide();
        this.reportGroups = res.response.analyticalReportGroupList;
      } else {
        this.spinner.hide();
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
    })
  }

  getReportByIdAndPatch(reportId: number | string) {
    this.reportsService.getReportByReportId(`/api/analyticalReports/getReportById/${reportId}`).subscribe(res => {
      if (res.status.success === true) {
        this.reportsForm.patchValue(res.response.manageReports);
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
    });
  }

  public buildForm(): void {
    this.reportsForm = this.fb.group({
      reportId: [],
      reportGroupId: ['', [Validators.required]],
      reportName: ['', [Validators.required, ValidationService.exceptSpecialChar]],
      reportUrl: ['', [Validators.required]],
      status: [1]
    })
  }

  backToList() {
    this.router.navigate(['/user/reports']);
  }

  testURL() {
    this.loader = true;
    var params = {
      "userId": this.userService.getUserId()
    };
    var encodedParams = encodeURIComponent(JSON.stringify(params));

    this.reportUrl = this._sanitizer.bypassSecurityTrustResourceUrl(this.reportsForm.value.reportUrl + `?params=${encodedParams}`);

    this.modalService.open(this.testUrl, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
    setTimeout(() => {
      this.loader = false;
    }, 2000);
  }

  public submitReport() {
    if (!this.reportsForm.valid) {
      this.reportsForm.markAllAsTouched();
      return false;
    }
    this.submitFlag = true;
    let report = this.reportsForm.getRawValue();
    if (this.editReport) {
      report['modifiedBy'] = parseInt(this.userService.getUserId());
      report['reportUrl'] = encodeURIComponent(report.reportUrl);
      this.reportsService.updateReport('/api/analyticalReports/updateReport', report).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success('Report updated successfully!');
          this.reportsForm.markAsPristine();
          this.backToList();
        }
        else {
          this.toastr.error(res.errors[0].message);
        }
      }, err => {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
      });
    }
    else {
      report['createdBy'] = parseInt(this.userService.getUserId());
      this.reportsService.addReport('/api/analyticalReports/addReport', report).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success('Report added successfully!');
          this.reportsForm.markAsPristine();
          this.backToList();
        }
        else {
          this.toastr.error(res.errors[0].message);
        }
      }, err => {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
      });
    }
  }

  canDeactivate(component, route, state, next) {
    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if (next.url.indexOf('/user/reports') > -1 && this.submitFlag) {
      return true;
    }
    if (this.reportsForm.touched) { //this.reportsForm.pristine == false || this.reportsForm.dirty == false
      return this.alertService.confirm();
    }
    else {
      return true;
    }
  }

}
