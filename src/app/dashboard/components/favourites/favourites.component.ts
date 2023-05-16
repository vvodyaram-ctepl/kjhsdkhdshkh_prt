import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { LookupService } from 'src/app/services/util/lookup.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FavouritesComponent implements OnInit {
  headers: any;
  showDataTable: boolean = true;
  RWFlag: boolean;
  filterTypeArr: { name: string; id: string; }[];
  @ViewChild('archiveContent') archiveContent: ElementRef;
  modalRef2: NgbModalRef;
  menuId: any;
  entityId: any;
  recordName: any;


  constructor(private lookupService: LookupService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private userDataService: UserDataService,
    private router: Router,
    private modalService: NgbModal) { }

  ngOnInit() {
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "1") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }

    this.headers = [
      // { key: "slNumber", label: "S.NO", checked: true },
      { key: "recordName", label: "Record Name ", checked: true, clickable: true, width: 500 },
      // { key: "stateCode", label: "State/PR", checked: true, width: 150 },
      { key: "menuName", label: "Module", checked: true },
      // { key: "createdDate", label: "Created on", checked: true },
      // { key: "isActive", label: "Status", checked: true },
      { key: "static", label: "", checked: true, clickable: true, width: 90 }
    ];
    this.filterTypeArr =
      [{
        name: "Module",
        id: "Menu"
      }];
  }

  formatter($event) {
    $event.forEach(ele => {
      if (this.RWFlag) {
        ele.static = `<div class="card icon-card-list red-bg mb-2" title="Delete">
<span class="size-14" style="color:red;" title="Delete">-</span>
</div>`
      }
    });
  } 
  async getNode($event) {
    console.log("$event.item.menuId", $event.item.menuId)
    if ($event.header === 'recordName') {
      if(!this.checkUserPermission($event.item.menuId)){
        this.toastr.error(`User doesn't have necessary permissions at role level`,'Error!');
        return;
      }
      // this.router.navigate(['/user/clinics/view-clinic',$event.item.studyId]);
      let menuId = $event.item.menuId;
      if(menuId == 10 || menuId == 11 || menuId == 14 || menuId == 15 || menuId == 17 || menuId == 21 || menuId == 37){
        //check user associated study permission
        const res = await this.checkUserAssociatedStudy(menuId,$event.item.entityId);
        if(!res.response){
          this.toastr.error(`User doesn't have necessary permissions at user level`,'Error!');
          return;
        }
      }

      if (menuId == 24) {
        this.router.navigate(['/user/clinical-user/view-clinic-users/', $event.item.entityId]);
      }
      else if (menuId == 10) {
        //plans
        this.router.navigate(['/user/plans/view/', $event.item.entityId]);
      }
      else if (menuId == 38) {
        //plans
        this.router.navigate(['/user/imagescore/view/', $event.item.entityId]);
      }
      else if (menuId == 39) {
        //shipment
        this.router.navigate(['/user/shipment/view/', $event.item.entityId]);
      }
      
      else if (menuId == 14) {
        console.log($event.item)
        this.router.navigate([`/user/patients/view/${$event.item.entityId}/${$event.item.petStudyId}`]);
      }
      else if (menuId == 11) {
        this.router.navigate(['/user/clinics/view-clinic/', $event.item.entityId]);
      }
      else if (menuId == 23) {
        this.router.navigate(['/user/roles/view/', $event.item.entityId]);
      }
      else if (menuId == 15) {
        //pet parent
        this.router.navigate(['/user/petparent/view-pet-parent/', $event.item.entityId]);
      }
      else if (menuId == 17) {
        this.router.navigate(['/user/assets/management/view/', $event.item.entityId]);
      }
      else if (menuId == 26) {
        this.router.navigate(['/user/questionnaire/view/', $event.item.entityId]);
      }
      else if (menuId == 37) {
        this.router.navigate(['/user/support/view/', $event.item.entityId]);
      }
      else if (menuId == 21) {
        this.router.navigate(['/user/point-tracking/view/', $event.item.entityId]);
      }
      else if (menuId == 36) {
        this.router.navigate(['/user/push-notification/view-push-notification/', $event.item.entityId]);
      }
      
    }
    let action = $event.event.target.title;

    if (action === 'Delete') {
      this.menuId = $event.item.menuId;
      this.entityId = $event.item.entityId;
      this.recordName = $event.item.recordName;

      this.openPopup(this.archiveContent, 'xs');
      // this.spinner.show();
      // this.lookupService.removeFav(`/api/favourites/${$event.item.menuId}/${$event.item.entityId}`, {}).subscribe(res => {
      //   if (res.status.success === true) {
      //     this.toastr.success('Removed from Favourites successfully!');
      //     this.reloadDatatable();
      //   }
      //   this.spinner.hide();
      // },
      //   err => {
      //     if (err.status == 500) {
      //       this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      //     }
      //     else {
      //       this.toastr.error(err.error.errors[0] ?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      //     }
      //     this.spinner.hide();
      //   })
    }

  }
  checkUserPermission(menuId){
    let menuList: any = this.userDataService.getRoleDetails();
    console.log(menuList.rolePermissions.some(value => value['menuId'] === menuId));
    return menuList.rolePermissions.some(value => value['menuId'] === menuId);
  }

  public reloadDatatable() {
    this.showDataTable = false;
    setTimeout(() => {
      this.showDataTable = true;
    }, 1);
  }

  openPopup(div, size) {
    this.modalRef2 = this.modalService.open(div, {
      size: size,
      windowClass: 'smallModal',
      backdrop: 'static',
      keyboard: false
    });
    this.modalRef2.result.then((result) => {
      console.log(result);
    }, () => {
    });
  }

  deleteRecord() {
    this.spinner.show();
    this.lookupService.removeFav(`/api/favourites/${this.menuId}/${this.entityId}`, {}).subscribe(res => {
      if (res.status.success === true) {
        this.toastr.success('Removed from Favorites successfully!');
        this.reloadDatatable();
      }
      this.modalRef2.close();
      this.spinner.hide();
    },
      err => {
        if (err.status == 500) {
          this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
        }
        else {
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
        }
        this.spinner.hide();
      })
  }

  async checkUserAssociatedStudy(menuId,entityId){
    return this.lookupService.checkUserAssociatedStudy(`/api/favourites/checkUserAssociatedStudy/${menuId}/${entityId}`).toPromise();
  }

}
