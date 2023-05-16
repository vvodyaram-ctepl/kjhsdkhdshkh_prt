import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { LookupService } from 'src/app/services/util/lookup.service';
import { ToastrService } from 'ngx-toastr';
import { PushNotificationService } from 'src/app/push-notification/components/push-notification.service';

@Component({
  selector: 'app-view-push-notification',
  templateUrl: './view-push-notification.component.html',
  styleUrls: ['./view-push-notification.component.scss']
})
export class ViewPushNotificationComponent implements OnInit {
  public flatTabs: any[];
  planDetails: any = {};
  id: any = {};
  menuId: any;
  RWFlag: boolean = false;
  isFav: boolean;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pushService: PushNotificationService,
    private spinner: NgxSpinnerService,
    private customDatePipe: CustomDateFormatPipe,
    private userDataService:UserDataService,
    private lookupService:LookupService,
    private toastr:ToastrService
  ) { }

  ngOnInit(): void {
    
       //permission for the module
       let userProfileData = this.userDataService.getRoleDetails();
       console.log("userProfileData",userProfileData);
       let menuActionId ='';
       userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
        if (ele.menuId == "36") {
           menuActionId = ele.menuActionId;
           this.menuId = ele.menuId;
         }
       });
   
       if(menuActionId == "3") {
         this.RWFlag = true;
       }

    this.flatTabs = [
      // { tabId: 1, name: 'Plan Details', link: 'plan-details', property: 'planDetails' },
      { tabId: 1, name: 'Study Association', link: 'study-association', property: 'studyAssociation' },
      { tabId: 2, name: 'Activities', link: 'activities', property: 'activities' },
    ];

    this.activatedRoute.params.subscribe(async params => {
      let str = this.router.url;
      this.id = str.split("view-push-notification/")[1].split("/")[0];

      this.spinner.show();
      this.pushService.getPush(`/api/pushNotifications/${this.id}`).subscribe(res => {
        console.log(res);
        if (res.status.success === true) {
          this.planDetails = res.response.rows;
          this.planDetails.createDate = this.planDetails.createDate ? this.customDatePipe.transform(this.planDetails.createDate, 'MM/dd/yyyy') : '';
          this.spinner.hide();
        }
      })
    })

    this.checkFav();

  }

  public activateTab(activeTab) {
    this.flatTabs.forEach(flatTag => {
      if (flatTag.tabId == activeTab.tabId) {
        flatTag.active = true;
      } else {
        flatTag.active = false;
      }
    });
  }

  editPush(selectedPlan) {
    this.router.navigate([`/user/push-notification/edit-push-notification/${selectedPlan}`]);
  }
  addPush() {
    this.router.navigate([`/user/push-notification/add-push-notification`]);
  }
  checkFav() {
    //check favorite
    this.lookupService.getFavInfo(`/api/favourites/isFavourite/${this.menuId}/${this.id}`).subscribe(res => {
     if (res.response.favourite.isFavourite)
       this.isFav = true;
   });
 }
 makeFav() {
   this.spinner.show();
   this.lookupService.addasFav(`/api/favourites/${this.menuId}/${this.id}`, {}).subscribe(res => {
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
   this.lookupService.removeFav(`/api/favourites/${this.menuId}/${this.id}`, {}).subscribe(res => {
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
    if (err.status == 500) {
      this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
    }
    else {
      this.toastr.error(err.error.errors[0] ?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    }
  }
}
