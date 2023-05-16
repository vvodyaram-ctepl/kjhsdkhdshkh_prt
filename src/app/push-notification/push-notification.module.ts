import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PushNotificationRoutingModule } from './push-notification-routing.module';
import { ListPushNotificationComponent } from './components/list-push-notification/list-push-notification.component';
import { AddPushNotificationComponent } from './components/add-push-notification/add-push-notification.component';
import { SharedModule } from '../shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ViewPushComponent } from './components/view-push/view-push.component';


@NgModule({
  declarations: [ListPushNotificationComponent, AddPushNotificationComponent, ViewPushComponent],
  imports: [
    CommonModule,
    PushNotificationRoutingModule,
    SharedModule,
    NgxSpinnerModule
  ]
})
export class PushNotificationModule { }
