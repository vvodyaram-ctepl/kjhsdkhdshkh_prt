import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { LoginComponent } from './components/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { LoginRoutingModule } from '../login/login-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    // LoginComponent,
    // MainComponent
  // ForgotPasswordComponent,
  //   UpdatePasswordComponent,
  //   AuthComponent
],
  imports: [
    CommonModule,
    LoginRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class LoginModule { }
