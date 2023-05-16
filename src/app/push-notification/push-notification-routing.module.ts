import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewPushNotificationComponent } from '../clinics/components/view-push-notification/view-push-notification.component';
import { AddPushNotificationComponent } from './components/add-push-notification/add-push-notification.component';
import { ListPushNotificationComponent } from './components/list-push-notification/list-push-notification.component';
import { ViewPushComponent } from './components/view-push/view-push.component';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';

const routes: Routes = [
  { path: '', component: ListPushNotificationComponent },
  {
    path: 'edit-push-notification/:id', component: AddPushNotificationComponent, canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'add-push-notification', component: AddPushNotificationComponent, canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'view-push-notification/:id', component: ViewPushNotificationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PushNotificationRoutingModule { }
