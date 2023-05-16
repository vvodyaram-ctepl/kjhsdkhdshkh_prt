import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListPatientsComponent } from './components/list-patients/list-patients.component';
import { ViewPatientComponent } from './components/view-patient/view-patient.component';
import { AddNewPatientComponent } from './components/add-new-patient/add-new-patient.component';
import { PetInfoComponent } from './components/pet-info/pet-info.component';
import { PetParentInfoComponent } from './components/pet-parent-info/pet-parent-info.component';
import { PetReviewComponent } from './components/pet-review/pet-review.component';
import { ViewPatientTabsComponent } from './components/view-patient-tabs/view-patient-tabs.component';
import { PatientChartsComponent } from './components/patient-charts/patient-charts.component';
import { PatientObservationsComponent } from './components/patient-observations/patient-observations.component';
import { PatientDeviceDetailsComponent } from './components/patient-device-details/patient-device-details.component';
import { PatientClientInfoComponent } from './components/patient-client-info/patient-client-info.component';
import { PatientNotesComponent } from './components/patient-notes/patient-notes.component';
import { EditPatientComponent } from './components/edit-patient/edit-patient.component';
import { PetDeviceComponent } from './components/pet-device/pet-device.component';
import { PatientObservationsViewComponent } from './components/patient-observations-view/patient-observations-view.component';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';
import { PatientNotesViewComponent } from './components/patient-notes-view/patient-notes-view.component';
import { ViewCampaignPointsComponent } from './components/view-campaign-points/view-campaign-points.component';
import { PetStudyComponent } from './components/pet-study/pet-study.component';
import { ViewPetQuestionnaireComponent } from './components/view-pet-questionnaire/view-pet-questionnaire.component';
import { ViewPetQuesResponseComponent } from './components/view-pet-ques-response/view-pet-ques-response.component';
import { PetEatingComponent } from './components/pet-eating/pet-eating.component';
import { PetImgScoringComponent } from './components/pet-img-scoring/pet-img-scoring.component';
import { ActivityFactorComponent } from './components/activity-factor/activity-factor.component';

const routes: Routes = [
  { path: '', component: ListPatientsComponent },
  {
    path: 'view/:prodId/:studyId', component: ViewPatientComponent,
    children: [
      {
        path: "",
        redirectTo: "patient-client-info",
        pathMatch: "full"
      },
      {
        path: "patient-charts",
        component: PatientChartsComponent,
        data: { title: "patientCharts" }
      },
      {
        path: "patient-observations",
        component: PatientObservationsComponent,
        data: { title: "patientObservations" }
      },
      {
        path: "patient-device-details",
        component: PatientDeviceDetailsComponent,
        data: { title: "patientDeviceDetails" }
      },
      {
        path: "patient-client-info",
        component: PatientClientInfoComponent,
        data: { title: "patientClientInfo" }
      },
      {
        path: "patient-activity-factor",
        component: ActivityFactorComponent,
        data: { title: "patientActivityFactor" }
      },
      {
        path: "patient-notes",
        component: PatientNotesComponent,
        data: { title: "patientNotes" }
      },
      {
        path: "campaign-points",
        component: ViewCampaignPointsComponent,
        data: { title: "patientNotes" }
      },
      {
        path: "questionnaire",
        component: ViewPetQuestionnaireComponent,
        data: { title: "questionnaire" }
      },
      {
        path: "pet-eating",
        component: PetEatingComponent,
        data: { title: "petEating" }
      },
      {
        path: "pet-img-scoring",
        component: PetImgScoringComponent,
        data: { title: "petImgScoring" }
      }
    ]
  },
  {
    path: 'patient-observations-info/:prodId/:studyId',
    component: PatientObservationsViewComponent,
    data: { title: 'Observation Media' }
  },
  {
    path: 'pet-notes-info/:prodId/:studyId',
    component: PatientNotesViewComponent,
    data: { title: 'Pet Notes' }
  },
  {
    path: 'add-patient', component: AddNewPatientComponent,
    children: [
      {
        path: "",
        redirectTo: "pet-info",
        pathMatch: "full"
      },
      {
        path: "pet-info",
        component: PetInfoComponent,
        data: { title: "petInfo" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "pet-study",
        component: PetStudyComponent,
        data: { title: "petStudy" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "pet-device",
        component: PetDeviceComponent,
        data: { title: "petDevice" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "pet-parent-info",
        component: PetParentInfoComponent,
        data: { title: "petParentInfo" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "review",
        component: PetReviewComponent,
        data: { title: "review" },
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  },
  {
    path: 'edit-patient/:id', component: EditPatientComponent,
    children: [
      {
        path: "",
        redirectTo: "pet-info",
        pathMatch: "full"
      },
      {
        path: "pet-info",
        component: PetInfoComponent,
        data: { title: "petInfo" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "pet-study",
        component: PetStudyComponent,
        data: { title: "petStudy" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "pet-device",
        component: PetDeviceComponent,
        data: { title: "petDevice" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "pet-parent-info",
        component: PetParentInfoComponent,
        data: { title: "petParentInfo" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "review",
        component: PetReviewComponent,
        data: { title: "review" },
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  },
  {
    path: 'view-patient-tabs', component: ViewPatientTabsComponent
  },
  {
    path: 'view-pet-ques-response/:petId', component: ViewPetQuesResponseComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
