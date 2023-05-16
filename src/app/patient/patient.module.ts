import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRoutingModule } from './patient-routing.module';
import { ListPatientsComponent } from './components/list-patients/list-patients.component';
import { ViewPatientComponent } from './components/view-patient/view-patient.component';
import { AddNewPatientComponent } from './components/add-new-patient/add-new-patient.component';
import { SharedModule } from '../shared/shared.module';
import { DatatableModule } from 'projects/datatable/src/public-api';
import { PetInfoComponent } from './components/pet-info/pet-info.component';
import { PetParentInfoComponent } from './components/pet-parent-info/pet-parent-info.component';
import { PetReviewComponent } from './components/pet-review/pet-review.component';
import { PetStudyComponent } from './components/pet-study/pet-study.component';
import { ViewPatientTabsComponent } from './components/view-patient-tabs/view-patient-tabs.component';
import { ViewPatientCardsComponent } from './components/view-patient-cards/view-patient-cards.component';
import { PatientChartsComponent } from './components/patient-charts/patient-charts.component';
import { PatientObservationsComponent } from './components/patient-observations/patient-observations.component';
import { PatientDeviceDetailsComponent } from './components/patient-device-details/patient-device-details.component';
import { PatientClientInfoComponent } from './components/patient-client-info/patient-client-info.component';
import { PatientNotesComponent } from './components/patient-notes/patient-notes.component';
import { EditPatientComponent } from './components/edit-patient/edit-patient.component';
import { PetDeviceComponent } from './components/pet-device/pet-device.component';
import { ChartsModule } from 'ng2-charts';
import { PatientObservationsViewComponent } from './components/patient-observations-view/patient-observations-view.component';
import { PatientNotesViewComponent } from './components/patient-notes-view/patient-notes-view.component';
import { ViewCampaignPointsComponent } from './components/view-campaign-points/view-campaign-points.component';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { ViewPetQuestionnaireComponent } from './components/view-pet-questionnaire/view-pet-questionnaire.component';
import { ViewPetQuesResponseComponent } from './components/view-pet-ques-response/view-pet-ques-response.component';
import { PetEatingComponent } from './components/pet-eating/pet-eating.component';
import { PetImgScoringComponent } from './components/pet-img-scoring/pet-img-scoring.component';
import { ActivityFactorComponent } from './components/activity-factor/activity-factor.component';



@NgModule({
  declarations: [ListPatientsComponent, ViewPatientComponent, AddNewPatientComponent, PetInfoComponent, PetParentInfoComponent, PetReviewComponent, PetStudyComponent, ViewPatientTabsComponent, ViewPatientCardsComponent, PatientChartsComponent, PatientObservationsComponent, PatientDeviceDetailsComponent, PatientClientInfoComponent, PatientNotesComponent, EditPatientComponent, PetDeviceComponent, PatientObservationsViewComponent, PatientNotesViewComponent, ViewCampaignPointsComponent, ViewPetQuestionnaireComponent,ViewPetQuestionnaireComponent, ViewPetQuesResponseComponent, PetEatingComponent, PetImgScoringComponent, ActivityFactorComponent],
  imports: [
    CommonModule,
    PatientRoutingModule,
    SharedModule,
    DatatableModule,
    ChartsModule,
    VirtualScrollerModule,
  ]
})
export class PatientModule { }
