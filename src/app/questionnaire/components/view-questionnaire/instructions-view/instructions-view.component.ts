import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/util/lookup.service';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { QuestionnaireService } from 'src/app/questionnaire/questionnaire.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-instructions-view',
  templateUrl: './instructions-view.component.html',
  styleUrls: ['./instructions-view.component.scss']
})
export class InstructionsViewComponent implements OnInit {
  questionnaireId: any;
  public data = {
    instructions: []
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private questionnaireService: QuestionnaireService,
    private userDataService: UserDataService,
    private lookupService: LookupService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      let str = this.router.url;
      this.questionnaireId = str.split("view/")[1].split("/")[0];
      this.spinner.show();
      this.questionnaireService.getQuestionnaireById(`/api/questionnaire/${this.questionnaireId}`).subscribe(res => {
        if (res.status.success === true) {
          this.data = res.response.questionnaire;
          this.spinner.hide();
        }
        else {
          this.toastr.error(res.errors[0].message);
          this.spinner.hide();
        }
      },
        err => {
          this.errorMsg(err);
        }
      );
    });
  }

  errorMsg(err) {
    if (err.status == 500) {
      this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      this.spinner.hide();
    }
    else {
      this.toastr.error(err.error.errors[0] ?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      this.spinner.hide();
    }
  }

  next() {
    this.router.navigate([`/user/questionnaire/view/${this.questionnaireId}/questions`]);
  }
  back() {
    this.router.navigate(['/user/questionnaire']);
  }
}
