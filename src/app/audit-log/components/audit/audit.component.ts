import { Component, OnInit } from '@angular/core';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { UserDataService } from 'src/app/services/util/user-data.service';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {
  headers: any;
  filterTypeArr: any[];
  public showDataTable: boolean = true;
  RWFlag: boolean;
  constructor(public customDatePipe: CustomDateFormatPipe,
    private userDataService: UserDataService) { }

  ngOnInit() {
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "9") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }
    this.headers = [
      { key: "userName", label: "User", checked: true, width: 100, sortable : true },
      { key: "actionName", label: "Action", checked: true, width: 100, sortable : true },
      { key: "moduleName", label: "Module", checked: true, width: 200, sortable : true },
      { key: "auditTimeStamp", label: "Date and Time", checked: true, width: 160, sortable : true },
      { key: "auditMessage", label: "Message", checked: true }
    ];
    this.filterTypeArr =
      [{
        name: "Action",
        id: "Action"
      },
      {
        name: "Module",
        id: "Menu"
      },
      {
        name: "Record Date Between",
        id: "dateType"
      }
      ];
  }
  public reloadDatatable() {
    this.showDataTable = false;
    setTimeout(() => {
      this.showDataTable = true;
    }, 1);
  }
  formatter($event) {
    $event.forEach(ele => {
      ele.auditTimeStamp = this.customDatePipe.transform(ele.auditTimeStamp, 'MM/dd/yyyy HH:mm:ss');
    })
  }
  getNode($event) {

  }
}
