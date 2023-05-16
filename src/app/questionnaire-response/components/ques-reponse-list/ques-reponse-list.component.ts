import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { QuesResponseService } from '../../ques-response.service';

@Component({
  selector: 'app-ques-reponse-list',
  templateUrl: './ques-reponse-list.component.html',
  styleUrls: ['./ques-reponse-list.component.scss']
})
export class QuesReponseListComponent implements OnInit {

  headers: any;
  filterTypeArr: any[];
  constructor(
    public router: Router,
    private quesResponseService: QuesResponseService,
    public customDatePipe: CustomDateFormatPipe,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.headers = [
      { key: "study", label: "Study", checked: true, clickable: true, sortable : true },
      { key: "questionnaireName", label: "Questionnaire Name", checked: true, sortable : true },
      { key: "startDate", label: "Start Date", checked: true, sortable : true },
      { key: "endDate", label: "Due by Date", checked: true, sortable : true },
      { key: "completionPercentage", label: "% Completion", checked: true },
      // { key: "static", label: "", checked: true, clickable: true, width: 130 }
    ];
    this.filterTypeArr =
      [
        {
          name: "Questionnaire Type",
          id: "questionnaireType"
        },
        {
          name: "Study",
          id: "Study"
        },
        {
          name: "Date Range",
          id: "dateType"
        }
      ];
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
      this.router.navigate([`/user/responses/list-study/${questionnaireId}/${questionnaireName}/${studyId}/${studyName.replace('N/A','NA')}`]);
    }
  }

  formatter($event) {
    $event.forEach(ele => {
      ele.submittedDate = this.customDatePipe.transform(ele.submittedDate, 'MM/dd/yyyy');
      ele.endDate = this.customDatePipe.transform(ele.endDate, 'MM/dd/yyyy');
      ele.startDate = this.customDatePipe.transform(ele.startDate, 'MM/dd/yyyy');
      ele.static = `<div class="view-btn" title="View Response">
      <span title="View Response">View Response</span>
      </div>`
    });
    console.log($event);
  }
}
