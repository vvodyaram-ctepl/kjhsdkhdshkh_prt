import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddUserService } from '../add-user.service';
import { ViewEncapsulation } from '@angular/core';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';

@Component({
  selector: 'app-view-associated-study',
  templateUrl: './view-associated-study.component.html',
  styleUrls: ['./view-associated-study.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewAssociatedStudyComponent implements OnInit {
  headers: any;
  dataArr: any[];
  editId: string;
  roleTypeId: any;
  futureStudies: any;
  inactiveStudies: any;
  constructor(
    public router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private adduserService: AddUserService,
    private customDatePipe: CustomDateFormatPipe
  ) { }

  ngOnInit(): void {
    this.headers = [
      { key: "studyName", label: "Study Name", checked: true },
      { key: "principleInvestigator", label: "Principal Investigator", checked: true },
      // { key: "permission", label: "PERMISSION(S)", checked: true },
      { key: "createdDate", label: "ASSOCIATED ON", checked: true },
      { key: "isActive", label: "Status", checked: true },
      { key: "static", label: "", checked: true, clickable: true, width: 85 }
    ];

    if (this.router.url.indexOf('/view-clinic-users') > -1) {
      console.log("this.router.url", this.router.url);
      let str = this.router.url;
      let id = str.split("view-clinic-users/")[1].split("/")[0]
      // this.editFlag = true;
      this.editId = id;
      this.spinner.show();
      this.adduserService.getUserById(`/api/users/${id}`, '').subscribe(res => {
        console.log("res", res);
        let user = res.response.user;
        this.roleTypeId = user.roleTypeId;
        this.futureStudies = user.futureStudies == 1 ? true : false;
        this.inactiveStudies = user.inactiveStudies == 1 ? true : false;
        this.dataArr = user.associatedStudies;
        this.dataArr = this.dataArr && this.dataArr.filter(item => item.isActive === true);
        this.dataArr && this.dataArr.forEach(ele => {
          if (ele.createdDate) {
            ele.createdDate = this.customDatePipe.transform(ele.createdDate, 'MM/dd/yyyy');
          }
          if (ele.isActive == true) {
            ele.isActive = 'Active';

          } else {
            ele.isActive = 'InActive';
          }
        })

        this.spinner.hide();
      },
        err => {
          this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
        }
      );
    }
  }

  next() {

  }
  addStudy() {

  }
  ngAfterViewInit() {
    // this.dataArr && this.dataArr.forEach(ele => {
    //   if(ele.isActive == true) {
    //     ele.isActive = "Active";
    //     ele['columnCssClass']['isActive'] = "active-status";
    //   } else {
    //     ele.isActive = "Inactive";
    //     ele['columnCssClass']['isActive'] = "inactive-status";
    //   }
    // })
  }

}
