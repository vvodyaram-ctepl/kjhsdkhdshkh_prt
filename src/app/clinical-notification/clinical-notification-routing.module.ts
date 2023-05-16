import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';
import { ClinicalNotificationModule } from './clinical-notification.module';
import { ClinicalNotificationComponent } from './components/clinical-notification/clinical-notification.component';


const routes: Routes = [
  {path:'', component:ClinicalNotificationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicalNotificationRoutingModule { }
