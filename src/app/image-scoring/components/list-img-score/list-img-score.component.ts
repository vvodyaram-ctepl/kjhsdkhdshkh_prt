// import { Component, OnInit } from '@angular/core';
import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { TabserviceService } from 'src/app/shared/tabservice.service';

import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClinicService } from 'src/app/clinics/components/clinic.service';
import { ImgScoreService } from '../img-score.service';

@Component({
  selector: 'app-list-img-score',
  templateUrl: './list-img-score.component.html',
  styleUrls: ['./list-img-score.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListImgScoreComponent implements OnInit {
  @ViewChild('archiveContent') archiveContent: ElementRef;
  modalRef2: NgbModalRef;
  headers: any;
  filterTypeArr: any[];
  showDataTable: boolean = true;
  RWFlag: boolean;
  imageScoringScaleId: any;
  imageScoringScaleName: any;
  constructor(public router: Router,
    public customDatePipe: CustomDateFormatPipe,
    private tabservice: TabserviceService,
    private imgService: ImgScoreService,
    private toastr: ToastrService,
    private userDataService: UserDataService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "38") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }

    this.headers = [
      // { key: "imageScoringScaleId", label: "Image Scoring Scale ID", checked: true },
      { key: "imageScaleName", label: "Image Scale Name", checked: true, clickable: true, width: 200, sortable: true },

      { key: "classification", label: "classification", checked: true },

      { key: "scoringType", label: "Scoring Type", checked: true },
      { key: "speciesName", label: "species", checked: true },
      // { key: "noOfScales", label: "No. of Scales", checked: true },
      { key: "modifiedDate", label: "Modified Date", checked: true, sortable: true },
      { key: "status", label: "Status", checked: true },
      { key: "static", label: "", checked: true, clickable: true }
    ];


    this.filterTypeArr =
      [{
        name: "Scale Type",
        id: "scoreIds"
      },
      {
        name: "Status",
        id: "questionnaireStatus"
      },

      ];
  }

  formatter($event) {
    //     $event.forEach(ele => {
    //       if (ele.isActive == true) {
    //         ele.isActive = "Active";
    //         ele['columnCssClass']['isActive'] = "active-status";
    //       } else {
    //         ele.isActive = "Inactive";
    //         ele['columnCssClass']['isActive'] = "inactive-status";
    //       }

    //       ele.createdDate = this.customDatePipe.transform(ele.createdDate, 'MM/dd/yyyy');
    //       ele.modifiedDate = this.customDatePipe.transform(ele.modifiedDate, 'MM/dd/yyyy');
    //       // ele.endDate = this.customDatePipe.transform(ele.endDate, 'MM/dd/yyyy');

    //       if (this.RWFlag) {
    //         ele.static = `<div class="card icon-card-list green-bg mb-2 mr-2" title="Edit">
    //   <span class="icon-tag size-20" title="Edit"></span>
    // </div>&nbsp;<div class="card icon-card-list red-bg mb-2" title="Delete">
    // <span class="fa fa-trash-alt size-14" style="color:red;" title="Delete"></span>
    // </div>`

    //       }
    //     });
    $event.forEach(ele => {
      if (!ele.speciesName) {
        ele.speciesName = "Both"
      }

      if (ele.statusId == 2) {
        ele.status = "Published";
        ele['columnCssClass']['status'] = "info-status";
      }
      else if (ele.statusId == 1) {
        ele.status = "Draft";
        ele['columnCssClass']['status'] = "active-status";
      }
      else if (ele.statusId == 0) {
        ele.status = "Inactive";
        ele['columnCssClass']['status'] = "inactive-status";
      }

      ele.modifiedDate = this.customDatePipe.transform(ele.modifiedDate, 'MM/dd/yyyy');
      // ele.endDate = this.customDatePipe.transform(ele.endDate, 'MM/dd/yyyy');

      if (this.RWFlag) {
        if (ele.statusId == 0 && ele.isPublished) {
          ele.static = `<div class="my-3">
    </div>`
        }
        else if (ele.statusId == 2) {
          ele.static = `<div class="card icon-card-list green-bg mb-2 mr-2" title="Edit">
      <span class="icon-tag size-20" title="Edit"></span>
    </div>`
        }
        else {
          ele.static = `<div class="card icon-card-list green-bg mb-2 mr-2" title="Edit">
    <span class="icon-tag size-20" title="Edit"></span>
  </div>&nbsp;<div class="card icon-card-list red-bg mb-2" title="Delete">
  <span class="fa fa-trash-alt size-14" style="color:red;" title="Delete"></span>
  </div>`
        }


      }
    });
  }

  getNode($event) {
    console.log('event ::: ', $event);
    if ($event.header === 'imageScaleName') {
      this.tabservice.clearDataModel();
      this.router.navigate(['/user/imagescore/view', $event.item.imageScoringScaleId]);
    }
    let action = $event.event.target.title;
    if (action === 'Edit') {
      this.tabservice.clearDataModel();
      this.router.navigate(['/user/imagescore/edit', $event.item.imageScoringScaleId]);
    }
    if (action === 'Delete') {
      let res = Object.assign({});
      res.id = $event.item.imageScoringScaleId;
      this.imageScoringScaleId = res.id;
      // if ($event.item.isActive === "Inactive") {
      this.openPopup(this.archiveContent, 'xs');
      this.imageScoringScaleName = $event.item.imageScaleName;
      // }
      // else {
      //   this.toastr.error("Cannot delete an active study");
      // }
    }

  }
  deleteImg() {
    this.spinner.show();
    // DELETE /imageScoringScales/{id}
    this.imgService.deleteImgScore(`/api/imageScoringScales/${this.imageScoringScaleId}`, '').subscribe(res => {
      if (res.status.success === true) {
        this.toastr.success('Image Score deleted successfully!');
        this.reloadDatatable();
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
      this.modalRef2.close();
    },
      err => {
        if (err.status == 500) {
          this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
        }
        else {
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
        }
        this.modalRef2.close();
        this.spinner.hide();
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
  editRecord() {
    this.router.navigate(['/user/imagescore/edit'])
  }

  public reloadDatatable() {
    this.showDataTable = false;
    setTimeout(() => {
      this.showDataTable = true;
    }, 1);
  }

  addNew() {
    this.tabservice.clearDataModel();
    this.router.navigate(['/user/imagescore/add']);
  }

}

