import { Component, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from 'src/app/components/alert-modal/alert.service';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { QuestionnaireService } from '../../questionnaire.service';
import { Options } from 'sortablejs';

@Component({
  selector: 'app-preview-questionnaire',
  templateUrl: './preview-questionnaire.component.html',
  styleUrls: ['./preview-questionnaire.component.scss', '../../styles/custom-slider.scss']
})
export class PreviewQuestionnaireComponent implements OnInit {

  data: any;
  editFlag: boolean = false;
  editId: any;
  saved: boolean = false;
  questionOptions: Options;
  instructionOptions: Options;

  constructor(
    private router: Router,
    private tabservice: TabserviceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private questionnaireService: QuestionnaireService,
    private customDatePipe: CustomDateFormatPipe,
    private alertService: AlertService
  ) {
    this.instructionOptions = {
      onUpdate: (event: any) => {
        this.data.instructions.forEach((inst, i) => {
          this.data.instructions[i].isUpdated = true;
        });
      }
    };
    this.questionOptions = {
      onUpdate: (event: any) => {
        this.data.questions.forEach((ques, i) => {
          this.data.questions[i].isUpdated = true;
        });
      }
    };
  }

  ngOnInit(): void {
    this.data = this.tabservice.getModelData();
    if (this.router.url.includes("/user/questionnaire/edit")) {
      this.editFlag = true;
      this.editId = this.router.url.split('edit/')[1].split('/')[0];
    }
    if (!this.editFlag) {
      if (!this.data || !this.data.basicDetails) {
        this.router.navigate(['/user/questionnaire/add/basic-details']);
        return;
      }
      else if (!this.data.questions.length) {
        this.router.navigate(['/user/questionnaire/add/add-questions']);
        return;
      }
    }
    else {
      if (!this.data)
        this.router.navigate([`/user/questionnaire/edit/${this.editId}/basic-details`]);
      return;
    }
  }

  addQuestionnaire() {
    this.spinner.show();

    let finalObj = {
      questionnaire: {
        ...this.data.basicDetails,
        instructions: this.data.instructions,
        questions: this.data.questions
      }
    }

    finalObj.questionnaire.startDate = this.customDatePipe.transform(finalObj.questionnaire.startDate, 'yyyy-MM-dd');
    finalObj.questionnaire.endDate = this.customDatePipe.transform(finalObj.questionnaire.endDate, 'yyyy-MM-dd');

    if (!this.editFlag) {
      this.questionnaireService.addQuestionnaire('/api/questionnaire', finalObj).subscribe(res => {
        if (res.status.success === true) {
          this.saved = true;
          this.toastr.success('Questionnaire added successfully!');
          this.router.navigate(['/user/questionnaire']);
          this.spinner.hide();
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
      this.questionnaireService.updateQuestionnaire('/api/questionnaire', finalObj).subscribe(res => {
        if (res.status.success === true) {
          this.saved = true;
          this.toastr.success('Questionnaire updated successfully!');
          this.router.navigate(['/user/questionnaire']);
          this.spinner.hide();
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
  }

  publish() {
    this.data.basicDetails.isPublished = true;
    this.addQuestionnaire();
  }

  getSliderOptions(options) {
    options.showTicks = true;
    options.disabled = true;
    options.getLegend = (value: number): string => {
      return value != options.ceil ? '' + value : '';
    }
    return options;
  }

  back() {
    if (!this.editFlag)
      this.router.navigate(['/user/questionnaire/add/add-questions']);
    else
      this.router.navigate([`/user/questionnaire/edit/${this.editId}/add-questions`]);
  }

  canDeactivate(component, route, state, next) {
    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if (next.url.includes("/user/questionnaire/add") || next.url.includes("/user/questionnaire/edit") || this.saved || next.url.includes("/login")) {
      return true;
    }
    else {
      return this.alertService.confirm();
    }
  }
}