import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs.component';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [TabsComponent],
  imports: [
    CommonModule,
    NgbNavModule
  ],
  exports: [TabsComponent, RouterModule, NgbModule,NgbNavModule],
})
export class TabsModule { }
