import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { AddNewReportComponent } from './components/add-new-report/add-new-report.component';
import { ListReportsComponent } from './components/list-reports/list-reports.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { SharedModule } from '../shared/shared.module';
import { PreludeReportComponent } from './components/prelude-report/prelude-report.component';


@NgModule({
  declarations: [AddNewReportComponent, ListReportsComponent, AnalyticsComponent, PreludeReportComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
