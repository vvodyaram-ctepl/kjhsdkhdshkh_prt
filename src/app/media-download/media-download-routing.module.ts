import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoadComponent } from './components/load/load.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'load', pathMatch: 'full'
  },
  {
    path: 'load', children: [
      {
        path: '', component: LoadComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediaDownloadRoutingModule { }