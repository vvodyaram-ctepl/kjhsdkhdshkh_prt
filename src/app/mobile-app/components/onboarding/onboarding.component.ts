import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AddUserService } from 'src/app/clinical-users/components/add-user.service';
import { MobileAppService } from '../../mobile-app.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {

  headers: any;
  public showDataTable: boolean = true;
  filterTypeArr: any[];
  modalRef: NgbModalRef;
  studyForm: FormGroup;
  studyList = [];
  @ViewChild('assignStudy') assignStudy: ElementRef;

  constructor(
    private fb: FormBuilder,
    private addUserService: AddUserService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private mobileAppService: MobileAppService,
    private toastr: ToastrService
  ) {
    this.studyForm = this.fb.group({
      'study': ['', [Validators.required]],
      'petId': 0
    })
  }

  ngOnInit() {
    this.headers = this.getHeaders();
    this.getStudyList();
  }

  getHeaders() {
    return [
      { key: "petName", label: "Pet Name", checked: true, sortable : true },
      { key: "petParentName", label: "Pet Parent Name", checked: true, sortable : true },
      { key: "email", label: "Pet Parent Email ID", checked: true, sortable : true },
      { key: "deviceId", label: "Asset Number", checked: true, sortable : true },
      { key: "static", label: "", clickable: true, checked: true, width:120 },
    ];
  }

  formatter($event) {
    $event.forEach(ele => {
      ele.static = `<div class="my-1" title="Assign Study">
      <span class="active-status-new" title="Assign Study">Assign</span>
      </div>`
    });
  }

  getNode($event) {
    let action = $event.event.target.title;
    if (action === 'Assign Study' && this.studyList.length > 0) {
      this.openPopup(this.assignStudy, 'xs');
      this.studyForm.patchValue({ petId: $event.item.petId });
    }else{
      this.toastr.error("User should have at lease one active study","Error!");
    }
  }

  getStudyList() {
    this.addUserService.getStudy('/api/study/getStudyList', '').subscribe(res => {
      this.studyList = res.response.studyList;
      this.studyList = this.studyList.filter(ele => ele.studyId != 2901);
      console.log("this.studyList",this.studyList)
    });
  }

  openPopup(div, size) {
    this.modalRef = this.modalService.open(div, {
      size: size,
      windowClass: 'smallModal',
      backdrop: 'static',
      keyboard: false
    });
  }

  clearStudy() {
    this.studyForm.patchValue({
      'study': ''
    });
    this.studyForm.markAsPristine();
    this.studyForm.markAsUntouched();
  }

  assignStudySubmit() {
    if (this.studyForm.valid) {
      this.spinner.show();
      const petId = this.studyForm.value.petId,
        studyId = this.studyForm.value.study.studyId;

      this.mobileAppService.assignStudy(`/api/mobileapp/assignStudyToPet/${petId}/${studyId}`, {}).subscribe(res => {
        if (res.status.success === true) {
          this.reloadDatatable();
          this.toastr.success('Study assigned successfully!');
        }
        else {
          this.toastr.error(res.errors[0].message);
        }
        this.spinner.hide();
        this.modalRef.close();
        this.studyForm.patchValue({
          'study': ''
        });
        this.studyForm.markAsPristine();
        this.studyForm.markAsUntouched();
      },
        err => {
          if (err.status == 500) {
            this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
          }
          else {
            this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
          }
          this.studyForm.reset();
          this.spinner.hide();
          this.modalRef.close();
        }
      )
    }
  }

  public reloadDatatable() {
    this.showDataTable = false;
    setTimeout(() => {
      this.showDataTable = true;
    }, 1);
  }
}
