import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { PetParentService } from '../../pet-parent.service';

@Component({
  selector: 'app-pet-parent',
  templateUrl: './pet-parent.component.html',
  styleUrls: ['./pet-parent.component.scss']
})
export class PetParentComponent implements OnInit {

  headers: any;
  filterTypeArr: any[];
  RWFlag: boolean;
  modalRef2: NgbModalRef;
  petParentId: any;
  parentName: any;
  showDataTable: boolean = true;

  @ViewChild('archiveContent') archiveContent: ElementRef;

  constructor(
    public router: Router,
    public customDatePipe: CustomDateFormatPipe,
    private userDataService: UserDataService,
    private tabservice: TabserviceService,
    private parentService: PetParentService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "15") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }
    this.headers = [
      { key: "petParentName", label: "Pet Parent Name", checked: true, clickable: true, sortable : true },
      { key: "email", label: "Email ID", checked: true, sortable : true },
      // { key: "studyNames", label: "Study", checked: true, width: 200 },
      { key: "petNames", label: "Pets", checked: true, width: 200 },
      { key: "createdDate", label: "Created on", checked: true, sortable : true },
      { key: "isActive", label: "Status", checked: true },
      { key: "static", label: "", clickable: true, checked: true },
    ];
    this.filterTypeArr =
      [{
        name: "Status",
        id: "Status"
      },
        // {
        //   name: "Study",
        //   id: "Study"
        // }
      ];
  }

  formatter($event) {
    $event.forEach(ele => {
      ele.createdDate = this.customDatePipe.transform(ele.createdDate, 'MM/dd/yyyy');
      ele.id = ele.rnum;

      if (ele.petNames) {
        ele.petNames = ele.petNames.toString().split(',').join(', ');
      }

      if (ele.isActive == true) {
        ele.isActive = "Active";
        ele['columnCssClass']['isActive'] = "active-status";
      } else {
        ele.isActive = "Inactive";
        ele['columnCssClass']['isActive'] = "inactive-status";
      }
      if (ele.petParentFirstName) {
        ele['petParentName'] = ele.petParentFirstName + " " + ele.petParentLastName;
      }


      if (this.RWFlag) {
        ele.static = `<div class="card icon-card-list green-bg mb-2 mr-2" title="Edit">
    <span class="icon-tag size-20" title="Edit"></span>
  </div>&nbsp;<div class="card icon-card-list red-bg mb-2" title="Delete">
  <span class="fa fa-trash-alt size-14" style="color:red;" title="Delete"></span>
  </div>`
      }

    });
  }

  getNode($event) {
    let action = $event.event.target.title;
    if ($event.header === 'petParentName') {
      this.tabservice.clearDataModel();
      this.router.navigate(['/user/petparent/view-pet-parent/', $event.item.petParentId]);
    }
    if (action === 'Edit') {
      this.tabservice.clearDataModel();
      this.router.navigate(['user/petparent/edit-pet-parent/', $event.item.petParentId]);
    }

    if (action === 'Delete') {
      let res = Object.assign({});
      res.id = $event.item.petParentId;
      this.petParentId = res.id;
      //commenting the code for backend to show the toastr
      // if($event.item.onStudyPetExist){
      //   this.toastr.error(`Cannot delete ${$event.item.petParentFirstName + ' ' + $event.item.petParentLastName} which is already being referenced`);
      //   return;
      // }
      //cannot delete record which is already being referenced.
      this.openPopup(this.archiveContent, 'xs');
      this.parentName = $event.item.petParentName;

    }

  }

  deletePetparent() {
    this.spinner.show();
    this.parentService.deletePetParent(`/api/petParents/${this.petParentId}`, '').subscribe(res => {
      if (res.status.success === true) {
        this.reloadDatatable();
        this.toastr.success('Pet Parent deleted successfully!');
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.modalRef2.close();
      this.spinner.hide();
    },
      err => {
        this.modalRef2.close();
        this.spinner.hide();
        if (err.status == 500) {
          this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
        }
        else {
          this.toastr.error(err.error.errors[0] ?.message || 'Something went wrong. Please try after sometime or contact administrator.');
        }
      })
  }
  openPopup(div, size) {
    console.log('div :::: ', div);
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

  public reloadDatatable() {
    this.showDataTable = false;
    setTimeout(() => {
      this.showDataTable = true;
    }, 1);
  }

  addPetParent() {
    this.tabservice.clearDataModel();
    this.router.navigate(['/user/petparent/add-pet-parent/pet-parent-details']);
  }
}
