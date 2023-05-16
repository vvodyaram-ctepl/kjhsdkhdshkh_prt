import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { ToastrService } from 'ngx-toastr';
import { PointTrackerService } from '../../point-tracker.service';
import { UserDataService } from 'src/app/services/util/user-data.service';
import * as moment from 'moment';

@Component({
  selector: 'app-point-tracking',
  templateUrl: './point-tracking.component.html',
  styleUrls: ['./point-tracking.component.scss']
})
export class PointTrackingComponent implements OnInit {

  headers: any;
  filterTypeArr: any[];
  RWFlag: boolean;
  constructor(
    public router: Router,
    public customDatePipe: CustomDateFormatPipe,
    private pointService: PointTrackerService,
    private toastr: ToastrService,
    private userDataService: UserDataService
  ) { }
  ngOnInit() {
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "21") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }
    this.headers = [
      { key: "trackerName", label: "Campaign Name", clickable: true, checked: true , sortable : true },
      { key: "studyName", label: "Study", checked: true , sortable : true },
      { key: "startDate", label: "Start Date", checked: true , sortable : true },
      { key: "endDate", label: "End Date ", checked: true , sortable : true },
      { key: "status", label: "Status", checked: true },
      { key: "static", label: "", checked: true, clickable: true }
    ];
    this.filterTypeArr =
      [{
        name: "Study",
        id: "Study"
      },
      {
        name: "Duration",
        id: "dateType"
      },
      {
        // trackerStatus
        name: "Status",
        id: "pointTrackingStatus"
      }
      ];
  }

  formatter($event) {
    console.log("$event", $event)
    $event.forEach(ele => {
      
      

      ele.startDate = this.customDatePipe.transform(ele.startDate, 'MM/dd/yyyy');
      ele.endDate = this.customDatePipe.transform(ele.endDate, 'MM/dd/yyyy');

       if (ele.status == 1) {
        ele.status = "Published";
        ele['columnCssClass']['status'] = "info-status";
      } else if (ele.status == 2) {
        ele.status = "Draft";
        ele['columnCssClass']['status'] = "active-status";
      } else {
        ele.status = "Inactive";
        ele['columnCssClass']['status'] = "inactive-status";
      }
      
      //JIRA- WPP2-597
      if (this.RWFlag) {
        if (ele.isPublished) {
          if(ele.status == 'Published'){//Active
            ele.static = `<div class="card icon-card-list green-bg mb-2 mr-2" title="Edit">
            <span class="icon-tag size-20" title="Edit"></span>
          </div>`
          }
        } else {
          //let today = moment().format("MM/DD/YYYY");
          //moment(ele.endDate,'MM/DD/YYYY').isSameOrAfter(moment(today,'MM/DD/YYYY'))
          if (ele.status == 'Draft' || ele.status == 'Inactive') { //Draft.
            ele.static = `<div class="card icon-card-list green-bg mb-2 mr-2" title="Edit">
            <span class="icon-tag size-20" title="Edit"></span>
          </div>`
          }
        }
      }
    });
  }


  getNode($event) {
    console.log('event ::: ', $event);
    if ($event.header === 'trackerName') {
      this.router.navigate(['/user/point-tracking/view', $event.item.pointTrackerId]);
    }
    let action = $event.event.target.title;
    if (action === 'Edit') {
      this.router.navigate(['/user/point-tracking/edit', $event.item.pointTrackerId]);
    }

  }

}
