import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { QuesResponseService } from 'src/app/questionnaire-response/ques-response.service';

@Component({
  selector: 'app-view-pet-ques-response',
  templateUrl: './view-pet-ques-response.component.html',
  styleUrls: ['./view-pet-ques-response.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewPetQuesResponseComponent implements OnInit {

  headers: any;
  filterTypeArr: any[];
  url: string;
  petId: any;
  petName: any;
  reportName="Pet Questionnaire Response";
  constructor(
    public router: Router,
    private quesResponseService: QuesResponseService,
    public customDatePipe: CustomDateFormatPipe,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) { }

 async ngOnInit() {
    await this.activatedRoute.params.subscribe(async params => {
      this.petId = params.petId;
      this.url = `/api/questionnaire/getQuestionnaireResponseByPet?petId=${this.petId
      }`;
    this.headers = [
      
      // { key: "petName", label: "Pet Name", checked: true },
      { key: "studyNames", label: "Study", checked: true ,width:150,cellWidth: 30},
      { key: "questionnaireName", label: "Questionnaire Name", checked: true ,width:180,cellWidth: 30},
      { key: "questionName", label: "Question", checked: true ,width:200},
      { key: "questionType", label: "Question Type", checked: true },
      { key: "answerOpts", label: " Options", checked: true,width:200},
      { key: "answer", label: "Answer", checked: true },
      { key: "submittedOn", label: "Submitted On", checked: true },
      // { key: "static", label: "", checked: true, clickable: true, width: 130 }
    ];
    this.filterTypeArr =
      [
        {
          name: "Questionnaire",
          id: "petQuestionnaire"
        },
        {
          name: "Attempted Between",
          id: "dateType"
        }
      ];
    
    });
  }

  getNode($event) {
    console.log(' getNode ', $event);
    let questionnaireId = $event.item.questionnaireId;
    let questionnaireName = $event.item.questionnaireName;
    let studyId = $event.item.studyId;
    let studyName = $event.item.study;
    let action = $event.event.target.title;
    if (action === 'View Response') {
      this.router.navigate([`/user/responses/list-study/${questionnaireId}/${questionnaireName}/${studyId}/${studyName}`]);
    }
    if ($event.header === 'study') {
      this.router.navigate([`/user/responses/list-study/${questionnaireId}/${questionnaireName}/${studyId}/${studyName}`]);
    }
  }

  formatter($event) {
    $event.forEach(ele => {
      this.petName = ele.petName
      // ele.submittedDate = this.customDatePipe.transform(ele.submittedDate, 'MM/dd/yyyy');
      // ele.endDate = this.customDatePipe.transform(ele.endDate, 'MM/dd/yyyy');
      // ele.startDate = this.customDatePipe.transform(ele.startDate, 'MM/dd/yyyy');
      ele.static = `<div class="view-btn" title="View Response">
      <span title="View Response">View Response</span>
      </div>`
    });
    console.log($event);
    this.reportName = 'Pet Questionnaire Response: ' + this.petName
  }

}
