import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PointTrackingComponent } from './components/point-tracking/point-tracking.component';
import { AddPointTrackerComponent } from './components/add-point-tracker/add-point-tracker.component';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';
import { ViewPointTrackerComponent } from './components/view-point-tracker/view-point-tracker.component';
import { CampaignDetailsComponent } from './components/campaign-details/campaign-details.component';
import { CampaignActivitiesComponent } from './components/campaign-activities/campaign-activities.component';

const routes: Routes = [
  { path: '', component: PointTrackingComponent },
  { path: 'add', component: AddPointTrackerComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'edit/:id', component: AddPointTrackerComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'view/:id', component: ViewPointTrackerComponent,
  children: [
    {
      path: "",
      redirectTo: "campaign-details",
      pathMatch: "full"
    },
    {
      path: "campaign-details",
      component: CampaignDetailsComponent,
      data: { title: "CampaignDetailsComponent" },
    },
    {
      path: "campaign-activities",
      component: CampaignActivitiesComponent,
      data: { title: "CampaignActivitiesComponent" },
    }
   ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PointTrackingRoutingModule { }
