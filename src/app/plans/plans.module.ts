import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlansRoutingModule } from './plans-routing.module';
import { PlansComponent } from './components/plans/plans.component';
import { SharedModule } from '../shared/shared.module';
import { AddPlansComponent } from './components/add-plans/add-plans.component';
import { ViewPlansComponent } from './components/view-plans/view-plans.component';
import { PlanDetailsComponent } from './components/view-plans/plan-details/plan-details.component';
import { StudyAssociationComponent } from './components/view-plans/study-association/study-association.component';
import { ActivitiesComponent } from './components/view-plans/activities/activities.component';


@NgModule({
  declarations: [PlansComponent, AddPlansComponent, ViewPlansComponent, PlanDetailsComponent, StudyAssociationComponent, ActivitiesComponent],
  imports: [
    CommonModule,
    PlansRoutingModule,
    SharedModule
  ]
})
export class PlansModule { }
