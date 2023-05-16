import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlansService } from '../../plans.service';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {
  planDetails: any = {};
  id: any = '';
  //menuId: any = this.userService.getUserId();
  dataArr: any[];

  headers: any;
  menuId: string;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private planservice: PlansService,
    private userService: UserDataService,
    public customDatePipe: CustomDateFormatPipe,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,

  ) { }

  ngOnInit(): void {
    let userProfileData = this.userService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    this.menuId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "10") {
        this.menuId = ele.menuId;
      }
    })
    this.headers = [
      { key: "contactName", label: "Contact Name", checked: true },
      { key: "activity", label: "Activities", checked: true },
      { key: "description", label: "Description", checked: true },
      { key: "date", label: "Date", checked: true },
    ]
    this.spinner.show();
    this.activatedRoute.params.subscribe(async params => {
      if (this.router.url.indexOf('/activities') > -1) {
        let str = this.router.url;
        this.id = str.split("view/")[1].split("/")[0];
        this.spinner.hide();
        this.planservice.getPlanService(`/api/auditLogs/activity/${this.id}/${this.menuId}`).subscribe(res => {
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


      }
    })
  }
  // formatter($event) {
  //   $event.forEach(ele => {
  //     ele.date = this.customDatePipe.transform(ele.date, 'MM/dd/yyyy');
  //   })
  // }


  back(id) {
    this.router.navigate([`/user/plans/view/${id}/study-association`]);
  }

}
