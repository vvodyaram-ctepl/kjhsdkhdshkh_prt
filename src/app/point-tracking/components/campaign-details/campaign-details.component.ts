import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { LookupService } from 'src/app/services/util/lookup.service';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { PointTrackerService } from '../../point-tracker.service';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss']
})
export class CampaignDetailsComponent implements OnInit {
  trackId: any;
  responseData: any = [];
  RWFlag: boolean;
  menuId: any;
  isFav: boolean = false;
  
  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public customDatePipe: CustomDateFormatPipe,
    private point: PointTrackerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userDataService:UserDataService,
    private lookupService:LookupService
  ) { }

  ngOnInit(): void {
      //check permisions
      let userProfileData = this.userDataService.getRoleDetails();
      let menuActionId ='';
      userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
        if(ele.menuId == "21") {
          menuActionId = ele.menuActionId;
          this.menuId = ele.menuId;
        }
      });
  
      if(menuActionId == "3") {
        this.RWFlag = true;
      }
      
      if (this.router.url.indexOf('/user/point-tracking/view/') > -1) {
      let str = this.router.url;
      this.trackId = str.split("/user/point-tracking/view/")[1].split("/")[0];
      this.spinner.show();
      this.point.getPointById(`/api/pointTrackers/${this.trackId}`, '').subscribe(res => {
        if (res.status.success === true) {
          this.responseData = res.response.pointTracker;
        } else {
          this.toastr.error(res.errors[0].message);
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        if (err.status == 500) {
          this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
        }
        else {
          this.toastr.error(err.error.errors[0] ?.message || 'Something went wrong. Please try after sometime or contact administrator.');
        }
      });
    }
    this.checkFav();
  }
  backToList() {
    this.router.navigate(['/user/point-tracking']);
  }

  addPage() {
    this.router.navigate(['/user/point-tracking/add']);
  }
  checkFav() {
    //check favorite
    this.lookupService.getFavInfo(`/api/favourites/isFavourite/${this.menuId}/${this.trackId}`).subscribe(res => {
     if (res.response.favourite.isFavourite)
       this.isFav = true;
   });
 }
 makeFav() {
   this.spinner.show();
   this.lookupService.addasFav(`/api/favourites/${this.menuId}/${this.trackId}`, {}).subscribe(res => {
     if (res.status.success === true) {
       this.isFav = true;
       this.toastr.success('Added to Favorites');
       this.spinner.hide();
     }
     else {
       this.toastr.error(res.errors[0].message);
       this.spinner.hide();
     }
   },
     err => {
       this.errorMsg(err);
     }
   );
 }
 
 removeFav() {
   this.spinner.show();
   this.lookupService.removeFav(`/api/favourites/${this.menuId}/${this.trackId}`, {}).subscribe(res => {
     if (res.status.success === true) {
       this.isFav = false;
       this.toastr.success('Removed from Favorites');
       this.spinner.hide();
     }
     else {
       this.toastr.error(res.errors[0].message);
       this.spinner.hide();
     }
   },
     err => {
       this.errorMsg(err);
     }
   );
 }
 errorMsg(err) {
  this.spinner.hide();
  if (err.status == 500) {
    this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
  }
  else {
    this.toastr.error(err.error.errors[0] ?.message || 'Something went wrong. Please try after sometime or contact administrator.');
  }
}

}
