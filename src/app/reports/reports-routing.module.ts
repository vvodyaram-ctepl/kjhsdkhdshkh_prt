import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';
import { AddNewReportComponent } from './components/add-new-report/add-new-report.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { ListReportsComponent } from './components/list-reports/list-reports.component';
import { PreludeReportComponent } from './components/prelude-report/prelude-report.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'manage-reports', pathMatch: 'full'
  },
  {
    path: 'manage-reports', children: [
      {
        path: '', component: ListReportsComponent
      },
      {
        path: 'add', component: AddNewReportComponent, canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'edit/:id', component: AddNewReportComponent, canDeactivate: [CanDeactivateGuard]
      }
    ]
  },
  {
    path: 'analytics/:reportGroupId', component: AnalyticsComponent
  },
  {
    path: 'prelude-report', component: PreludeReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
