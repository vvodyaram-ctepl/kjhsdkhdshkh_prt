import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PointTrackingRoutingModule } from './point-tracking-routing.module';
import { PointTrackingComponent } from './components/point-tracking/point-tracking.component';
import { AddPointTrackerComponent } from './components/add-point-tracker/add-point-tracker.component';
import { SharedModule } from '../shared/shared.module';
import { ViewPointTrackerComponent } from './components/view-point-tracker/view-point-tracker.component';
import { CampaignDetailsComponent } from './components/campaign-details/campaign-details.component';
import { CampaignActivitiesComponent } from './components/campaign-activities/campaign-activities.component';


@NgModule({
  declarations: [PointTrackingComponent, AddPointTrackerComponent, ViewPointTrackerComponent, CampaignDetailsComponent, CampaignActivitiesComponent],
  imports: [
    CommonModule,
    PointTrackingRoutingModule,
    SharedModule
  ]
})
export class PointTrackingModule { }
