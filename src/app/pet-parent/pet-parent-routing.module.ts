import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PetParentComponent } from './components/pet-parent/pet-parent.component';
import { AddPetParentComponent } from './components/add-pet-parent/add-pet-parent.component';
import { PetParentDetailsComponent } from './components/pet-parent-details/pet-parent-details.component';
import { AssociatePetComponent } from './components/associate-pet/associate-pet.component';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';
import { ViewPetParentComponent } from './components/view-pet-parent/view-pet-parent.component';

const routes: Routes = [
  { path: '', component: PetParentComponent },
  {
    path: 'add-pet-parent', component: AddPetParentComponent,
    children: [
      {
        path: "",
        redirectTo: "pet-parent-details",
        pathMatch: "full"
      },
      {
        path: "pet-parent-details",
        component: PetParentDetailsComponent,
        data: { title: "BasicDetails" },
        canDeactivate: [CanDeactivateGuard]
      },
      // {
      //   path: "associate-pet",
      //   component: AssociatePetComponent,
      //   data: { title: "AssociatePet" },
      //   canDeactivate: [CanDeactivateGuard]
      // },
    ]
  },
  {
    path: 'edit-pet-parent/:id', component: AddPetParentComponent,
    children: [
      {
        path: "",
        redirectTo: "pet-parent-details",
        pathMatch: "full"
      },
      {
        path: "pet-parent-details",
        component: PetParentDetailsComponent,
        data: { title: "BasicDetails" },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "associate-pet",
        component: AssociatePetComponent,
        data: { title: "AssociatePet" },
        canDeactivate: [CanDeactivateGuard]
      },
    ]
  },
  {
    path: 'view-pet-parent/:id',
    component: ViewPetParentComponent,
    data: { title: "viewPetParent" },
    // children: [
    //   {
    //     path: "",
    //     redirectTo: "pet-parent-details",
    //     pathMatch: "full"
    //   },
    //   {
    //     path: "pet-parent-details",
    //     component: PetParentDetailsComponent,
    //     data: { title: "BasicDetails" }
    //   },
    //   {
    //     path: "associate-pet",
    //     component: AssociatePetComponent,
    //     data: { title: "AssociatePet" }
    //   },
    // ]
  }

]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PetParentRoutingModule { }
