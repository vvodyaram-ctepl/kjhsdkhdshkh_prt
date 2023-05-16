import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ViewEncapsulation } from '@angular/core';
import { AddUserService } from 'src/app/clinical-users/components/add-user.service';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { LookupService } from 'src/app/services/util/lookup.service';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { ClinicService } from '../clinic.service';

@Component({
  selector: 'app-view-activity',
  templateUrl: './view-activity.component.html',
  styleUrls: ['./view-activity.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewActivityComponent implements OnInit {
  headers: any;
  dataArr: any[];
  id: string;
  userFlag: boolean;
  clinicFlag: boolean;
  isexternal: any;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private adduserService: AddUserService,
    public customDatePipe: CustomDateFormatPipe,
    private lookupService: LookupService,
    private userDataService: UserDataService,
    private clinicService: ClinicService,
  ) { }

  ngOnInit(): void {
    this.headers = [
      { label: "Contact Name", checked: true, clickable: true },
      { label: "Activities", checked: true },
      { label: "Description", checked: true },
      { label: "Date", checked: true },
      { label: "", checked: true, clickable: true, width: 85 }
    ];
    if (this.router.url.indexOf('/clinical-user/view-clinic-users/') > -1 || this.router.url.indexOf('/clinics/view-clinic/') > -1) {
      console.log("this.router.url", this.router.url);
      let str = this.router.url;
      this.id = '';
      if (this.router.url.indexOf('/clinical-user/view-clinic-users/') > -1) {
        this.userFlag = true;
        this.id = str.split("view-clinic-users/")[1].split("/")[0];
        this.spinner.show();
        /*  this.adduserService.getUserById(`/api/users/${this.id}`, '').subscribe(res => {
            console.log("res", res);
            let user = res.response.user;
            this.dataArr = user.auditLogs;
            this.dataArr.forEach(ele => {
              ele.auditTimeStamp = this.customDatePipe.transform(ele.auditTimeStamp, 'MM/dd/yyyy hh:mm:ss');
            })*/
        let userProfileData = this.userDataService.getRoleDetails();
        console.log("userProfileData", userProfileData);
        let menuId = '';
        userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
          if (ele.menuId == "24") {
            menuId = ele.menuId;
          }
        })

        this.lookupService.getAuditLog(`/api/auditLogs/activity/${this.id}/${menuId}`).subscribe(res => {
          console.log("res", res);
          let user = res.response;
          this.dataArr = user.activities;
          if (this.dataArr) {
            this.dataArr.forEach(ele => {
              ele.date = this.customDatePipe.transform(ele.date, 'MM/dd/yyyy HH:mm:ss');
            })
          }
          this.spinner.hide();
        },
          err => {
            this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
          }
        );


      }
      if (this.router.url.indexOf('/clinics/view-clinic/') > -1) {
        this.clinicFlag = true;
        this.id = str.split("view-clinic/")[1].split("/")[0];
        console.log("idid", this.id);
        this.spinner.show();
        let userProfileData = this.userDataService.getRoleDetails();
        console.log("userProfileData", userProfileData);
        let menuId = '';
        userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
          if (ele.menuId == "11") {
            menuId = ele.menuId;
          }
        });

        this.clinicService.getStudy(`/api/study/${this.id}`, '').subscribe(res => {
          if (res.status.success == true) {
            let study = res.response.rows;
            this.isexternal = study.isExternal;
            this.spinner.hide();
          }
        },
          err => {
            this.spinner.hide();
            this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
          }
        );

        this.lookupService.getAuditLog(`/api/auditLogs/activity/${this.id}/${menuId}`).subscribe(res => {
          console.log("res", res);
          let user = res.response;
          this.dataArr = user.activities;
          if (this.dataArr) {
            this.dataArr.forEach(ele => {
              ele.date = this.customDatePipe.transform(ele.date, 'MM/dd/yyyy HH:mm:ss');
            })
          }
          this.spinner.hide();
        },
          err => {
            this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');

          })
        // this.adduserService.getUserById(`/api/study/${this.id}`, '').subscribe(res => {
        //   console.log("res", res);
        //   let user = res.response.rows;
        //   this.dataArr = user.auditLogs;
        //   if(this.dataArr) {
        //   this.dataArr.forEach(ele => {
        //     ele.auditTimeStamp = this.customDatePipe.transform(ele.auditTimeStamp, 'dd MMM yyyy');
        //   })
        // }
        //   this.spinner.hide();
        // },
        //   err => {
        //     this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
        //   }
        // );
      }

      // this.editFlag = true;
      // this.editId = id;

    }
  }

  back() {
    if(this.router.url.indexOf('view-clinic-users') != -1){
      this.router.navigate([`/user/clinical-user/view-clinic-users/${this.id}/view-associated-study`]);
    }else{
      this.router.navigate([`/user/clinics/view-clinic/${this.id}/view-activity-factor`]);
    }
  }


}
