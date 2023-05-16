import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { PointTrackerService } from 'src/app/point-tracking/point-tracker.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RolesService } from '../roles.service';
import { catchError } from 'rxjs/operators';
import { LookupService } from 'src/app/services/util/lookup.service';
import { UserDataService } from 'src/app/services/util/user-data.service';

@Component({
  selector: 'app-view-roles',
  templateUrl: './view-roles.component.html',
  styleUrls: ['./view-roles.component.scss']
})
export class ViewRolesComponent implements OnInit {
  rolesId: any;
  responseData: any = [];
  menulist: any = [];
  roletypes: any = [];
  selectedRole: any = '';
  menuId: any;
  RWFlag: boolean;
  isFav: boolean = false;
  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public customDatePipe: CustomDateFormatPipe,
    private point: PointTrackerService,
    private router: Router,
    private roleservice: RolesService,
    private activatedRoute: ActivatedRoute,
    private lookupService: LookupService,
    private userDataService: UserDataService
  ) { }

  ngOnInit(): void {
    //check permisions
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "23") {
        menuActionId = ele.menuActionId;
        this.menuId = ele.menuId;
      }
    });

    if (menuActionId == "3") {
      this.RWFlag = true;
    }

    this.getInitialData();
    this.activatedRoute.params.subscribe(async params => {
      this.rolesId = params.id;
      this.spinner.show();
      this.roleservice.getRoleDetails(`/api/roles/${this.rolesId}`, '').subscribe(res => {
        if (res.status.success === true) {
          this.responseData = res.response.role;
          this.menulist = this.responseData.menulist;
          let menuItems = [];
          userProfileData.rolePermissions.every((menu: any) => {
            let found = false;
            this.menulist.filter(function (selectedMenu: any) {
              if (!found && selectedMenu.menuId == menu.menuId) {
                menuItems.push(selectedMenu);
                found = true;
                return false;
              } else
                return true;
            });
            if(this.menulist.length === menuItems.length)
              return false;
            return true;
          });
          this.menulist = menuItems;
          for (var i = 0; i < this.roletypes.length; i++) {
            this.selectedRole = '';
            if (this.responseData.roleTypeId == this.roletypes[i].roleTypeId) {
              this.selectedRole = this.roletypes[i].roleType;
              return;
            }
          }
        } else {
          this.toastr.error(res.errors[0].message);
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
      });
    })

    this.checkFav();
  }

  private async getInitialData() {
    this.spinner.show();
    let res: any = await (
      this.roleservice.getRoleDetails(`/api/lookup/getRoleTypes`, '').pipe(
        catchError(err => {
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
          return of(false);
        })
      )
    ).toPromise();
    if (!res.status) {
      this.backToList();
      return false
    }
    if (res.status.success === true) {
      this.roletypes = res.response.roleTypes;
      this.spinner.hide();
    }
  }

  backToList() {
    this.router.navigate(['/user/roles']);
  }
  editPage() {
    this.router.navigate(['/user/roles/edit', this.rolesId]);
  }
  addPage() {
    this.router.navigate(['/user/roles/add']);
  }
  checkFav() {
    //check favorite
    this.lookupService.getFavInfo(`/api/favourites/isFavourite/${this.menuId}/${this.rolesId}`).subscribe(res => {
      if (res.response.favourite.isFavourite)
        this.isFav = true;
    });
  }
  makeFav() {
    this.spinner.show();
    this.lookupService.addasFav(`/api/favourites/${this.menuId}/${this.rolesId}`, {}).subscribe(res => {
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
    this.lookupService.removeFav(`/api/favourites/${this.menuId}/${this.rolesId}`, {}).subscribe(res => {
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