import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from 'src/app/components/alert-modal/alert.service';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { LookupService } from 'src/app/services/util/lookup.service';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { PointTrackerService } from '../../point-tracker.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-campaign-activities',
  templateUrl: './campaign-activities.component.html',
  styleUrls: ['./campaign-activities.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CampaignActivitiesComponent implements OnInit {
  RWFlag: boolean = false;
  modalRef: NgbModalRef;
  trackId: string;
  selectTypeList: { name: string; }[];
  public showDataTable: boolean = false;
  headers: any;
  modalRef2: NgbModalRef;
  @ViewChild('archiveContent') archiveContent: ElementRef;
  @ViewChild('videoPopup') videoPopup: ElementRef;
  @ViewChild('archiveContent4') archiveContent4: ElementRef;
  filterTypeArr: any[];
  behaviorArr: any;
  newArr: any[];
  petName: any;
  rejectObject: any;
  trackerRejectReasons: any;
  reasonRejected: any = '';
  newArr1: any[];
  behaviorArr1: any;
  behavior: any;
  playVideoUrl: any = '';

  @ViewChild('customOptions') customOptions: ElementRef;
  playImgUrl: string;
  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public customDatePipe: CustomDateFormatPipe,
    private point: PointTrackerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private lookupService: LookupService,
    private userService: UserDataService,
    private modalService: NgbModal,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    //permission for the module
    let userProfileData = this.userService.getRoleDetails();
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == 21 && ele.menuActionId == 3) {
        this.RWFlag = true;
      }
    });
    this.spinner.show();
    if (this.router.url.indexOf('/user/point-tracking/view/') > -1) {
      let str = this.router.url;
      this.trackId = str.split("/user/point-tracking/view/")[1].split("/")[0];
    }
    this.point.getPointById(`/api/pointTrackers/${this.trackId}`, '').subscribe(res => {
      this.behaviorArr1 = res.response.pointTracker.pointTrackerMetricAssociatedObject || [];
      this.newArr1 = [];
      this.behaviorArr1.forEach(ele => {
        ele['name'] = ele.metricName;
        ele['value'] = ele.metricId;
        this.newArr1.push(ele);
      })

      // let speciesId = '1';
      // this.lookupService.getFeedbackpageList(`/api/lookup/getPetBehaviors/${speciesId}`).subscribe(res => {
      this.lookupService.getFeedbackpageList(`/api/lookup/getPointTrackerMetrics`).subscribe(res => {
        this.spinner.hide();
        // if(res.success == true) {
        this.behaviorArr = res.response.pointTrackerMetrics;
        this.newArr = [];
        this.behaviorArr1.forEach(ele1 => {
          this.behaviorArr.forEach(ele => {
            ele['name'] = ele.metricName;
            ele['value'] = ele.metricId;
            if (ele.metricId === ele1.metricId) {
              this.newArr.push(ele);
            }
          })
        })
        this.reloadDatatable();
        // }
      },
        err => {
          this.spinner.hide();
          this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
        }
      );
    },


      err => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
      }
    );


    this.filterTypeArr =
      [
        {
          name: "Activity",
          id: "trackerActivity"
        },
        {
          name: "Behavior",
          id: "behavior"
        },
        {
          name: "Duration",
          id: "dateType"
        },
        /* {
          name: "Study",
          id: "Study"
        }, */
        {
          name: "Status",
          id: "trackerStatus"
        }
      ];
    this.getRejectReasons();
  }

  changeBehav(spece) {
    
      let speciesId = spece;
      this.lookupService.getFeedbackpageList(`/api/lookup/getPetBehaviors/${speciesId}`).subscribe(res => {
      //   this.lookupService.getFeedbackpageList(`/api/lookup/getPointTrackerMetrics`).subscribe(res => {
          this.spinner.hide();
          // if(res.success == true) {
          this.behaviorArr = res.response.pointTrackerMetrics;
          this.newArr = [];
          this.behaviorArr1.forEach(ele1 => {
            this.behaviorArr.forEach(ele => {
              ele['name'] = ele.metricName;
              ele['value'] = ele.metricId;
              if (ele.metricId === ele1.metricId) {
                this.newArr.push(ele);
              }
            })
          })
          // this.reloadDatatable();
          // }
        },
          err => {
            this.spinner.hide();
            this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
          }
        );
  }
  public reloadDatatable() {
    this.showDataTable = false;
    setTimeout(() => {
      this.showDataTable = true;
    }, 1);
  }
  getRejectReasons() {
    // api/lookup/getTrackerRejectReasons
    this.spinner.show();
    this.lookupService.getFeedbackpageList(`/api/lookup/getTrackerRejectReasons`).subscribe(res => {
      if (res.response.trackerRejectReasons) {
        this.trackerRejectReasons = res.response.trackerRejectReasons;
      }
      this.spinner.hide();
    },
      err => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
      }
    );

  }

  playImg(videoPath) {
    console.log(videoPath);
   if(videoPath == '') {
   this.playImgUrl = 'assets/images/no-dogs.svg'
  }
  else {
    this.playImgUrl = videoPath;
  }
    this.openPopup2(this.archiveContent4, 'xs');
   
  }

  
  openPopup2(div, size) {
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


  
  formatter(event) {
    event.forEach(ele => {
      /* ele.inlineSelectOptions['behavior'] = this.behaviorArr;
      if (ele.status != 'Approved' && (ele.activity == 'Images' || ele.activity == 'Videos')) {
        ele.editableIcon['behavior'] = true;
      }
      else if (ele.activity == 'Questionnaire') {
        ele.behavior = `<a class="custom-link">Click to access</a>`;
      }
      else {
        ele.behavior = '';
      } */

      ele['customTemplateJson']['static'] = { 'rowData': ele };

      ele.oldBehavior = ele.behavior;

      if (ele.activity == 'Images' && ele.imageURL)
        ele.media = `<span class="image"><img src= ` + ele.imageURL + ` height="50" width="60"></span>`;
      else if (ele.activity == 'Videos' && ele.videoURL)
        ele.media = '<div class="choose-images"><div class="thumbnaildiv"><img src=' + (ele.media ? ele.media : "assets/images/no-video.png") + ' class="p-image" ><i class="far fa-play-circle"></i></div></div>';
      else
        ele.media = '';

      ele.createdDate = this.customDatePipe.transform(ele.createdDate, 'MM/dd/yyyy');
      if (ele.status == 'Approved') {
        ele['columnCssClass']['status'] = "approve-status";
      }
      else if (ele.status == 'Rejected') {
        ele['columnCssClass']['status'] = "reject-status";
      }
      else if (ele.status == 'Pending') {
        ele['columnCssClass']['status'] = "pending-status";
      }else{
        ele['columnCssClass']['status'] = "inreview-status";
      }

      if (ele.status == 'Approved') {
        ele.points = ele.points;
      }
      else {
        ele.points = 'NA';
      }
      if (this.RWFlag && ele.status == 'Rejected') {
        ele.action = `<div class="accept-button mb-2" title="Approve">
      <span style="color:#1CCF99;" title="Approve">Approve</span>
      </div>`
      }
      if (this.RWFlag && (ele.status == 'Pending' || ele.status == 'In-Review')) {
        ele.action = `<div class="accept-button mb-2 mr-2" title="Approve">
      <span style="color:#1CCF99;" title="Approve">Approve</span>
      </div><div class="reject-button mb-2" title="Reject">
    <span style="color:red;" title="Reject">Reject</span>
    </div>`
      }
    })
  }
  getNode($event) {

   
    let action = $event.event.target.title;
    // let behavId = '';
    this.behaviorArr.forEach(ele => {
      if (ele.metricName == $event.item.behavior) {
        $event.item.behaviorId = ele.metricId;
      }
    })
    let item = $event.item;
    let res = Object.assign({});
    res["trackerPetPointsId"] = item.trackerPetPointsId;
    res["behaviorId"] = item.behaviorId; //item.behaviorId
    res["modifiedBy"] = this.userService.getUserId();
    if (action === 'Approve') {
      if (item.status == 'Rejected') {
        this.alertService.confirm({ title: 'Alert', message: `The activity for `, activityName: item.petName, extraMessage: ` has been rejected before. Are you sure you want to approve this ?` }).then(result => {
          if (result) {
            this.spinner.show();
            this.confirmApporval(res);
          }
        }, (close) => {
          $event.item.behavior = $event.item.oldBehavior;
        });
      }
      else {
        this.confirmApporval(res);
      }
    }
    if (action === 'Reject') {
      this.petName = $event.item.petName;
      res["statusId"] = 3;
      res["rejectNotes"] = "";
      this.openPopup(this.archiveContent, 'xs', res, $event);
    }
    if ($event.header === 'media' && item.activity == 'Videos') {
      this.modalRef2 = this.modalService.open(this.videoPopup, {
        size: 'xs',
        windowClass: 'smallModal',
        backdrop: 'static',
        keyboard: false
      });
      this.modalRef2.result.then((result) => {
        console.log(result);
      }, () => {
      });
      this.playVideoUrl = item.videoURL;
    }
    if ($event.header === 'media' && item.activity == 'Images') {
      let play = $event.item.imageURL;
      this.playImg(play)
    }
  
  }

  confirmApporval(res: any) {
    res["statusId"] = 2;
    this.spinner.show();
    this.point.addPromotion('/api/pointTrackers/updateTrackerActStatus', res).subscribe(res => {
      if (res.status.success === true) {
        this.reloadDatatable();
        this.spinner.hide();
        this.toastr.success('Yay, the behavior is approved!');
      }
    },
      err => {
        this.spinner.hide();
        if (err.status == 500) {
          this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
        }
        else {
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
        }
      }
    )
  }

  openPopup(div, size, res, $event) {
    this.rejectObject = res;
    this.reasonRejected = '';
    this.modalRef2 = this.modalService.open(div, {
      size: size,
      windowClass: 'smallModal',
      backdrop: 'static',
      keyboard: false
    });
    this.modalRef2.result.then((result) => {
    }, (close) => {
      $event.item.behavior = $event.item.oldBehavior;
    });
  }
  rejectActivity() {
    this.rejectObject['rejectNotes'] = this.reasonRejected;
    this.spinner.show();
    this.point.addPromotion('/api/pointTrackers/updateTrackerActStatus', this.rejectObject).subscribe(res => {
      if (res.status.success === true) {
        this.reloadDatatable();
        this.spinner.hide();
        this.toastr.success('The behavior is rejected!');
      }
    },
      err => {
        this.spinner.hide();
        if (err.status == 500) {
          this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
        }
        else {
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
        }
      }
    )
  }

  ngAfterViewInit() {
    this.headers = [
      { key: "petName", label: "Pet", checked: true, width: 100 },
      // { key: "studyName", label: "Study", checked: true, width: 150 },
      { key: "createdDate", label: "Date", checked: true, width: 100 },
      { key: "obseravattion", label: "Observation", checked: true },
      { key: "activity", label: "Activity", checked: true, width: 100 },
      {
        key: "static", label: "Behavior", checked: true, customTemplate: this.customOptions,
        jsonKeys: ['rowData'], width: 150
      },
      /* {
        key: "behavior", label: "Behavior", checked: true, width: 180,
        editableType: "select",
        editableSchema: this.behaviorArr,
        editable: true
      }, */
      { key: "media", label: "Media", checked: true.valueOf, clickable: true },
      { key: "points", label: "Points", checked: true },
      { key: "status", label: "Status", checked: true, width: 80 },
      { key: "action", label: "Action", checked: true, clickable: true },
    ];
    this.showDataTable = true;
  }
}
