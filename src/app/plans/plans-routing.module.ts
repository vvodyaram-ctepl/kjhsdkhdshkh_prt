import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlansComponent } from './components/plans/plans.component';
import { AddPlansComponent } from './components/add-plans/add-plans.component';
import { PlanDetailsComponent } from './components/view-plans/plan-details/plan-details.component';
import { StudyAssociationComponent } from './components/view-plans/study-association/study-association.component';
import { ActivitiesComponent } from './components/view-plans/activities/activities.component';
import { ViewPlansComponent } from './components/view-plans/view-plans.component';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';

const routes: Routes = [
  { path: '', component: PlansComponent },
  { path: 'add-plans', component: AddPlansComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'edit/:prodId', component: AddPlansComponent, canDeactivate: [CanDeactivateGuard] },
  {
    path: 'view/:prodId', component: ViewPlansComponent,
    children: [
      {
        path: "",
        redirectTo: "study-association",
        pathMatch: "full"
      },
      // {
      //   path: "plan-details",
      //   component: PlanDetailsComponent,
      //   data: { title: "planDetails" }
      // },
      {
        path: "study-association",
        component: StudyAssociationComponent,
        data: { title: "studyAssociation" }
      },
      {
        path: "activities",
        component: ActivitiesComponent,
        data: { title: "activities" }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlansRoutingModule { }
