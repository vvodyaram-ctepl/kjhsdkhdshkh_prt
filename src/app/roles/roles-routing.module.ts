import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesComponent } from './components/roles/roles.component';
import { AddRolesComponent } from './components/add-roles/add-roles.component';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';
import { ViewRolesComponent } from './components/view-roles/view-roles.component';

const routes: Routes = [
  { path: '', component: RolesComponent },
  { path: 'add', component: AddRolesComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'edit/:id', component: AddRolesComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'view/:id', component: ViewRolesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
