import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';
import { AddImageScoreComponent } from './components/add-image-score/add-image-score.component';
import { ListImgScoreComponent } from './components/list-img-score/list-img-score.component';
import { ViewImgScoreComponent } from './components/view-img-score/view-img-score.component';

const routes: Routes = [
  {
    path:'', component : ListImgScoreComponent
  },
  {
    path:'add', component : AddImageScoreComponent, canDeactivate: [CanDeactivateGuard]
  },
  { path: 'edit/:prodId', component: AddImageScoreComponent, canDeactivate: [CanDeactivateGuard] },
  {
    path: 'view/:prodId', component: ViewImgScoreComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageScoringRoutingModule { }
