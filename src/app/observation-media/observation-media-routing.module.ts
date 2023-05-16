import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientObservationsViewComponent } from '../patient/components/patient-observations-view/patient-observations-view.component';

const routes: Routes = [
  {
    path: 'patient-observations-info',
    component: PatientObservationsViewComponent,
    data: { title: 'Observation Media' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObservationMediaRoutingModule { }
