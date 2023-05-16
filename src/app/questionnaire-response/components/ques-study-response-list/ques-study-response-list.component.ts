import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { QuesResponseService } from '../../ques-response.service';

@Component({
  selector: 'app-ques-study-response-list',
  templateUrl: './ques-study-response-list.component.html',
  styleUrls: ['./ques-study-response-list.component.scss']
})
export class QuesStudyResponseListComponent implements OnInit {

  headers: any;
  filterTypeArr: any[];
  studyName: String;
  questionnareName: String;
  questionnaireId: any;
  studyId: any;
  url: String;
  constructor(
    public router: Router,
    private quesResponseService: QuesResponseService,
    private toastr: ToastrService,
    public customDatePipe: CustomDateFormatPipe,
    private activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit() {
    await this.activatedRoute.params.subscribe(async params => {
      this.questionnaireId = params.questionnaireId;
      this.studyId = params.studyId;
      this.questionnareName = params.questionnaireName;
      this.studyName = params.studyName;
      this.url = `/api/questionnaire/getResponseByStudyList?questionnaireId=${this.questionnaireId
        }&studyId=${this.studyId
        }`;
      this.headers = [
        { key: "petParentName", label: "Pet Parent", checked: true, clickable: true },
        { key: "petName", label: "Pet Name", checked: true },
        { key: "sharedDate", label: "Shared Date", checked: true },
        { key: "submittedDate", label: "Submitted Date", checked: true },
        // { key: "static", label: "", checked: true, clickable: true, width: 80 }
      ];
      this.filterTypeArr =
        [
          {
            name: "Submitted Date Range",
            id: "dateType"
          }
        ];
    });
  }

  getNode($event) {
    console.log(' getNode ', $event);
    let action = $event.event.target.title;
    if (action === 'View') {
      this.router.navigate([`/user/responses/view/${$event.item.questionnaireResponseId}/${$event.item.studyId}`]);
    }
    if($event.header == 'petParentName'){
      this.router.navigate([`/user/responses/view/${$event.item.questionnaireResponseId}/${$event.item.studyId}`]);
    }
  }

  formatter($event) {
    $event.forEach(ele => {
      ele.submittedDate = this.customDatePipe.transform(ele.submittedDate, 'MM/dd/yyyy');
      ele.sharedDate = this.customDatePipe.transform(ele.sharedDate, 'MM/dd/yyyy');
      ele.static = `<div class="view-btn" title="View">
      <span title="View">View</span>
      </div>`
    });
    console.log($event);
  }
}
