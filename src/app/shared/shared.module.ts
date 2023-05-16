import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DatatableModule } from '../../../projects/datatable/src/lib/datatable.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { TypeaheadModule } from 'projects/typeahead/src/lib/typeahead.module';
import { DatepickerModule } from 'projects/datepicker/src/lib/datepicker.module';
import { MutlitypeheadModule } from 'projects/multitypehead/src/lib/mutlitypehead.module';
import { TabsModule } from 'projects/Tabs/src/lib/components/tabs/tabs.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AppInterceptor } from '../services/util/interceptor';
import { CustomDateFormatPipe } from '../pipes/custom-date-format.pipe';
import { ValidationMessageComponent } from '../components/validation-message/validation-message.component';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';
import { SortablejsModule } from 'ngx-sortablejs';
import { AlertModalComponent, ConfirmState } from '../components/alert-modal/alert-modal.component';
import { AlertService } from '../components/alert-modal/alert.service';
import { DragDropDirective } from '../directives/drag-drop.directive';

import { FileUploadComponent } from '../components/file-upload/file-upload/file-upload.component';
import { PhoneMaskDirective } from '../directives/us-phone-mask.directive';
import { NgxMaskModule } from 'ngx-mask';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ReportsDatatableModule } from 'projects/reports-datatable/src/lib/datatable.module';
import { MultiSetComponent } from '../components/multi-set/multi-set.component';
import { MultiselectComponent } from '../components/multiselect/multiselect.component';
import { TextareaComponent } from '../components/textarea/textarea.component';

const modules = [
  DatatableModule,
  TypeaheadModule,
  DatepickerModule,
  MutlitypeheadModule,
  TabsModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  Ng2SearchPipeModule,
  SortablejsModule,

  NgxSliderModule
]
@NgModule({
  declarations: [CustomDateFormatPipe, ValidationMessageComponent,AlertModalComponent,MultiSetComponent,MultiselectComponent,TextareaComponent,FileUploadComponent,DragDropDirective,PhoneMaskDirective],
  imports: [
    CommonModule,
    ToastrModule.forRoot({
      maxOpened: 1
    }),
    NgxMaskModule.forRoot(),
    NgbModule,
    NgbNavModule,
    SortablejsModule.forRoot({ animation: 150 }),
    ...modules
  ],
  exports: [
    ...modules,
    ToastrModule,
    NgxMaskModule,
    DatatableModule,
    ReportsDatatableModule,
    TypeaheadModule,
    DatepickerModule,
    NgbModule,
    NgbNavModule,
    TabsModule,
    CustomDateFormatPipe,
    ValidationMessageComponent,
    FileUploadComponent,
    MultiSetComponent,
    MultiselectComponent,
    TextareaComponent,
    DragDropDirective,
    PhoneMaskDirective

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    },
    CanDeactivateGuard,
    DatePipe,
    CustomDateFormatPipe,
    AlertService,
    ConfirmState
  ]
})
export class SharedModule { }
