import { NgModule } from '@angular/core';
import { MutlitypeheadComponent } from './mutlitypehead.component'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select'; 
import { HttpClientModule } from '@angular/common/http';
import { MutlitypeheadService } from './mutlitypehead.service';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    NgSelectModule, 
    NgbModule,
    FormsModule
  ],
  declarations: [MutlitypeheadComponent],
  providers:[MutlitypeheadService],
  exports: [MutlitypeheadComponent]
})
export class MutlitypeheadModule { }

