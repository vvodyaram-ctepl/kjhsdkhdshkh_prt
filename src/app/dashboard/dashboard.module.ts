import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { FavouritesComponent } from './components/favourites/favourites.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [FavouritesComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
