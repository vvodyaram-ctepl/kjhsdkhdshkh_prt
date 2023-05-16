import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/services/util/user-data.service';

@Component({
  selector: 'app-assets-management',
  templateUrl: './assets-management.component.html',
  styleUrls: ['./assets-management.component.scss']
})
export class AssetsManagementComponent implements OnInit {
  RWFlag: boolean;
  headers: any;
  filterTypeArr: any[];
  constructor(private userDataService: UserDataService) { }
  ngOnInit() {

    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == 17) {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }
    this.headers = [
      { key: "deviceType", label: "Asset Type", checked: true },
      { key: "deviceModel", label: "Device Model", checked: true },
      { key: "deviceNumber", label: "Device #", checked: true },
      { key: "study", label: "Study", checked: true },
      { key: "location", label: "Location", checked: true },
      { key: "isActive", label: "Status", checked: true },
      { key: "static", label: '', clickable: true, checked: true, width: 80 }
    ];
    this.filterTypeArr =
      [{
        name: "Study",
        id: "Study"
      },
      {
        name: "Asset Type",
        id: "deviceType"
      }
      ];
  }


}
