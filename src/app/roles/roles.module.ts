import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './components/roles/roles.component';
import { DatatableModule } from 'projects/datatable/src/lib/datatable.module';
import { AddRolesComponent } from './components/add-roles/add-roles.component';
import { SharedModule } from '../shared/shared.module';
import { ViewRolesComponent } from './components/view-roles/view-roles.component';

@NgModule({
  declarations: [RolesComponent, AddRolesComponent, ViewRolesComponent],
  imports: [
    CommonModule,
    RolesRoutingModule,
    DatatableModule,
    SharedModule
  ]
})
export class RolesModule { }
