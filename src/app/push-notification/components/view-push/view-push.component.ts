// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-view-push',
//   templateUrl: './view-push.component.html',
//   styleUrls: ['./view-push.component.scss']
// })
// export class ViewPushComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ClinicService } from 'src/app/clinics/components/clinic.service';
import { ViewClinicComponent } from 'src/app/clinics/components/view-clinic/view-clinic.component';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';

@Component({
  selector: 'app-view-push',
  templateUrl: './view-push.component.html',
  styleUrls: ['./view-push.component.scss']
})
export class ViewPushComponent implements OnInit {



  headers: any;
  editFlag: boolean;
  editId: string;
  dataArr: any;
  isexternal: any;
  constructor(
    public router: Router,
    private spinner: NgxSpinnerService,
    private clinicService: ClinicService,
    private toastr: ToastrService,
    public customDatePipe: CustomDateFormatPipe
  ) { }

  ngOnInit(): void {

    this.headers = [
      { label: "Push Notification Name", checked: true },
      { label: "Frequency", checked: true },
      { label: "Start Date", checked: true },
      { label: "End Date", checked: true },
      { label: "Time", checked: true },
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
          this.dataArr = study.pushNotificationsAssociated;
          // this.isexternal = study.isExternal;
          console.log("this.dataArr", this.dataArr);
          this.dataArr.forEach(ele => {
            ele.startDate = this.customDatePipe.transform(ele.startDate, 'MM/dd/yyyy');
            ele.endDate = this.customDatePipe.transform(ele.endDate, 'MM/dd/yyyy');
            ele.notificationName = ele.notificationName
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
    this.router.navigate([`/user/clinics/view-clinic/${this.editId}/mobile-app-config`]);

  }
  next() {
    // if(this.isexternal == 1){
    //   this.router.navigate([`/user/clinics/view-clinic/${this.editId}/view-prelude-config`]);
    // }else{
    //   this.router.navigate([`/user/clinics/view-clinic/${this.editId}/view-study-image-scoring`]);
    // }
    //this.router.navigate([`/user/clinics/view-clinic/${this.editId}/view-study-image-scoring`]);
    this.clinicService.setNext();

  }
}




