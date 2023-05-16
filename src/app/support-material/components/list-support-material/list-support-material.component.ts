import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { SupportMaterialService } from '../../support-material.service';


@Component({
  selector: 'app-list-support-material',
  templateUrl: './list-support-material.component.html',
  styleUrls: ['./list-support-material.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListSupportMaterialComponent implements OnInit {
  filterTypeArr: { name: string; id: string; }[];
  RWFlag: boolean;
  headers: any = [];

  constructor(public router: Router,private userDataService: UserDataService) { }

  ngOnInit(): void {
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "35") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }
    this.headers = [
      { key: "materialType", label: "Material Type", checked: true , clickable: true},
      { key: "materialCount", label: "Material Count", checked: true }
    ];
    
    this.filterTypeArr =[{
        name: "Material Type",
        id: "materialType"
      }
    ];
    
  }

  navigateToAddSupport(){
    this.router.navigate(['user/support-material/add']);
  }
  formatter($event){
    $event.forEach(ele => {
      if (this.RWFlag) {
        ele.static = `
        </div>&nbsp;<div class="card icon-card-list green-bg mb-2 mr-2" title="Edit">
        <span class="icon-tag size-20" title="Edit"></span>
        </div>&nbsp;<div class="card icon-card-list red-bg mb-2" title="Delete">
        <span class="fa fa-trash-alt size-14" style="color:red;" title="Delete"></span>
        </div>`
      }
    });
  }
  getNode($event) {

    let action = $event.event.target.title;
    let materialType = $event.item.materialType;
    if ($event.header === 'materialType') {
      // this.router.navigate([`/user/support-material/view/${$event.item.materialType}/${$event.item.supportMaterialId}`]);
      this.router.navigate([`/user/support-material/view/${$event.item.materialType}/${$event.item.materialTypeId}`]);
    }
  
    if (action === 'Edit') {
      this.router.navigate(['/user/support-material/edit', $event.item.supportMaterialId]);
    }
    if (action === 'Delete') {
       // delete goes here.
    }
  }

}
