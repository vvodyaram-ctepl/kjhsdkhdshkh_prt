import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { QuesResponseService } from '../../ques-response.service';

@Component({
  selector: 'app-view-ques-reponse',
  templateUrl: './view-ques-reponse.component.html',
  styleUrls: ['./view-ques-reponse.component.scss']
})
export class ViewQuesReponseComponent implements OnInit {

  public questionnaireName: String;
  public petParentName: String;
  public petName: String;
  public study: String;
  public submittedOn: String;
  public questionnaireResponseList: any;
  questionnaireResponseId: any;
  questionnaireId: any;
  studyId: any;

  constructor(public router: Router,
    private spinner: NgxSpinnerService,
    private quesResponseService: QuesResponseService,
    private toastr: ToastrService,
    public customDatePipe: CustomDateFormatPipe,
    private activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.getViewData();
  }

  async getViewData() {

    await this.activatedRoute.params.subscribe(async params => {
      this.spinner.show();
      this.questionnaireResponseId = params.questionnaireResponseId;
      this.studyId = params.studyId;
      this.quesResponseService.getQuestionnaireView(`/api/questionnaire/getViewQuestionnaireResponse/${this.questionnaireResponseId}/${this.studyId}`).subscribe(res => {
          if (res.status.success === true) {
            let questionnaireDetails = res.response.questionnaireDetails;
            this.questionnaireResponseList = res.response.questionnaireResponseList;
            this.questionnaireId = questionnaireDetails.questionnaireId;
            this.questionnaireName = questionnaireDetails.questionnaireName
            this.petParentName = questionnaireDetails.petParentName
            this.petName = questionnaireDetails.petName
            this.study = questionnaireDetails.studyName
            this.submittedOn = this.customDatePipe.transform(questionnaireDetails.submittedDate, 'MM/dd/yyyy');
            this.spinner.hide();
          }
        });

    });
    // this.quesResponseService.getQuestionnaireVire();
  }

  back() {
    this.router.navigate([`/user/responses/list-study/${this.questionnaireId}/${this.questionnaireName}/${this.studyId}/${this.study}`]);
  }

  close() {
    this.router.navigate([`/user/responses`]);
  }

}
