import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PointTrackerService } from '../../point-tracker.service';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { LookupService } from 'src/app/services/util/lookup.service';
import * as moment from 'moment';

@Component({
  selector: 'app-view-point-tracker',
  templateUrl: './view-point-tracker.component.html',
  styleUrls: ['./view-point-tracker.component.scss']
})
export class ViewPointTrackerComponent implements OnInit {

  public flatTabs: any[];
  trackId: any;
  RWFlag: boolean;
  status: number;
  pointTrackerObj: any = {};
  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public customDatePipe: CustomDateFormatPipe,
    private point: PointTrackerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userDataService: UserDataService,
    private lookupService: LookupService
  ) { }

  public activateTab(activeTab) {
    this.flatTabs.forEach(flatTag => {
      if (flatTag.tabId == activeTab.tabId) {
        flatTag.active = true;
      } else {
        flatTag.active = false;
      }
    });
  }

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
    this.activatedRoute.params.subscribe(async params => {
      this.trackId = params.id;
      this.point.getPointById(`/api/pointTrackers/${this.trackId}`, '').subscribe(res => {
        this.status = res.response.pointTracker.status;
        this.pointTrackerObj = res.response.pointTracker;
        let today =  moment().format("MM/DD/YYYY");
        let endDate = moment(this.pointTrackerObj.endDate,'YYYY-MM-DD').format('MM/DD/YYYY');

        console.log(moment(endDate).isSameOrAfter(moment(today)));
        
        console.log(moment(today).isSameOrAfter(endDate));

        if(!(moment(endDate).isSameOrAfter(moment(today)) && this.pointTrackerObj.status == 1 || this.pointTrackerObj.status == 2 || (!this.pointTrackerObj.isPublished))){
           this.RWFlag = false;
        }
      }, err => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
      }
      );
    });
    this.flatTabs = [{ tabId: 1, name: 'Campaign Details', link: 'campaign-details', property: 'CampaignDetailsComponent' },
    { tabId: 2, name: 'Activities', link: 'campaign-activities', property: 'CampaignActivitiesComponent' },
    ];


  }
  editPage() {
    this.router.navigate(['/user/point-tracking/edit', this.trackId]);
  }

}
