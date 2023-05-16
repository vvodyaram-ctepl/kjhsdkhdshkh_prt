import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { PetParentService } from '../../pet-parent.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { LookupService } from 'src/app/services/util/lookup.service';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { TabserviceService } from 'src/app/shared/tabservice.service';

@Component({
  selector: 'app-view-pet-parent',
  templateUrl: './view-pet-parent.component.html',
  styleUrls: ['./view-pet-parent.component.scss']
})
export class ViewPetParentComponent implements OnInit {
  petParentId: any = '';
  petParentDetails: any = {};
  existingPetArr: any = [];
  headers: any;
  menuId: any;
  RWFlag: boolean;
  isFav: boolean= false;

  constructor(
    private router: Router,
    private petParentService: PetParentService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private customDatePipe: CustomDateFormatPipe,
    private lookupService:LookupService,
    private userDataService:UserDataService,
    private tabService: TabserviceService,
    private activatedRoute: ActivatedRoute
  ) { }

  formatUSPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = (match[1] ? '+1 ' : '+1 ');
      return [intlCode, ' ', '(', match[2], ')', match[3], '-', match[4]].join('');
    }
    return null;
  }
  formatUKPhoneNumber(phoneNumber) {
    let phoneNumberArr = phoneNumber.toString().split("44");
    console.log("phoneNumberArr",phoneNumberArr)
    let genPh = phoneNumberArr[1]
    // return phoneNumberArr[1].replace(/\s+/g, '').replace(/(.)(\d{4})(\d)/, '+44 $1 - $2 - $3');
    let newString = '+44' + ' ' + genPh.substr(0, 2) + '-' + genPh.substr(2, 4) + '-' + genPh.substr(6, 4);
    return newString
}
  ngOnInit() {

    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData",userProfileData);
    let menuActionId ='';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "15") {
        menuActionId = ele.menuActionId;
        this.menuId = ele.menuId;
      }
    });

    if(menuActionId == "3") {
      this.RWFlag = true;
    }

    this.headers = this.getHeaders();
    this.activatedRoute.params.subscribe(async params => {
      let str = this.router.url;
      let id = str.split("view-pet-parent/")[1].split("/")[0];
      this.petParentId = id;
      this.spinner.show();
      this.petParentService.getPetParentService(`/api/petParents/${this.petParentId}`).subscribe(res => {
        console.log("petparent edit::", res);
        if (res.status.success == true) {
          this.petParentDetails = res.response.petParent;
          if(this.petParentDetails.phoneNumber) {
            let desired = this.petParentDetails.phoneNumber.replace(/[^\w\s]/gi, '');
            console.log("desired",desired);
            this.petParentDetails.phoneNumber = desired;
            
          if(desired.startsWith("44")) {
            this.petParentDetails.phoneNumber = this.formatUKPhoneNumber(this.petParentDetails.phoneNumber);
          }
          else {
            this.petParentDetails.phoneNumber = this.formatUSPhoneNumber(this.petParentDetails.phoneNumber);
          }
          }
          this.existingPetArr = res.response.petParent.petsAssociated;
        } else {
          this.toastr.error(res.errors[0].message);
        }
        this.spinner.hide();
      }, err => {
        this.errorMsg(err);
      })
    })
    this.checkFav();
  }

  getHeaders() {
    return [
      { label: "Pet Photo", key: "petPhoto", checked: true },
      { label: "Pets", key: "petName", checked: true },
      { label: "Breed", key: "breedName", checked: true },
      { label: "Weight (LBS)", key: "weight", checked: true },
      { label: "Gender", key: "gender", checked: true },
      { label: "Date of Birth", key: "dob", checked: true },
      { label: "Spayed/Neutered", key: "isNeutered", checked: true },
      { label: "Status", key: "petStatus", checked: true },
    ];
  }

  editPetParent() {
    this.tabService.clearDataModel();
    this.router.navigate(['user/petparent/edit-pet-parent/', this.petParentId]);
  }
  addPetParent() {
    this.router.navigate(['/user/petparent/add-pet-parent']);
  }
  backToList() {
    this.router.navigate(['/user/petparent']);
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
  checkFav() {
    //check favorite
    this.lookupService.getFavInfo(`/api/favourites/isFavourite/${this.menuId}/${this.petParentId}`).subscribe(res => {
     if (res.response.favourite.isFavourite)
       this.isFav = true;
   });
 }
 makeFav() {
   this.spinner.show();
   this.lookupService.addasFav(`/api/favourites/${this.menuId}/${this.petParentId}`, {}).subscribe(res => {
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
   this.lookupService.removeFav(`/api/favourites/${this.menuId}/${this.petParentId}`, {}).subscribe(res => {
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
 redirectPetView(data){
  console.log(data);
  const host: string =  location.origin;
  const url: string = host + '/#/' + String(`user/patients/view/${data.petId}/${data.petStudyId}/patient-charts`);
  window.open(url, '_blank');

  // const url = this.router.createUrlTree([`/#/user/patients/view/${data.petId}/${this.editId}/patient-charts`])
  // window.open(url.toString(), '_blank')
}
 

}
