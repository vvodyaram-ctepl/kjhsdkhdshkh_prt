import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { MainComponent } from '../login/components/main/main.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [MainComponent,SidebarComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    NgxSpinnerModule
  ]
})
export class AuthModule { }
