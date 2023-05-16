import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionnaireRoutingModule } from './questionnaire-routing.module';
import { ListQuestionnaireComponent } from './components/list-questionnaire/list-questionnaire.component';
import { AddQuestionnaireComponent } from './components/add-questionnaire/add-questionnaire.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../shared/shared.module';
import { QuestionnaireInstructionsComponent } from './components/questionnaire-instructions/questionnaire-instructions.component';
import { AddQuestionsComponent } from './components/add-questions/add-questions.component';
import { PreviewQuestionnaireComponent } from './components/preview-questionnaire/preview-questionnaire.component';
import { CreateQuestionnaireComponent } from './components/create-questionnaire/create-questionnaire.component';
import { ViewQuestionnaireComponent } from './components/view-questionnaire/view-questionnaire.component';
import { InstructionsViewComponent } from './components/view-questionnaire/instructions-view/instructions-view.component';
import { QuestionsViewComponent } from './components/view-questionnaire/questions-view/questions-view.component';


@NgModule({
  declarations: [ListQuestionnaireComponent, AddQuestionnaireComponent, CreateQuestionnaireComponent,QuestionnaireInstructionsComponent, AddQuestionsComponent, PreviewQuestionnaireComponent, ViewQuestionnaireComponent, InstructionsViewComponent, QuestionsViewComponent],
  imports: [
    CommonModule,
    QuestionnaireRoutingModule,
    SharedModule,
    NgxSpinnerModule
  ]
})
export class QuestionnaireModule { }
