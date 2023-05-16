import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { LookupService } from 'src/app/services/util/lookup.service';
import { ToastrService } from 'ngx-toastr';
import { AssetsService } from 'src/app/assets/components/assets.service';


  @Component({
  selector: 'app-view-shipment',
  templateUrl: './view-shipment.component.html',
  styleUrls: ['./view-shipment.component.scss'],
encapsulation:ViewEncapsulation.None
})
export class ViewShipmentComponent implements OnInit {

  id: any = {};
  menuId: any;
  RWFlag: boolean = false;
  isFav: boolean;
    shipmentDetails: any = {};
    trackingUrl: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private assetsService: AssetsService,
    private spinner: NgxSpinnerService,
    private customDatePipe: CustomDateFormatPipe,
    private userDataService:UserDataService,
    private lookupService:LookupService,
    private toastr:ToastrService
  ) { }

  ngOnInit(): void {
    
    this.spinner.show();
       //permission for the module
       let userProfileData = this.userDataService.getRoleDetails();
       console.log("userProfileData",userProfileData);
       let menuActionId ='';
       userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
        if (ele.menuId == "39") {
           menuActionId = ele.menuActionId;
           this.menuId = ele.menuId;
         }
       });
   
       if(menuActionId == "3") {
         this.RWFlag = true;
       }


    this.activatedRoute.params.subscribe(async params => {
      let str = this.router.url;
      this.id = str.split("view/")[1].split("/")[0];

      this.assetsService.getAssetsService(`/api/shipments/${this.id}`).subscribe(res => {
        console.log(res);
        if (res.status.success === true) {
          this.shipmentDetails = res.response.shipment;
          this.trackingUrl =  this.shipmentDetails.trackingUrl
          this.spinner.hide();
        }
      })
    })

    this.checkFav();

  }

  trackShipment() {
    let link = this.trackingUrl;
    // window.open(
    //   link,
    //   '0',
    //   'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=0,width=800,height=600'
    // );
    window.open(link, "_blank");
  }
  edit(selectedPlan) {
    this.router.navigate([`/user/shipment/edit/${selectedPlan}`]);
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

