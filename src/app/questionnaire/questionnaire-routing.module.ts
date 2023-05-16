import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListQuestionnaireComponent } from './components/list-questionnaire/list-questionnaire.component';
import { AddQuestionnaireComponent } from './components/add-questionnaire/add-questionnaire.component';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';
import { CreateQuestionnaireComponent } from './components/create-questionnaire/create-questionnaire.component';
import { QuestionnaireInstructionsComponent } from './components/questionnaire-instructions/questionnaire-instructions.component';
import { PreviewQuestionnaireComponent } from './components/preview-questionnaire/preview-questionnaire.component';
import { AddQuestionsComponent } from './components/add-questions/add-questions.component';
import { ViewQuestionnaireComponent } from './components/view-questionnaire/view-questionnaire.component';
import { InstructionsViewComponent } from './components/view-questionnaire/instructions-view/instructions-view.component';
import { QuestionsViewComponent } from './components/view-questionnaire/questions-view/questions-view.component';

const routes: Routes = [
  { path: '', component: ListQuestionnaireComponent },
  {
    path: 'add', component: AddQuestionnaireComponent,
    children: [
      {
        path: "",
        redirectTo: "basic-details",
        pathMatch: "full"
      },
      {
        path: "basic-details",
        component: CreateQuestionnaireComponent,
        data: { title: "createQuestionnaire" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "questionnaire-instructions",
        component: QuestionnaireInstructionsComponent,
        data: { title: "Instructions" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "add-questions",
        component: AddQuestionsComponent,
        data: { title: "Preview" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "preview-questionnaire",
        component: PreviewQuestionnaireComponent,
        data: { title: "Preview" },
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  },
  {
    path: 'edit/:questionnaireId', component: AddQuestionnaireComponent,
    children: [
      {
        path: "",
        redirectTo: "basic-details",
        pathMatch: "full"
      },
      {
        path: "basic-details",
        component: CreateQuestionnaireComponent,
        data: { title: "createQuestionnaire" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "questionnaire-instructions",
        component: QuestionnaireInstructionsComponent,
        data: { title: "Instructions" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "add-questions",
        component: AddQuestionsComponent,
        data: { title: "Preview" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "preview-questionnaire",
        component: PreviewQuestionnaireComponent,
        data: { title: "Preview" },
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  },
  {
    path: 'view/:questionnaireId',
    component: ViewQuestionnaireComponent,
    children: [
      {
        path: "",
        redirectTo: "instructions",
        pathMatch: "full"
      },
      {
        path: "instructions",
        component: InstructionsViewComponent,
        data: { title: "Instructions" }
      },
      {
        path: "questions",
        component: QuestionsViewComponent,
        data: { title: "Questions" }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionnaireRoutingModule { }
