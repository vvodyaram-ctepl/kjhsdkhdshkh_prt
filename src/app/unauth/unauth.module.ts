import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnauthRoutingModule } from './unauth-routing.module';
import { LoginComponent } from '../login/components/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { ForgotPasswordComponent } from '../login/components/forgot-password/forgot-password.component';
import { UpdatePasswordComponent } from '../login/components/update-password/update-password.component';
import { AuthComponent } from '../login/components/auth/auth.component';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [AuthComponent,LoginComponent,ForgotPasswordComponent,UpdatePasswordComponent],
  imports: [
    CommonModule,
    UnauthRoutingModule,
    SharedModule,
    NgxSpinnerModule
  ]
})
export class UnauthModule { }
