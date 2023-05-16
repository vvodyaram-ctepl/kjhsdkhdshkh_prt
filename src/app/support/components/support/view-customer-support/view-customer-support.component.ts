import { Component, OnInit } from '@angular/core';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { LookupService } from 'src/app/services/util/lookup.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-customer-support',
  templateUrl: './view-customer-support.component.html',
  styleUrls: ['./view-customer-support.component.scss']
})
export class ViewCustomerSupportComponent implements OnInit {
  public flatTabs: any[];
  id: any;
  menuId: any;
  RWFlag: boolean;
  isFav: boolean;
  constructor(
    private tabservice: TabserviceService,
    public router: Router,
    private userDataService: UserDataService,
    private lookupService: LookupService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {

    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "37") {
        menuActionId = ele.menuActionId;
        this.menuId = ele.menuId;
      }
    });

    if (menuActionId == "3" || menuActionId == "4") {
      this.RWFlag = true;
    }

    this.flatTabs = [
      { tabId: 1, name: 'Ticket Details', link: 'ticket-details', property: 'ticketDetails' },
      { tabId: 2, name: 'Ticket History', link: 'ticket-history', property: 'ticketHistory' },
    ];


    if (this.router.url.indexOf('/view') > -1) {
      console.log("this.router.url", this.router.url);
      let str = this.router.url;
      this.id = str.split("view/")[1].split("/")[0];
    }
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
    this.spinner.hide();
    if (err.status == 500) {
      this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
    }
    else {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    }
  }

}
