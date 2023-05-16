import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-questionnaire',
  templateUrl: './add-questionnaire.component.html',
  styleUrls: ['./add-questionnaire.component.scss']
})
export class AddQuestionnaireComponent implements OnInit {

  editFlag: boolean = false;
  public flatTabs: any[];

  constructor(public router: Router) { }

  ngOnInit() {
    if (this.router.url.includes("/user/questionnaire/edit"))
      this.editFlag = true;
    this.flatTabs = [
      { tabId: 1, name: 'Basic Details', link: 'basic-details', property: 'createQuestionnaire' },
      { tabId: 2, name: 'Instructions', link: 'questionnaire-instructions', property: 'Instructions' },
      { tabId: 3, name: 'Questions', link: 'add-questions', property: 'addQuestions' },
      { tabId: 4, name: 'Preview', link: 'preview-questionnaire', property: 'previewQuestionnaire' }
    ];
  }

  public activateTab(activeTab) {
    this.flatTabs.forEach(flatTag => {
      if (flatTag.tabId == activeTab.tabId) {
        flatTag.active = true;
      } else {
        flatTag.active = false;
      }
    });
  }

}
