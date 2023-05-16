import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShipmentRoutingModule } from './shipment-routing.module';
import { ListShipmentComponent } from './components/list-shipment/list-shipment.component';
import { AddShipmentComponent } from './components/add-shipment/add-shipment.component';
import { ViewShipmentComponent } from './components/view-shipment/view-shipment.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [ListShipmentComponent, AddShipmentComponent, ViewShipmentComponent],
  imports: [
    CommonModule,
    ShipmentRoutingModule,
    SharedModule
  ]
})
export class ShipmentModule { }
