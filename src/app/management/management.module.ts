import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagementRoutingModule } from './management-routing.module';
import { OperationsComponent } from './components/operations/operations.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [OperationsComponent],
  imports: [
    CommonModule,
    ManagementRoutingModule,
    SharedModule
  ],
  exports:[
    SharedModule
  ]
})
export class ManagementModule { }
