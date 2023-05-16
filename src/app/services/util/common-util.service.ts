import { Injectable, ElementRef } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { BaseService } from './base.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { LookupService } from './lookup.service';

@Injectable({
  providedIn: 'root'
})
export class CommonUtilService  {
    isFav: boolean;
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        http: HttpClient,
        private spinner: NgxSpinnerService,
        private customDatePipe: CustomDateFormatPipe,
        private lookupService:LookupService,
        private toastr:ToastrService
    ) {
    }

    checkFav(menuId,entityId) {
        //check favorite
        this.lookupService.getFavInfo(`/api/favourites/isFavourite/${menuId}/${entityId}`).subscribe(res => {
         if (res.response.favourite.isFavourite) {
            return true;
        }
     
        this.spinner.hide();
    },
      err => {
        this.spinner.hide();
        this.errorMsg(err);
      }
       );
     }
     makeFav(menuId,entityId) {
       this.spinner.show();
       this.lookupService.addasFav(`/api/favourites/${menuId}/${entityId}`, {}).subscribe(res => {
         if (res.status.success === true) {
             this.isFav = true;
            this.toastr.success('Added to Favorites');
            this.spinner.hide();

            return this.isFav;
         }
      
           this.spinner.hide();
         
       },
         err => {
            this.spinner.hide();
           this.errorMsg(err);
         }
       );
     }
     
     removeFav(menuId,entityId) {
       this.spinner.show();
       this.lookupService.removeFav(`/api/favourites/${menuId}/${entityId}`, {}).subscribe(res => {
         if (res.status.success === true) {
            this.isFav = false;
           this.toastr.success('Removed from Favorites');
           this.spinner.hide();
           return this.isFav;
         }
    
           this.spinner.hide();
         
       },
         err => {
            this.spinner.hide();
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
