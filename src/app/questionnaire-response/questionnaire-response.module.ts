import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionnaireResponseRoutingModule } from './questionnaire-response-routing.module';
import { QuesReponseListComponent } from './components/ques-reponse-list/ques-reponse-list.component';
import { QuesStudyResponseListComponent } from './components/ques-study-response-list/ques-study-response-list.component';
import { ViewQuesReponseComponent } from './components/view-ques-reponse/view-ques-reponse.component';
import { DatatableModule } from 'projects/datatable/src/public-api';
import { ReportsDatatableModule } from 'projects/reports-datatable/src/public-api';


@NgModule({
  declarations: [QuesReponseListComponent, QuesStudyResponseListComponent, ViewQuesReponseComponent],
  imports: [
    CommonModule,
    QuestionnaireResponseRoutingModule,
    DatatableModule,
    ReportsDatatableModule
  ]
})
export class QuestionnaireResponseModule { }
