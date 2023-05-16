import { NgModule } from '@angular/core';
import { ValidationMessageComponent } from './validation-message.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ValidationMessageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [ValidationMessageComponent]
})
export class ValidationMessageModule { }
