import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportMaterialRoutingModule } from './support-material-routing.module';
import { ListSupportMaterialComponent } from './components/list-support-material/list-support-material.component';
import { AddSupportMaterialComponent } from './components/add-support-material/add-support-material.component';
import { ViewSupportMaterialComponent } from './components/view-support-material/view-support-material.component';
import { SharedModule } from '../shared/shared.module';
import { DatatableModule } from 'projects/datatable/src/public-api';
import { EditSupportMaterialComponent } from './components/edit-support-material/edit-support-material.component';


@NgModule({
  declarations: [ListSupportMaterialComponent, AddSupportMaterialComponent, ViewSupportMaterialComponent, EditSupportMaterialComponent],
  imports: [
    CommonModule,
    SupportMaterialRoutingModule,
    DatatableModule,
    SharedModule
  ]
})
export class SupportMaterialModule { }
