import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetsDashboardComponent } from './components/assets-dashboard/assets-dashboard.component';
import { AssetsManagementComponent } from './components/assets-management/assets-management.component';
import { DeviceTrackingReportComponent } from './components/device-tracking-report/device-tracking-report.component';
import { DeviceInformationComponent } from './components/device-information/device-information.component';
import { FirmwareVersionsComponent } from './components/firmware-versions/firmware-versions.component';
import { AddAssetComponent } from './components/assets-management/add-asset/add-asset.component';
import { AssetsListComponent } from './components/assets-management/assets-list/assets-list.component';
import { AssetsViewComponent } from './components/assets-management/assets-view/assets-view.component';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';
import { BulkUploadComponent } from './components/assets-management/bulk-upload/bulk-upload.component';

const routes: Routes = [
  { path: 'dashboard', component: AssetsDashboardComponent },
  {
    path: 'management', component: AssetsManagementComponent,
    children: [
      {
        path: "",
        redirectTo: "list",
        pathMatch: "full"
      },
      {
        path: 'list',
        component: AssetsListComponent,
        data: { title: 'Asset Management' }
      },
      {
        path: 'add',
        component: AddAssetComponent, canDeactivate: [CanDeactivateGuard],
      },
      {
        path: 'edit/:prodId',
        component: AddAssetComponent, canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'view/:prodId',
        component: AssetsViewComponent
      },
      {
        path: 'bulk-upload',
        component: BulkUploadComponent
      }

    ]
  },
  { path: 'reports', component: DeviceTrackingReportComponent },
  { path: 'device-information', component: DeviceInformationComponent },
  { path: 'firmware-version', component: FirmwareVersionsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsRoutingModule { }
