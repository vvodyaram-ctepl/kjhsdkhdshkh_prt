import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediaDownloadRoutingModule } from './media-download-routing.module';
import { LoadComponent } from './components/load/load.component';


@NgModule({
  declarations: [LoadComponent],
  imports: [
    CommonModule,
    MediaDownloadRoutingModule
  ]
})
export class MediaDownloadModule { }
