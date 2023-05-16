import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageScoringRoutingModule } from './image-scoring-routing.module';
import { ListImgScoreComponent } from './components/list-img-score/list-img-score.component';
import { SharedModule } from '../shared/shared.module';
import { AddImageScoreComponent } from './components/add-image-score/add-image-score.component';
import { ViewImgScoreComponent } from './components/view-img-score/view-img-score.component';


@NgModule({
  declarations: [ListImgScoreComponent, AddImageScoreComponent, ViewImgScoreComponent],
  imports: [
    CommonModule,
    ImageScoringRoutingModule,
    SharedModule
  ]
})
export class ImageScoringModule { }
