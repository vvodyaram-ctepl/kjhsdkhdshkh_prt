import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListClinicUsersComponent } from './components/list-clinic-users/list-clinic-users.component';
import { ViewClinicUsersComponent } from './components/view-clinic-users/view-clinic-users.component';
import { ViewActivityComponent } from '../clinics/components/view-activity/view-activity.component';
import { AddNewUserComponent } from './components/add-new-user/add-new-user.component';
import { AddUserDetailsComponent } from './components/add-user-details/add-user-details.component';
import { AddAssociatedStudyComponent } from './components/add-associated-study/add-associated-study.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { ViewAssociatedStudyComponent } from './components/view-associated-study/view-associated-study.component';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';


const routes: Routes = [
  {path:'',component:ListClinicUsersComponent},
  {path:'add-new-user',component:AddNewUserComponent,
  children:[
    {
      path: "",
      redirectTo: "add-user-details",
      pathMatch: "full"
    },
    {
      path: "add-user-details",
      component: AddUserDetailsComponent,
      data: { title: "AddUserDetails" },
      canDeactivate: [CanDeactivateGuard]
    },
    {
      path: "add-associated-study",
      component: AddAssociatedStudyComponent,
      data: { title: "AddAssociatedStudy" },
      canDeactivate: [CanDeactivateGuard]
    }

  ]},
  {path:'edit-user/:id',component:EditUserComponent,
  children:[
    {
      path: "",
      redirectTo: "add-user-details",
      pathMatch: "full"
    },
    {
      path: "add-user-details",
      component: AddUserDetailsComponent,
      data: { title: "AddUserDetails" },
      canDeactivate: [CanDeactivateGuard]
    },
    {
      path: "add-associated-study",
      component: AddAssociatedStudyComponent,
      data: { title: "AddAssociatedStudy" },
      canDeactivate: [CanDeactivateGuard]
    }

  ]},
  {path:'view-clinic-users/:id',component:ViewClinicUsersComponent,
  children: [
    {
      path: "",
      redirectTo: "view-associated-study",
      pathMatch: "full"
    },
    {
      path: "view-associated-study",
      component: ViewAssociatedStudyComponent,
      data: { title: "associatedStudy" }
    },
    {
      path: "view-activity",
      component:ViewActivityComponent,
      data: { title: "activity" }
    }
  ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicalUsersRoutingModule { }
