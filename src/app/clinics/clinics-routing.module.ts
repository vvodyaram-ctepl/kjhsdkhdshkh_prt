import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListClinicComponent } from './components/list-clinic/list-clinic.component';
import { ViewClinicComponent } from './components/view-clinic/view-clinic.component';
import { AddNewClinicComponent } from './components/add-new-clinic/add-new-clinic.component';
import { ClinicalNotificationsComponent } from './components/clinical-notifications/clinical-notifications.component';
import { BasicDetailsComponent } from './components/basic-details/basic-details.component';
import { AddContactsComponent } from './components/add-contacts/add-contacts.component';
import { AddPlansComponent } from './components/add-plans/add-plans.component';
import { AddSubClinicsComponent } from './components/add-sub-clinics/add-sub-clinics.component';
import { AddNotesComponent } from './components/add-notes/add-notes.component';
import { ViewPlansComponent } from './components/view-plans/view-plans.component';
import { ViewActivityComponent } from './components/view-activity/view-activity.component';
import { EditClinicComponent } from './components/edit-clinic/edit-clinic.component';
import { MobileAppConfigComponent } from './components/mobile-app-config/mobile-app-config.component';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';
import { ViewAssociatedPetsComponent } from './components/view-associated-pets/view-associated-pets.component';
import { ViewNotesComponent } from './components/view-notes/view-notes.component';
import { QuestionnaireComponent } from './components/questionnaire/questionnaire.component';
import { ViewStudyQuestionnaireComponent } from './components/view-study-questionnaire/view-study-questionnaire.component';
import { PreludeConfigComponent } from './components/prelude-config/prelude-config.component';
import { ViewPreludeConfigComponent } from './components/view-prelude-config/view-prelude-config.component';
import { PushNotificationStudyComponent } from './components/push-notification-study/push-notification-study.component';
import { ViewPushComponent } from '../push-notification/components/view-push/view-push.component';
import { StudyImageScoringComponent } from './components/study-image-scoring/study-image-scoring.component';
import { ViewStudyImageScoringComponent } from './components/view-study-image-scoring/view-study-image-scoring.component';
import { ActivityFactorComponent } from './components/activity-factor/activity-factor.component';
import { ViewActivityFactorComponent } from './components/view-activity-factor/view-activity-factor.component';

const routes: Routes = [
  { path: '', component: ListClinicComponent },
  {
    path: 'edit-clinic/:id', component: EditClinicComponent,
    children: [
      {
        path: "",
        redirectTo: "basic-details",
        pathMatch: "full"
      },
      {
        path: "basic-details",
        component: BasicDetailsComponent,
        data: { title: "addNewClinic" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "add-plans",
        component: AddPlansComponent,
        data: { title: "addNewClinic" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "view-notes",
        component: ViewNotesComponent,
        data: { title: "viewNotes" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "mobile-app-config",
        component: MobileAppConfigComponent,
        data: { title: "mobileApp" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "push-notification-study",
        component: PushNotificationStudyComponent,
        data: { title: "pushNotificationStudy" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "study-image-scoring",
        component: StudyImageScoringComponent,
        data: { title: "studyImageScoring" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "questionnaire",
        component: QuestionnaireComponent,
        data: { title: "questionnaire" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "activity-factor",
        component: ActivityFactorComponent,
        data: { title: "Activity Factor" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "prelude-config",
        component: PreludeConfigComponent,
        data: { title: "Prelude Config" },
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  },
  {
    path: 'add-new-clinic', component: AddNewClinicComponent,
    children: [
      {
        path: "",
        redirectTo: "basic-details",
        pathMatch: "full"
      },
      {
        path: "basic-details",
        component: BasicDetailsComponent,
        data: { title: "addNewClinic" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "add-plans",
        component: AddPlansComponent,
        data: { title: "addNewClinic" },
        canDeactivate: [CanDeactivateGuard]
      },
      // {
      //   path: "add-sub-clinics",
      //   component: AddSubClinicsComponent,
      //   data: { title: "addNewClinic" }
      // },
      // {
      //   path: "add-contacts",
      //   component: AddContactsComponent,
      //   data: { title: "addNewClinic" }
      // },
      {
        path: "add-notes",
        component: AddNotesComponent,
        data: { title: "addNewClinic" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "mobile-app-config",
        component: MobileAppConfigComponent,
        data: { title: "mobileApp" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "push-notification-study",
        component: PushNotificationStudyComponent,
        data: { title: "pushNotificationStudy" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "study-image-scoring",
        component: StudyImageScoringComponent,
        data: { title: "studyImageScoring" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "questionnaire",
        component: QuestionnaireComponent,
        data: { title: "questionnaire" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "prelude-config",
        component: PreludeConfigComponent,
        data: { title: "Prelude Config" },
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  },
  {
    path: 'view-clinic/:id', component: ViewClinicComponent,
    children: [
      {
        path: "",
        redirectTo: "view-plans",
        pathMatch: "full"
      },
      {
        path: "view-plans",
        component: ViewPlansComponent,
        data: { title: "viewPlans" }
      },
      {
        path: "view-associated-pets",
        component: ViewAssociatedPetsComponent,
        data: { title: "viewAssociatedPets" }
      },
      {
        path: "view-notes",
        component: ViewNotesComponent,
        data: { title: "viewNotes" }
      },
      {
        path: "view-activity",
        component: ViewActivityComponent,
        data: { title: "viewActivity" }
      },
      {
        path: "view-activity-factor",
        component: ViewActivityFactorComponent,
        data: { title: "viewActivityFactor" }
      },
      {
        path: "view-prelude-config",
        component: ViewPreludeConfigComponent,
        data: { title: "viewPreludeConfig" }
      },
      {
        path: "mobile-app-config",
        component: MobileAppConfigComponent,
        data: { title: "mobileApp" }
      },
      {
        path: "view-push-notification",
        component: ViewPushComponent,
        data: { title: "pushNotificationStudy" }
      },
      {
        path: "view-study-image-scoring",
        component: ViewStudyImageScoringComponent,
        data: { title: "viewStudyImageScoring" }
      },
      {
        path: "view-questionnaire",
        component: ViewStudyQuestionnaireComponent,
        data: { title: "questionnaire" }
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicsRoutingModule { }
