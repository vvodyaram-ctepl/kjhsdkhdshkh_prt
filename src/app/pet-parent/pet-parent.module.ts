import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PetParentRoutingModule } from './pet-parent-routing.module';
import { PetParentComponent } from './components/pet-parent/pet-parent.component';
import { SharedModule } from '../shared/shared.module';
import { DatatableModule } from 'projects/datatable/src/public-api';
import { AddPetParentComponent } from './components/add-pet-parent/add-pet-parent.component';
import { EditParentComponent } from './components/edit-parent/edit-parent.component';
import { PetParentDetailsComponent } from './components/pet-parent-details/pet-parent-details.component';
import { AssociatePetComponent } from './components/associate-pet/associate-pet.component';
import { ViewPetParentComponent } from './components/view-pet-parent/view-pet-parent.component';


@NgModule({
  declarations: [PetParentComponent, AddPetParentComponent, EditParentComponent, PetParentDetailsComponent, AssociatePetComponent, ViewPetParentComponent],
  imports: [
    CommonModule,
    PetParentRoutingModule,
    SharedModule,
    DatatableModule,
  ]
})
export class PetParentModule { }
