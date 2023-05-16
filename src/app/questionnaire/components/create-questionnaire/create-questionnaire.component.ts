import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { AlertService } from 'src/app/components/alert-modal/alert.service';
import { QuestionnaireService } from '../../questionnaire.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LookupService } from 'src/app/services/util/lookup.service';
import { ValidationService } from 'src/app/components/validation-message/validation.service';

@Component({
  selector: 'app-create-questionnaire',
  templateUrl: './create-questionnaire.component.html',
  styleUrls: ['./create-questionnaire.component.scss']
})
export class CreateQuestionnaireComponent implements OnInit, AfterViewInit, AfterViewChecked {

  addQuestionnaireForm: FormGroup;
  editFlag: boolean = false;
  defaultDate = moment('2099-12-31T00:00:00-00:00').format('MM/DD/YYYY')
  editId: any;
  data: any;
  questionnaireTypes: any = [];
  questionnaireCategories: any = [];
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private tabservice: TabserviceService,
    private alertService: AlertService,
    private customDatePipe: CustomDateFormatPipe,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private questionnaireService: QuestionnaireService,
    private lookupServ: LookupService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {

    this.addQuestionnaireForm = this.fb.group({
      questionnaireId: [],
      questionnaireName: ['', [Validators.required, ValidationService.exceptSpecialChar]],
      questionnaireTypeId: ['', [Validators.required]],
      questionnaireCategoryId: [''],
      startDate: ['', [Validators.required]],
      endDate: ['12-31-2099', [Validators.required]],
      isActive: [true],
      isPublished: [false],
      status: ['']
    });
    this.getQuesTypes();
  }

  ngOnInit() {
    this.data = this.tabservice.getModelData();
    // edit flag should be true when only route includes
    if (this.router.url.includes("/user/questionnaire/edit")) {
      this.editFlag = true;
      this.editId = this.router.url.split('edit/')[1].split('/')[0];
    }
    if (this.router.url.includes("/user/questionnaire/edit") && (!this.data || (this.data && !this.data.basicDetails))) {
      this.spinner.show();
      let resp: any;
      this.questionnaireService.getQuestionnaireById(`/api/questionnaire/${this.editId}`).subscribe(async res => {
        if (res.status.success === true) {
          let ques = res.response.questionnaire;
          ques.questions.forEach((q, i) => {
            ques.questions[i].preDefinedQuestion = ques.questions[i].question;
          });
          resp = {
            basicDetails: {
              questionnaireId: ques.questionnaireId,
              questionnaireName: ques.questionnaireName,
              questionnaireTypeId: ques.questionnaireTypeId,
              questionnaireCategoryId: ques.questionnaireCategoryId,
              startDate: this.customDatePipe.transform(ques.startDate, 'MM-dd-yyyy'),
              endDate: this.customDatePipe.transform(ques.endDate, 'MM-dd-yyyy'),
              isActive: ques.isActive,
              isPublished: ques.isPublished,
              status: !ques.isActive ? "Inactive" : (!ques.isPublished ? "Draft" : "Published")
            },
            instructions: ques.instructions,
            addedQuestions: ques.questions
          }
          await this.getQuestionnaireCategoryById(ques.questionnaireTypeId);
          await this.tabservice.setModelData(resp.basicDetails, 'basicDetails');
          await this.tabservice.setModelData(resp.instructions, 'instructions');
          await this.tabservice.setModelData(resp.addedQuestions, 'addedQuestions');
          await this.tabservice.setModelData(resp.addedQuestions, 'questions');
          await this.patchData();
          setInterval(() => {
            this.spinner.hide();
          }, 300);
        }
        else {
          this.toastr.error(res.errors[0].message);
          this.spinner.hide();
        }
      },
        err => {
          if (err.status == 500) {
            this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
            this.spinner.hide();
          }
          else {
            this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
            this.spinner.hide();
          }
        }
      );
    }
    else {
      this.patchData();
    }
  }

  getQuesTypes() {
    // GET /lookup/getQuestionnaireTypes
    this.lookupServ.getCommon('/api/lookup/getQuestionnaireTypes').subscribe(res => {
      if (res.status.success === true) {
        this.questionnaireTypes = res.response.questionnaireTypes;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
  }

  questionnaireTypeSelect($event) {
    if ($event.target.value == '') {
      this.questionnaireCategories = [];
    }
    if ($event) {
      this.addQuestionnaireForm.patchValue({
        'questionnaireCategoryId': ''
      });
      let questionnaireTypeId = $event.target.value;
      if (questionnaireTypeId == 2) {
        this.addQuestionnaireForm.controls['questionnaireCategoryId'].setValidators([Validators.required]);
        this.addQuestionnaireForm.controls['questionnaireCategoryId'].updateValueAndValidity();
      }
      else {
        this.addQuestionnaireForm.controls['questionnaireCategoryId'].setValidators([]);
        this.addQuestionnaireForm.controls['questionnaireCategoryId'].updateValueAndValidity();
      }
      // GET /lookup/getQuestionnaireCategoryList/{questionnaireTypeId}
      if (questionnaireTypeId) {
        this.spinner.show();
        this.lookupServ.getCommon(`/api/lookup/getQuestionnaireCategoryList/${questionnaireTypeId}`).subscribe(res => {
          if (res.status.success === true) {
            this.questionnaireCategories = res.response.questionnaireCategories;
          }
          else {
            this.toastr.error(res.errors[0].message);
          }
          this.spinner.hide()
        }, err => {
          this.spinner.hide()
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
        });
      }
    }
  }
  ngAfterViewInit() {

    if (!this.data || !this.data.basicDetails)
      this.addQuestionnaireForm.patchValue({ endDate: '12-31-2099', status: 'Draft' })
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  patchData() {
    this.data = this.tabservice.getModelData();
    let res = this.data ? (this.data['basicDetails'] ? this.data['basicDetails'] : {}) : {};
    if (res.questionnaireTypeId)
      this.getQuestionnaireCategoryById(res.questionnaireTypeId);
    this.addQuestionnaireForm.patchValue({
      'questionnaireId': res.questionnaireId ? res.questionnaireId : '',
      'questionnaireName': res.questionnaireName ? res.questionnaireName : '',
      'questionnaireTypeId': res.questionnaireTypeId ? res.questionnaireTypeId : '',
      'questionnaireCategoryId': res.questionnaireCategoryId ? res.questionnaireCategoryId : '',
      'startDate': res.startDate ? this.customDatePipe.transform(res.startDate, 'MM-dd-yyyy') : '',
      'endDate': res.endDate ? this.customDatePipe.transform(res.endDate, 'MM-dd-yyyy') : '',
      'isActive': res.isActive,
      'isPublished': res.isPublished,
      'status': res.status
    });
  }

  checkTabChange(url?) {
    this.addQuestionnaireForm.markAllAsTouched();
    if (this.addQuestionnaireForm.valid) {
      if (url && url.includes("preview-questionnaire") && !(this.data && this.data.questions && this.data.questions.length)) {
        this.toastr.error('Select/Add at least one question from questions tab');
        return;
      }
      this.tabservice.setModelData(this.addQuestionnaireForm.value, 'basicDetails');
      return true;
    }
    else {
      return false;
    }
  }

  backToList() {
    this.router.navigate(['/user/questionnaire']);
  }

  next() {
    if (this.checkTabChange()) {
      if (!this.editFlag)
        this.router.navigate(['/user/questionnaire/add/questionnaire-instructions']);
      else
        this.router.navigate([`/user/questionnaire/edit/${this.editId}/questionnaire-instructions`]);
    }
  }

  canDeactivate(component, route, state, next) {
    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if (next.url.includes("/user/questionnaire/add") || next.url.includes("/user/questionnaire/edit") || next.url.includes("/login")) {
      return this.checkTabChange(next.url);
    }
    else {
      if (this.addQuestionnaireForm.touched)
        return this.alertService.confirm();
      else
        return true;
    }
  }
  async getQuestionnaireCategoryById(id) {
    this.spinner.show();
    this.lookupServ.getCommon(`/api/lookup/getQuestionnaireCategoryList/${id}`).subscribe(res => {
      if (res.status.success === true) {
        this.questionnaireCategories = res.response.questionnaireCategories;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide()
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
  }

}
