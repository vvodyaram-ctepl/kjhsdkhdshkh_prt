import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SupportService } from 'src/app/support/support.service';
import { ToastrService } from 'ngx-toastr';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { LookupService } from 'src/app/services/util/lookup.service';
import { UserDataService } from 'src/app/services/util/user-data.service';

@Component({
  selector: 'app-view-support',
  templateUrl: './view-support.component.html',
  styleUrls: ['./view-support.component.scss']
})
export class ViewSupportComponent implements OnInit {
  id: any = '';
  customerSupport: any = {};
  resolutionList: any = {};
  isFav: boolean= false;
  menuId: any;
  RWFlag: boolean;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private supportservice: SupportService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private DateFormat: CustomDateFormatPipe,
    private lookupService:LookupService,
    private userDataService:UserDataService
  ) { }

  ngOnInit(): void {
     //check permisions
     let userProfileData = this.userDataService.getRoleDetails();
     console.log("userProfileData",userProfileData);
     let menuActionId ='';
     userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "37") {
         menuActionId = ele.menuActionId;
         this.menuId = ele.menuId;
         console.log("this.menuId",this.menuId);
       }
     });
 
     if (menuActionId == "3" || menuActionId == "4") {
       this.RWFlag = true;
     }

     
    this.activatedRoute.params.subscribe(async params => {
      const path = this.activatedRoute.snapshot.url[0].path;
      if (path === 'view') {
        this.spinner.show();
        let str = this.router.url;
        this.id = str.split("view/")[1].split("/")[0];
        this.supportservice.getSupportService(`/api/support/${this.id}`).subscribe(res => {
          console.log(res);
          if (res.status.success === true) {
            this.customerSupport = res.response.customerSupport;
            this.resolutionList = this.customerSupport.resolutionList;
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.toastr.error(res.errors[0].message);
          }
        })
      }

    });

    this.checkFav();
  }

  backToList() {
    this.router.navigate(['/user/support']);
  }

  addSupport() {
    this.router.navigate(['/user/support/add']);
  }

  editSupport() {
    this.router.navigate(['/user/support/edit', this.id]);
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
    this.toastr.error(err.error.errors[0] ?.message || 'Something went wrong. Please try after sometime or contact administrator.');
  }
}
}
