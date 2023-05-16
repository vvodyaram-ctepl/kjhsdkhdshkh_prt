import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClinicalUsersRoutingModule } from './clinical-users-routing.module';
import { ListClinicUsersComponent } from './components/list-clinic-users/list-clinic-users.component';
import { ViewClinicUsersComponent } from './components/view-clinic-users/view-clinic-users.component';
import { SharedModule } from '../shared/shared.module';
import { AddNewUserComponent } from './components/add-new-user/add-new-user.component';
import { AddUserDetailsComponent } from './components/add-user-details/add-user-details.component';
import { AddAssociatedStudyComponent } from './components/add-associated-study/add-associated-study.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ViewAssociatedStudyComponent } from './components/view-associated-study/view-associated-study.component';


@NgModule({
  declarations: [ListClinicUsersComponent, ViewClinicUsersComponent, AddNewUserComponent, AddUserDetailsComponent, AddAssociatedStudyComponent, EditUserComponent, ViewAssociatedStudyComponent],
  imports: [
    CommonModule,
    SharedModule,
    ClinicalUsersRoutingModule,
    NgxSpinnerModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class ClinicalUsersModule { }
