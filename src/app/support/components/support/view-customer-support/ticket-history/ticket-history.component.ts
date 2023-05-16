import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SupportService } from 'src/app/support/support.service';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';

@Component({
  selector: 'app-ticket-history',
  templateUrl: './ticket-history.component.html',
  styleUrls: ['./ticket-history.component.scss']
})
export class TicketHistoryComponent implements OnInit {

  dataArr: any = [];
  id: any;
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private supportService: SupportService,
    private customDatePipe: CustomDateFormatPipe
  ) { }

  // data = JSON.stringify({
  //   "status": {
  //     "success": true,
  //     "httpStatus": 200
  //   },
  //   "response": {
  //     "rows": [
  //       {
  //         "ticketHistoryId": 15,
  //         "ticketId": 112,
  //         "resolutionProvidedBy": "cteadmin",
  //         "resolutionDate": "2021-03-18",
  //         "resolutionDetails": "Updated pet parent address To@#Updated pet parent address To ",
  //         "resolutionStatusId": 1,
  //         "resolutionStatus": "Open"
  //       },
  //       {
  //         "ticketHistoryId": 16,
  //         "ticketId": 112,
  //         "resolutionProvidedBy": "cteadmin",
  //         "resolutionDate": "2021-03-18",
  //         "resolutionDetails": "Updated@#Updated1@#Updated",
  //         "resolutionStatusId": 1,
  //         "resolutionStatus": "Open"
  //       }
  //     ]
  //   }
  // });



  ngOnInit(): void {
    if (this.router.url.indexOf('/view') > -1) {
      console.log("this.router.url", this.router.url);
      let str = this.router.url;
      this.id = str.split("view/")[1].split("/")[0];
      this.spinner.show();
      this.supportService.getSupportService(`/api/support/history/${this.id}`).subscribe(res => {
        if (res.status.success) {
          this.dataArr = res.response.rows;
          console.log("dataArr", this.dataArr);
          this.dataArr && this.dataArr.forEach(ele => {
            if (ele.resolutionDate) {
              ele.resolutionDate = this.customDatePipe.transform(ele.resolutionDate, 'MM/dd/yyyy HH:mm:ss');
            }
            if (ele.resolutionDetails == '') {
              ele['msgArr'] = false;
            }
            else {
              ele['msgArr'] = true;
            }
          })
        } else {
          this.toastr.error(res.errors[0].message);
        }
        this.spinner.hide();
      },
        err => {
          this.spinner.hide();
          this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
        }
      );
    }
  }
  back() {
    this.router.navigate([`/user/support/view/${this.id}/ticket-details`]);
  }
  backToList() {
    this.router.navigate(['/user/support']);
  }
}
