import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsRoutingModule } from './assets-routing.module';
import { AssetsDashboardComponent } from './components/assets-dashboard/assets-dashboard.component';
import { AssetsManagementComponent } from './components/assets-management/assets-management.component';
import { DeviceTrackingReportComponent } from './components/device-tracking-report/device-tracking-report.component';
import { DeviceInformationComponent } from './components/device-information/device-information.component';
import { FirmwareVersionsComponent } from './components/firmware-versions/firmware-versions.component';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from '../shared/shared.module';
import { AddAssetComponent } from './components/assets-management/add-asset/add-asset.component';
import { AssetsListComponent } from './components/assets-management/assets-list/assets-list.component';
import { AssetsViewComponent } from './components/assets-management/assets-view/assets-view.component';
import { BulkUploadComponent } from './components/assets-management/bulk-upload/bulk-upload.component';


@NgModule({
  declarations: [AssetsDashboardComponent, AssetsManagementComponent, DeviceTrackingReportComponent, DeviceInformationComponent, FirmwareVersionsComponent, AddAssetComponent, AssetsListComponent, AssetsViewComponent, BulkUploadComponent],
  imports: [
    CommonModule,
    AssetsRoutingModule,
    SharedModule,
    ChartsModule
  ]
})
export class AssetsModule { }
