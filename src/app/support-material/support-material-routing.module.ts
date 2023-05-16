import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddSupportMaterialComponent } from './components/add-support-material/add-support-material.component';
import { EditSupportMaterialComponent } from './components/edit-support-material/edit-support-material.component';
import { ListSupportMaterialComponent } from './components/list-support-material/list-support-material.component';
import { ViewSupportMaterialComponent } from './components/view-support-material/view-support-material.component';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';

const routes: Routes = [
  { path: '', component: ListSupportMaterialComponent },
  { path: 'add', component: AddSupportMaterialComponent ,canDeactivate: [CanDeactivateGuard] },
  { path: 'edit/:id', component: EditSupportMaterialComponent,canDeactivate: [CanDeactivateGuard]  },
  { path: 'view/:type/:id', component: ViewSupportMaterialComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportMaterialRoutingModule { }
