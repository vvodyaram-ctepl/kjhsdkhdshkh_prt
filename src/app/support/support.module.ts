import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportRoutingModule } from './support-routing.module';
import { SupportComponent } from './components/support/support.component';
import { DatatableModule } from 'projects/datatable/src/public-api';
import { AddSupportComponent } from './components/support/add-support/add-support.component';
import { ViewSupportComponent } from './components/support/view-support/view-support.component';
import { SharedModule } from '../shared/shared.module';
import { TicketDetailsComponent } from './components/support/view-customer-support/ticket-details/ticket-details.component';
import { ViewCustomerSupportComponent } from './components/support/view-customer-support/view-customer-support.component';
import { TicketHistoryComponent } from './components/support/view-customer-support/ticket-history/ticket-history.component';

@NgModule({
  declarations: [SupportComponent, AddSupportComponent, ViewSupportComponent, ViewCustomerSupportComponent, TicketDetailsComponent, TicketHistoryComponent],
  imports: [
    CommonModule,
    SupportRoutingModule,
    DatatableModule,
    SharedModule
  ]
})
export class SupportModule { }
