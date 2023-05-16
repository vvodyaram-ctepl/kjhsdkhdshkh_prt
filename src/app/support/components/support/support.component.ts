import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { SupportService } from '../../support.service';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/services/util/user-data.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

  headers: any;
  filterTypeArr: any[];
  RWFlag: boolean;
  constructor(
    public router: Router,
    public customDatePipe: CustomDateFormatPipe,
    private supportservice: SupportService,
    private toastr: ToastrService,
    private userDataService: UserDataService
  ) { }

  ngOnInit() {
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "37") {
        console.log("text" + ele.menuId);
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3" || menuActionId == "4") {
      this.RWFlag = true;
    }
    this.headers = [
      { key: "ticketID", label: "TICKET#", checked: true,width: 70},
      { key: "ticketTitle", label: "TICKET TITLE", checked: true, clickable: true, width: 140,cellWidth:70, sortable : true },
      { key: "priority", label: "PRIORITY", checked: true, sortable : true },
      { key: "petName", label: "PET", checked: true, width: 80, sortable : true },
      { key: "study", label: "STUDY", checked: true, width: 120, sortable : true },
      { key: "issue", label: "ISSUE", checked: true, width: 100, sortable : true },
      { key: "assignedTo", label: "ASSIGNED TO", checked: true, width: 90 },
      { key: "lastModifiedOn", label: "LAST MODIFIED ON", checked: true, width: 110,cellWidth:25, format: 'MM/dd/yyyy' },
      { key: "aging", label: "AGING", checked: true, width: 84 },
      { key: "status", label: "STATUS", checked: true, width: 96 },
      { key: "static", label: "", checked: true, clickable: true, width:45 }
    ];
    this.filterTypeArr =
      [
        {
          name: "Priority",
          id: "ticketPriority"
        },
        {
          name: "Last Modified On",
          id: "dateType"
        },
        {
          name: "Status",
          id: "supportStatus"
        },
        {
          name: "Assigned To",
          id: "assignedTo"
        }
      ];
  }



  formatter($event) {
    $event.forEach(ele => {
      ele.createdDate = this.customDatePipe.transform(ele.createdDate, 'MM/dd/yyyy');
      if (this.RWFlag) {
        if (ele.status === 'Closed') {
          ele.static = `&nbsp;`
        } else {
          ele.static = `
          </div>&nbsp;<div class="card icon-card-list green-bg mb-2 mr-2" title="Edit">
          <span class="icon-tag size-20" title="Edit"></span>
          </div>`
        }
      }
      if (ele.status) {
        if (ele.status == 'Open') {
          ele['columnCssClass']['status'] = "inactive-status";
        } else if (ele.status == 'Closed') {
          ele['columnCssClass']['status'] = "active-status";
        } else {
          ele['columnCssClass']['status'] = "testing-status";
        }
      }
      if (ele.ticketTitle) {
        // ele['columnCssClass']['ticketTitle'] = "ellipsis"
        ele['columnTitle']['ticketTitle'] = ele.ticketTitle;
      }
      if (ele.lastModifiedOn) {
        ele.lastModifiedOn = this.customDatePipe.transform(ele.lastModifiedOn, 'MM/dd/yyyy');
      }
    });
  }
  /* &nbsp;<div class="card icon-card-list red-bg mb-2" title="Delete">
      <span class="fa fa-trash-alt size-14" style="color:red;" title="Delete"></span>
      </div> */

  getNode($event) {
    if ($event.header === 'ticketTitle') {
      this.router.navigate(['/user/support/view', $event.item.ticketID]);
    }

    let action = $event.event.target.title;
    if (action === 'Edit') {
      this.router.navigate(['/user/support/edit', $event.item.ticketID]);
    }
    if (action === 'Delete') {
      this.supportservice.deleteSupport(`/api/support/${$event.item.ticketID}`, '').subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success('Customer support record deleted successfully!');
          //         this.reloadDatatable();
        }
        else {
          this.toastr.error(res.errors[0].message);
        }
      }, err => {
        console.log(err)
        if (err.status == 500) {
          this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
        }
        else {
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
        }
      }
      )
    }
  }

  // public reloadDatatable() {
  //   this.showDataTable = false;
  //   setTimeout(() => {
  //     this.showDataTable = true;
  //   }, 1);
  // }

  addEditSupport() {
    this.router.navigate(['/user/support/add']);
  }
}
