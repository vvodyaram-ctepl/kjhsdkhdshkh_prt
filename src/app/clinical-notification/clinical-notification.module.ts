import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClinicalNotificationComponent } from './components/clinical-notification/clinical-notification.component';
import { ClinicalNotificationRoutingModule } from './clinical-notification-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ClinicalNotificationComponent],
  imports: [
    CommonModule,
    SharedModule,
    ClinicalNotificationRoutingModule,
    NgxSpinnerModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class ClinicalNotificationModule { }
