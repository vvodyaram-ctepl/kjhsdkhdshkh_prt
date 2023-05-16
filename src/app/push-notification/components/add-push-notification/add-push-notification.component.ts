import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { PlansService } from '../plans.service';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/components/alert-modal/alert.service';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { PushNotificationService } from '../push-notification.service';
import * as moment from 'moment';
import { ValidationService } from 'src/app/components/validation-message/validation.service';

 @Component({
    selector: 'app-add-push-notification',
    templateUrl: './add-push-notification.component.html',
    styleUrls: ['./add-push-notification.component.scss']
  })
  export class AddPushNotificationComponent implements OnInit {
  public pushForm: FormGroup;
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
    private pushService: PushNotificationService,
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
      console.log("path",path)
      if (path === 'edit-push-notification') {
        this.spinner.show();
        this.editProd = true;
        let str = this.router.url;
        this.id = str.split("edit-push-notification/")[1].split("/")[0];
        console.log("idddd",this.id);

        this.pushService.getPush(`/api/pushNotifications/${this.id}`).subscribe(res => {
          if (res.status.success === true) {
            this.planDetails = res.response.rows;
            this.spinner.hide();
            if (path === 'edit-push-notification') {
              this.pushForm.patchValue({
                'notificationName':this.planDetails.notificationName,
                'notificationMessage':this.planDetails.notificationMessage,
                'status':this.planDetails.status,
                'startDate':this.planDetails.startDate ? moment(this.planDetails.startDate).format("MM-DD-YYYY") : '',
                'endDate':this.planDetails.endDate ? moment(this.planDetails.endDate).format("MM-DD-YYYY") : ''
  
              })
            }
          }
        })

      }
      else {
        this.editProd = false;
      }
     

    });
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
    this.pushService.deletePush(`/api/study/disassociatePlan/${this.studyId}/${this.planId}`, {}).subscribe(res => {
      if (res.status.success === true) {
        this.toastr.success("Disassociated the plan with study");
        // this.getAllPlans();
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

  public buildForm(): void {
    this.pushForm = this.fb.group({
      notificationName: ['', [Validators.required,ValidationService.exceptSpecialChar]],
      notificationMessage: [''],
      status: ['', [Validators.required]],
      startDate:['', [Validators.required]],
      endDate:['', [Validators.required]]
    })
  }

  backToList() {
    this.router.navigate(['/user/push-notification']);
  }
  ngAfterViewInit() {
    this.pushForm.patchValue({
      'status': 1
    });
  }

  public updatePlans() {
    if (!this.pushForm.valid) {
      this.pushForm.markAllAsTouched();
      return false;
    }
    this.submitFlag = true;
    let push = this.pushForm.getRawValue();
    push['startDate']= this.customDatePipe.transform(this.pushForm.value.startDate, 'yyyy-MM-dd');
    push['endDate']=this.customDatePipe.transform(this.pushForm.value.endDate, 'yyyy-MM-dd');
    push['createdBy']= parseInt(this.userService.getUserId())
    push['status'] = this.pushForm.value.status != '' ? parseInt(this.pushForm.value.status) : '';
    if (this.editProd) {
      push['modifiedBy'] = parseInt(this.userService.getUserId());
      push['notificationId'] = parseInt(this.id);
      this.pushService.updatePush('/api/pushNotifications', push).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success('Push Notification updated successfully!');
          this.pushForm.markAsPristine();
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
      // push['createdBy'] = parseInt(this.userService.getUserId());
      this.pushService.addPush('/api/pushNotifications', push).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success('Push Notification added successfully!');
          this.pushForm.markAsPristine();
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
    if (next.url.indexOf('/user/push') > -1 && this.submitFlag) {
      return true;
    }
    if (this.pushForm.touched) {
      return this.alertService.confirm();
    }
    else {
      return true;
    }
  }
}

