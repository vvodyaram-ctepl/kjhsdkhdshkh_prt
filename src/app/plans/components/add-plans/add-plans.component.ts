import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlansService } from '../plans.service';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/components/alert-modal/alert.service';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { ValidationService } from 'src/app/components/validation-message/validation.service';

@Component({
  selector: 'app-add-plans',
  templateUrl: './add-plans.component.html',
  styleUrls: ['./add-plans.component.scss']
})
export class AddPlansComponent implements OnInit {
  public plansForm: FormGroup;
  editProd: boolean = false;
  planDetails: any = {};
  id: any = '';
  studyId: any = '';
  planId: any = '';
  studyNames: any = [];
  @ViewChild('archiveContent') archiveContent: ElementRef;
  modalRef2: NgbModalRef;
  submitFlag: boolean = false;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private planservice: PlansService,
    private toastr: ToastrService,
    private userService: UserDataService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private alertService: AlertService,
    public customDatePipe: CustomDateFormatPipe
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.activatedRoute.params.subscribe(async params => {
      const path = this.activatedRoute.snapshot.url[0].path;
      if (path === 'edit') {
        this.spinner.show();
        this.editProd = true;
        let str = this.router.url;
        this.id = str.split("edit/")[1].split("/")[0];
        this.getAllPlans();
      }
      else {
        this.editProd = false;
      }
      this.patchData(params, path);

    });
  }

  getAllPlans() {
    this.planservice.getPlanService(`/api/plans/${this.id}`).subscribe(res => {
      console.log(res);
      if (res.status.success === true) {
        this.planDetails = res.response.planListDTO;
        this.studyNames = this.planDetails.studyAssociatedObject;
        this.studyNames && this.studyNames.forEach(ele => {
          ele.associatedDate = this.customDatePipe.transform(ele.associatedDate, 'MM/dd/yyyy');
        })
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
    })
  }

  deleteRecord(studyId, planId) {
    this.studyId = studyId;
    this.planId = planId;
    this.openPopup(this.archiveContent, 'xs');
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

  UpdateStudyRecord() {
    this.planservice.deleteStudyName(`/api/study/disassociatePlan/${this.studyId}/${this.planId}`, {}).subscribe(res => {
      if (res.status.success === true) {
        this.toastr.success("Disassociated the plan with study");
        this.getAllPlans();
        this.modalRef2.close();
      }
      else {
        this.toastr.error(res.errors[0].message);
        this.modalRef2.close();
      }
    }, err => {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
      this.modalRef2.close();
    });
  }

  patchData(params, path): void {
    if (params.prodId) {
      this.planservice.getPlanService(`/api/plans/${params.prodId}`).subscribe(res => {
        if (res.status.success === true) {
          this.planDetails = res.response.planListDTO;
          if (path === 'edit') {
            this.plansForm.get('planName').setValue(this.planDetails.planName);
            this.plansForm.get('planDescription').setValue(this.planDetails.planDescription);
            this.plansForm.get('isActiv').setValue(this.planDetails.isActiv);
          }
        }
      })
    }
  }

  public buildForm(): void {
    this.plansForm = this.fb.group({
      planName: ['', [Validators.required,ValidationService.exceptSpecialChar]],
      planDescription: [''],
      isActiv: ['', [Validators.required]]
    })
  }

  backToList() {
    this.router.navigate(['/user/plans']);
  }
  ngAfterViewInit() {
    this.plansForm.patchValue({
      'isActiv': 1
    });
  }

  public updatePlans() {
    if (!this.plansForm.valid) {
      this.plansForm.markAllAsTouched();
      return false;
    }
    this.submitFlag = true;
    let plans = this.plansForm.getRawValue();
    plans['isActiv'] = this.plansForm.value.isActiv != '' ? parseInt(this.plansForm.value.isActiv) : '';
    if (this.editProd) {
      plans['modifiedBy'] = parseInt(this.userService.getUserId());
      plans['planId'] = parseInt(this.id);
      this.planservice.updatePlanService('/api/plans', plans).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success('Plan updated successfully!');
          this.plansForm.markAsPristine();
          this.backToList();
        }
        else {
          this.toastr.error(res.errors[0].message);
        }
      }, err => {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
      });
    }
    else {
      plans['createdBy'] = parseInt(this.userService.getUserId());
      this.planservice.addPlanService('/api/plans', plans).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success('Plan added successfully!');
          this.plansForm.markAsPristine();
          this.backToList();
        }
        else {
          this.toastr.error(res.errors[0].message);
        }
      }, err => {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
      });
    }

  }
  canDeactivate(component, route, state, next) {
    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if (next.url.indexOf('/user/plans') > -1 && this.submitFlag) {
      return true;
    }
    if (this.plansForm.pristine == false) {
      return this.alertService.confirm();
    }
    else {
      return true;
    }
  }
}

