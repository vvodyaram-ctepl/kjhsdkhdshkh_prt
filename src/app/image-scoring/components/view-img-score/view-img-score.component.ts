import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { LookupService } from 'src/app/services/util/lookup.service';
import { ToastrService } from 'ngx-toastr';
import { PushNotificationService } from 'src/app/push-notification/components/push-notification.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-img-score',
  templateUrl: './view-img-score.component.html',
  styleUrls: ['./view-img-score.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ViewImgScoreComponent implements OnInit {

  id: any = {};
  menuId: any;
  RWFlag: boolean = false;
  isFav: boolean;
  imageScoringScale: any = {};
  imgDetails: any = {};
  publishedFlag: any;

  @ViewChild('ImageEle') ImageEle: ElementRef;
  modalRef: NgbModalRef;
  playImgUrl: any;

  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pushService: PushNotificationService,
    private spinner: NgxSpinnerService,
    private customDatePipe: CustomDateFormatPipe,
    private userDataService:UserDataService,
    private lookupService:LookupService,
    private toastr:ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    
    this.spinner.show();
       //permission for the module
       let userProfileData = this.userDataService.getRoleDetails();
       console.log("userProfileData",userProfileData);
       let menuActionId ='';
       userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
        if (ele.menuId == "38") {
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

      this.pushService.getPush(`/api/imageScoringScales/${this.id}`).subscribe(res => {
        console.log(res);
        if (res.status.success === true) {
        
          this.imageScoringScale = res.response.imageScoringScale;

          let status = this.imageScoringScale.statusId;
          // this.imageScoringScale.forEach(ele => {
            if (status == 2) {
              this.imageScoringScale.status = "Published";
              this.imageScoringScale.statusClass = "info-bg";
            }
            else if(status == 1) {
              this.imageScoringScale.status = "Draft";
              this.imageScoringScale.statusClass = "active-bg";
            }
            else if(status == 0) {
              this.imageScoringScale.status = "Inactive";
            this.imageScoringScale.statusClass = "inactive-bg";
            }
          // })

          if(status == 0 && this.imageScoringScale.isPublished) {
            this.publishedFlag = true;
          }

          // this.publishedFlag = this.imageScoringScale.isPublished;
          this.imageScoringScale.modifiedDate = this.imageScoringScale.modifiedDate ? this.customDatePipe.transform(this.imageScoringScale.modifiedDate, 'MM/dd/yyyy') : '';

          this.imgDetails = res.response.imageScoringScale.imageScoringScaleDetails;
          this.spinner.hide();
        }
      })
    })

    this.checkFav();

  }


  editImg(selectedPlan) {
    this.router.navigate([`/user/imagescore/edit/${selectedPlan}`]);
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
  playImg(val){
    console.log(val);
    this.openPopup(this.ImageEle, 'xs');
    this.playImgUrl = val;
  }
  openPopup(div, size) {
    console.log('div :::: ', div);
    this.modalRef = this.modalService.open(div, {
      size: size,
      windowClass: 'smallModal',
      backdrop: 'static',
      keyboard: false
    });
    this.modalRef.result.then((result) => {
      console.log(result);
    }, () => {
    });
  }

}

