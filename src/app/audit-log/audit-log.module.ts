import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditComponent } from './components/audit/audit.component';
import { AuditLogRoutingModule } from './audit-log-routing.module';
import { DatatableModule } from 'projects/datatable/src/public-api';



@NgModule({
  declarations: [AuditComponent],
  imports: [
    CommonModule,
    AuditLogRoutingModule,
    DatatableModule
  ]
})
export class AuditLogModule { }
