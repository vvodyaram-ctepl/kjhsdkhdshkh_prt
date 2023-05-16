import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuestionnaireService } from '../../questionnaire.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list-questionnaire',
  templateUrl: './list-questionnaire.component.html',
  styleUrls: ['./list-questionnaire.component.scss']
})
export class ListQuestionnaireComponent implements OnInit {
  headers: any;
  filterTypeArr: any[];
  RWFlag: boolean;
  @ViewChild('archiveContent') archiveContent: ElementRef;
  modalRef2: NgbModalRef;
  showDataTable: boolean = true;
  questionnaireNameDisply: string;
  questionnaireIdDisplay: any;

  constructor(
    public router: Router,
    public customDatePipe: CustomDateFormatPipe,
    private toastr: ToastrService,
    private userDataService: UserDataService,
    private tabService: TabserviceService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private questionnaireService: QuestionnaireService,
  ) { }
  ngOnInit() {
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();

    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "26") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }
    this.headers = [
      { key: "questionnaireName", label: "Questionnaire Name", clickable: true, checked: true, sortable : true },
      { key: "questionnaireType", label: "Questionnaire Type", checked: true, sortable : true },
      { key: "startDate", label: "Start Date", checked: true, sortable : true },
      { key: "endDate", label: "End Date ", checked: true, sortable : true },
      { key: "status", label: "Status", checked: true },
      { key: "static", label: "", checked: true, clickable: true }
    ];
    this.filterTypeArr =
      [  {
        name: "Questionnaire Type",
        id: "questionnaireType"
      },
        {
          name: "Start/End Date",
          id: "questionnaireDate"
        },
        {
          name: "Status",
          id: "questionnaireStatus"
        }
      ];
  }

  addQuestionnaire() {
    this.tabService.clearDataModel();
    this.router.navigate(['/user/questionnaire/add']);
  }

  formatter($event) {
    $event.forEach(ele => {
      if (ele.isActive) {
        if (ele.isPublished) {
          ele.status = "Published";
          ele['columnCssClass']['status'] = "info-status";
        }
        else {
          ele.status = "Draft";
          ele['columnCssClass']['status'] = "active-status";
        }
      } else {
        ele.status = "Inactive";
        ele['columnCssClass']['status'] = "inactive-status";
      }

      ele.startDate = this.customDatePipe.transform(ele.startDate, 'MM/dd/yyyy');
      ele.endDate = this.customDatePipe.transform(ele.endDate, 'MM/dd/yyyy');

      if (this.RWFlag) {
        if (!ele.isPublished)
          ele.static = `<div class="card icon-card-list green-bg mb-2 mr-2" title="Edit">
                        <span class="icon-tag size-20" title="Edit"></span>
                      </div>&nbsp;<div class="card icon-card-list red-bg mb-2" title="Delete">
                      <span class="fa fa-trash-alt size-14" style="color:red;" title="Delete"></span>
                      </div>`
        else
          ele.static = `<div class="my-3">
                      </div>`
      }
    });
  }


  getNode($event) {
    if ($event.header === 'questionnaireName') {
      this.router.navigate(['/user/questionnaire/view', $event.item.questionnaireId]);
    }
    let action = $event.event.target.title;
    if (action === 'Edit') {
      this.tabService.clearDataModel();
      this.router.navigate(['/user/questionnaire/edit', $event.item.questionnaireId]);
    }
    if (action === 'Delete') {
      this.questionnaireNameDisply = $event.item.questionnaireName;
      this.questionnaireIdDisplay = $event.item.questionnaireId
      this.openPopup(this.archiveContent, 'xs');
    }
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

  public reloadDatatable() {
    this.showDataTable = false;
    setTimeout(() => {
      this.showDataTable = true;
    }, 1);
  }

  deleteRecord() {
    this.spinner.show();
    this.questionnaireService.deleteQuestionnaire(`/api/questionnaire/${this.questionnaireIdDisplay}`, {}).subscribe(res => {
      if (res.status.success === true) {
        this.toastr.success('Questionnaire  deleted successfully!');
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
        this.modalRef2.close();
        this.spinner.hide();
      })
  }
}
