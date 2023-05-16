import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuesReponseListComponent } from './components/ques-reponse-list/ques-reponse-list.component';
import { QuesStudyResponseListComponent } from './components/ques-study-response-list/ques-study-response-list.component';
import { ViewQuesReponseComponent } from './components/view-ques-reponse/view-ques-reponse.component';

const routes: Routes = [
  { path: '', component: QuesReponseListComponent },
  { path: 'list-study/:questionnaireId/:questionnaireName/:studyId/:studyName', component: QuesStudyResponseListComponent },
  { path: 'view/:questionnaireResponseId/:studyId', component: ViewQuesReponseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionnaireResponseRoutingModule { }
