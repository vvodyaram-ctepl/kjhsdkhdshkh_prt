import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AssetsService } from '../../assets.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { LookupService } from 'src/app/services/util/lookup.service';

@Component({
  selector: 'app-assets-view',
  templateUrl: './assets-view.component.html',
  styleUrls: ['./assets-view.component.scss']
})
export class AssetsViewComponent implements OnInit {
  id: any = '';
  assetsData: any = [];
  firmwareHistory: any = [];
  menuId: any;
  RWFlag: boolean;
  isFav: boolean;
  showOtherLocation: boolean;
  headers: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private assetsService: AssetsService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private userDataService: UserDataService,
    private lookupService: LookupService
  ) { }

  ngOnInit(): void {

    //check permisions
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    this.headers = this.getHeaders();
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "17") {
        menuActionId = ele.menuActionId;
        this.menuId = ele.menuId;
      }
    });

    if (menuActionId == "3") {
      this.RWFlag = true;
    }


    this.activatedRoute.params.subscribe(async params => {
      const path = this.activatedRoute.snapshot.url[0].path;
      this.spinner.show();
      let str = this.router.url;
      this.id = str.split("view/")[1].split("/")[0];
      this.assetsService.getAssetsService(`/api/assets/${this.id}`).subscribe(res => {
        if (res.status.success === true) {
          console.log(res.response);
          this.assetsData = res.response.deviceInfo;
          if (this.assetsData.deviceLocationId == 4) {
            this.showOtherLocation = true;
          }
          else {
            this.showOtherLocation = false;
          }
        } else {
          this.toastr.error(res.errors[0].message);
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
      })

      //Firmware History
      this.assetsService.getAssetsService(`/api/assets/getAssetHistory/${this.id}`).subscribe(res => {
        if (res.status.success === true) {
          this.firmwareHistory = res.response.assetHistory;
        } else {
          this.toastr.error(res.errors[0].message);
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
      })
    });
    this.checkFav();
  }

  getHeaders() {
    return [
      // { label: "Pushed on", key: "pushedOn", checked: true },
      // { label: "Updated on", key: "updatedOn", checked: true },
      { label: "Firmware Version #", key: "firmwareVersion", checked: true }
    ];
  }


  backToList() {
    this.router.navigate(['/user/assets/management']);
  }

  addDeviceDetails() {
    this.router.navigate(['/user/assets/management/add']);
  }

  editDeviceDetails() {
    this.router.navigate(['/user/assets/management/edit', this.id]);
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
