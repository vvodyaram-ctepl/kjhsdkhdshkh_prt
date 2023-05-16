import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';
import { AddShipmentComponent } from './components/add-shipment/add-shipment.component';
import { ListShipmentComponent } from './components/list-shipment/list-shipment.component';
import { ViewShipmentComponent } from './components/view-shipment/view-shipment.component';

const routes: Routes = [
  { path: '', component: ListShipmentComponent },
  {
    path: 'add', component: AddShipmentComponent,canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'edit/:id', component: AddShipmentComponent,canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'view/:id', component: ViewShipmentComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipmentRoutingModule { }
