import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatatableComponent } from './datatable.component';
import { SortableListComponent } from './sortable-list/sortable-list.component';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SortablejsModule } from 'ngx-sortablejs';
import { RouterModule } from '@angular/router';
import { Config } from './config';
import { ModuleWithProviders } from '@angular/core';
import { FilterPipe } from './filter.pipe';
import { NgxSpinnerModule } from "ngx-spinner";
import { DatepickerModule } from 'projects/datepicker/src/public_api';
import { TypeaheadModule } from 'projects/typeahead/src/public_api';


@NgModule({
  declarations: [    
		DatatableComponent,
    SortableListComponent,
    SanitizeHtmlPipe,
    FilterPipe
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,    
    SortablejsModule.forRoot({ animation: 150 }),
    RouterModule,
    NgxSpinnerModule,
    DatepickerModule,
    TypeaheadModule
  ],
  exports:[
    DatatableComponent,
    SortableListComponent,
    SanitizeHtmlPipe,
    FilterPipe
  ]
})
export class ReportsDatatableModule {
/*   static forRoot(config?: Config):ModuleWithProviders {
    console.log(config); // prints:  `{key: 'foobar'}`
     return {
      ngModule: DatatableModule,
      providers: [
        {provide: 'config', useValue: config} // If I hard code `useValue: {key: 'FooBar'}`, instead of using `config` it works... weird.
      ],
    }; 
  } */
 }
