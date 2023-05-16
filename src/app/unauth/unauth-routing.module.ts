import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../login/components/login/login.component';
import { AuthComponent } from '../login/components/auth/auth.component';
import { ForgotPasswordComponent } from '../login/components/forgot-password/forgot-password.component';
import { UpdatePasswordComponent } from '../login/components/update-password/update-password.component';

const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
      path: 'auth', component: AuthComponent, children:
          [
              { path: '', redirectTo: 'login', pathMatch: 'full' },
              { path: 'login', component: LoginComponent },
              { path: 'forgotPassword', component: ForgotPasswordComponent },
              { path: 'updatePassword', component: UpdatePasswordComponent }
          ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnauthRoutingModule { }
