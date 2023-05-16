import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { ReportsService } from '../../reports.service';

@Component({
  selector: 'app-list-reports',
  templateUrl: './list-reports.component.html',
  styleUrls: ['./list-reports.component.scss']
})
export class ListReportsComponent implements OnInit {

  headers: any;
  filterTypeArr: any[];
  RWFlag: boolean;
  modalRef2: NgbModalRef;
  reportId: any;
  reportName: any;
  showDataTable: boolean = false;
  statusChangeRec: any;

  @ViewChild('archiveContent') archiveContent: ElementRef;

  @ViewChild('customOptions') customOptions: ElementRef;

  constructor(
    public router: Router,
    public customDatePipe: CustomDateFormatPipe,
    private userDataService: UserDataService,
    private reportsService: ReportsService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "29") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }

    this.filterTypeArr =
      [
        {
          name: "Report Group",
          id: "reportGroup"
        },
        {
          name: "Status",
          id: "Status"
        }
      ];
  }

  ngAfterViewInit() {
    this.headers = this.getHeaders();
    this.showDataTable = true;
    this.changeDetector.detectChanges();
  }

  getHeaders() {
    return [
      { key: "reportGroupName", label: "Report Group", checked: true },
      { key: "reportName", label: "Report Name", checked: true },
      // { key: "reportUrl", label: "reportUrl", checked: true },
      { key: "modifiedDate", label: "Modified on", checked: true },
      {
        key: "static", label: "", checked: true, customTemplate: this.customOptions,
        jsonKeys: ['rowData'], width: 250
      }
    ];
  }

  formatter($event) {
    $event.forEach(ele => {
      ele.modifiedDate = this.customDatePipe.transform(ele.modifiedDate, 'MM/dd/yyyy');
      ele.id = ele.rnum;

      ele['customTemplateJson']['static'] = { 'rowData': ele };
    });
  }

  editReport(ele: any) {
    this.router.navigate(['user/reports/manage-reports/edit/', ele.reportId]);
  }

  deleteReportConfirm(ele: any) {
    let res = Object.assign({});
    res.id = ele.reportId;
    this.reportId = res.id;
    this.openPopup(this.archiveContent, 'xs');
    this.reportName = ele.reportName;
  }

  deleteReport() {
    this.spinner.show();
    this.reportsService.deleteReport(`/api/analyticalReports/deleteReport/${this.reportId}`, '').subscribe(res => {
      if (res.status.success === true) {
        this.reloadDatatable();
        this.toastr.success('Report deleted successfully!');
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.modalRef2.close();
      this.spinner.hide();
    },
      err => {
        this.modalRef2.close();
        this.spinner.hide();
        if (err.status == 500) {
          this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
        }
        else {
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
        }
      })
  }

  updateStatusConfirm(rec: any, event: any) {
    event.preventDefault();
    this.statusChangeRec = {
      reportGroupId: rec.reportGroupId,
      reportGroupName: rec.reportGroupName,
      reportId: rec.reportId,
      reportName: rec.reportName,
      reportUrl: rec.reportUrl,
      status: rec.status
    };
    this.openPopup(this.archiveContent, 'xs');
  }

  updateStatus() {
    this.spinner.show();
    if (this.statusChangeRec.status === 1)
      this.statusChangeRec.status = 0;
    else
      this.statusChangeRec.status = 1;
    this.reportsService.updateReport('/api/analyticalReports/updateReport', this.statusChangeRec).subscribe(res => {
      if (res.status.success === true) {
        this.reloadDatatable();
        this.toastr.success('Report updated successfully!');
        this.statusChangeRec = '';
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.modalRef2.close();
      this.spinner.hide();
    },
      err => {
        this.modalRef2.close();
        this.spinner.hide();
        if (err.status == 500) {
          this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
        }
        else {
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
        }
      })
  }

  openPopup(div, size) {
    console.log('div :::: ', div);
    this.modalRef2 = this.modalService.open(div, {
      size: size,
      windowClass: 'smallModal',
      backdrop: 'static',
      keyboard: false
    });
    this.modalRef2.result.then((result) => {
      console.log(result);
    }, () => {
    });
  }

  public reloadDatatable() {
    this.showDataTable = false;
    setTimeout(() => {
      this.showDataTable = true;
    }, 1000);
  }

  addReport() {
    this.router.navigate(['/user/reports/manage-reports/add']);
  }

}
