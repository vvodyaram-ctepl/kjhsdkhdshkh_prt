import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupportComponent } from './components/support/support.component';
import { AddSupportComponent } from './components/support/add-support/add-support.component';
import { ViewSupportComponent } from './components/support/view-support/view-support.component';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';
import { TicketDetailsComponent } from './components/support/view-customer-support/ticket-details/ticket-details.component';
import { TicketHistoryComponent } from './components/support/view-customer-support/ticket-history/ticket-history.component';
import { ViewCustomerSupportComponent } from './components/support/view-customer-support/view-customer-support.component';

const routes: Routes = [
  { path: '', component: SupportComponent },
  { path: 'add', component: AddSupportComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'edit/:prodId', component: AddSupportComponent, canDeactivate: [CanDeactivateGuard] },
  {
    path: 'view/:prodId', component: ViewCustomerSupportComponent,
    children: [
      {
        path: "",
        redirectTo: "ticket-details",
        pathMatch: "full"
      },
      {
        path: "ticket-details",
        component: TicketDetailsComponent,
        data: { title: "Ticket Details" }
      },
      {
        path: "ticket-history",
        component: TicketHistoryComponent,
        data: { title: "Ticket History" }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportRoutingModule { }
