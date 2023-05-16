import { Component, OnInit, Input, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, debounceTime, switchMap } from 'rxjs/operators';
import { ChangeDetectorRef, ViewEncapsulation, Output, forwardRef, Optional, Host, SkipSelf } from '@angular/core';
import { NG_VALUE_ACCESSOR, AbstractControl, NG_VALIDATORS, ControlContainer, ControlValueAccessor } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { MutlitypeheadService } from './mutlitypehead.service';

const noop = () => {
};

export class validateValue {
  validate(control: AbstractControl): { [validator: string]: any } {
    if (!control.value) {
      return null;
    }
    const value = control.value.toString().trim;
    if (value) {
      return null;
    }
    return { required: true };
  }
}
@Component({
  selector: 'multi-typeahead',
 templateUrl: './mutlitypehead.component.html',
  styleUrls: ['./mutlitypehead.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: NG_VALIDATORS,
    useValue: new validateValue,
    multi: true
  },
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MutlitypeheadComponent),
    multi: true
  }]
})
export class MutlitypeheadComponent implements ControlValueAccessor  {
  @Input() formControlName: string;
  model: any;
  innerValue: any;
  githubAccount: any;
  items: any;
  showMaxBadgesMin: any;
  showBadge: any;
  typeahead = new EventEmitter<string>();
  @Input() matcher: string;
  @Input() data: any;
  @Input() placeholder: string;
  @Input() url: string;
  @Input() ngModel: any;
  @Input() display: string;
  @Input() showMaxBadges: any;
  @Input() disabled: any;
  @Output() selectedItem = new EventEmitter();
  @Output() onClear = new EventEmitter();
  @Output() formatter = new EventEmitter();
  @Output() pastedContent = new EventEmitter();
  @Input() showCopyIcon:boolean;
  @Input() copyDisable:boolean;

  constructor(
    private service:MutlitypeheadService,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    @Optional() @Host() @SkipSelf()
    private controlContainer: ControlContainer,
    private toastr: ToastrService
  ) {
    // this.typeahead
    //   .pipe(
    //   debounceTime(200),
    //   switchMap(term => this.loadData(term))
    //   )
    //   .subscribe(items => {
    //     this.items = Array.isArray(items) ? items : [items];
    //     // console.log("thiss.items",this.items);
    //     this.formatter.emit(this.items);
    //     this.cd.markForCheck();
    //   }, (err) => {
    //     console.log('error', err);
    //     this.items = [];
    //     this.cd.markForCheck();
    //   });
     this.initFunc();
  }


  ngOnInit() {

    if (!this.showMaxBadges) {
      this.showMaxBadges = 1;
    }
    this.controlContainer && this.controlContainer.valueChanges.subscribe(e => {
      if (!this.controlContainer.control.get(this.formControlName)?.value) {
        // console.log(this.controlContainer.control.get(this.formControlName).value);
        this.model = '';
        this.ngModel = '';
        this.innerValue = '';
        return;
      }
      if (this.controlContainer.control.get(this.formControlName)?.value) {
        this.ngModel = this.controlContainer.control.get(this.formControlName).value;
        this.model = this.ngModel;
        this.innerValue = this.model;
      }
    });
    this.model = this.ngModel;
    this.innerValue = this.model;
    this.onChangeCallback(this.model);

  }

   initFunc() {
    this.typeahead
      .pipe(
      debounceTime(200),
      switchMap(term => this.loadData(term))
      )
      .subscribe(items => {
        this.items = Array.isArray(items) ? items : [items];
        // console.log("thiss.items",this.items);
        this.formatter.emit(this.items);
        this.cd.markForCheck();
      }, (err) => {
        console.log('error', err);
        this.items = [];
        this.cd.markForCheck();
      });
  }

  myFunction(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    console.log("pastedText",pastedText);
    this.pastedContent.emit(pastedText);
    console.log("cccccc",this.controlContainer.control.get(this.formControlName).value);
    console.log("innervalue", this.innerValue);
  this.items = this.innerValue;
  event.preventDefault();
  event.stopPropagation();
    
  }

  ngOnChanges() {
    if (this.data) {
      this.items = this.data;
      // console.log("thiss.items",this.items);
    }
    if (this.controlContainer && this.formControlName && !this.controlContainer.control.get(this.formControlName).value) {
      // console.log(this.controlContainer.control.get(this.formControlName).value);
      this.model = '';
      this.ngModel = '';
      this.innerValue = '';
      return;
    }
    if (this.controlContainer && this.formControlName && this.controlContainer.control.get(this.formControlName).value) {
      this.ngModel = this.controlContainer.control.get(this.formControlName).value;
      this.model = this.ngModel;
      this.innerValue = this.model;
    }
    if (!this.showMaxBadges) {
      this.showMaxBadges = 1;
    }
    this.model = this.ngModel;
    this.innerValue = this.model;
    this.onChangeCallback(this.model);
    if (!this.model) {
      this.onClear.emit(this.model);
    }
  }
  loadData(term: string): Observable<Object> {
    /* return this.http.get<any>(this.url+`queryString=${term}`).pipe(
       catchError(() => of(({ items: [] }))),
       map(rsp => rsp.items),
     );*/
    return this.service.multiSearch(term,this.url)
  }
 
  onAdded($event) {
    this.innerValue = $event;
    console.log("inn",this.innerValue);
    this.onChangeCallback($event);
    this.selectedItem.emit($event);
    this.items = $event;
    this.openRemains(this.items);
    // console.log("$event",$event);
    // console.log("thiss.items",this.items);
    this.openRemains(this.items);
  }
 


  onItemClear($event) {
    this.innerValue = $event;
    this.onChangeCallback($event);
    this.onClear.emit($event);
    this.showBadge = false;
    event.preventDefault();
    event.stopPropagation();
    // console.log("thiss.items clear",this.items);
  }


  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  //get accessor
  get value(): any {
    return this.innerValue;
  };

  //set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  //Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
  openRemains(items) {
    this.showBadge = !this.showBadge;
    if (this.showBadge) {
      this.showMaxBadgesMin = items.length;
    } else {
      console.log(this.showMaxBadges);
      this.showMaxBadgesMin = this.showMaxBadges;
    }

  }

  copyTextToClipboard(text) {
    var txtArea = document.createElement("textarea");
    txtArea.id = 'txt';
    txtArea.style.position = 'fixed';
    txtArea.style.top = '0';
    txtArea.style.left = '0';
    txtArea.style.opacity = '0';
    txtArea.value = text;
    document.body.appendChild(txtArea);
    txtArea.select();
  
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
      this.toastr.success('Copied text');
      if (successful) {
        return true;
      }
    } catch (err) {
      console.log('Oops, unable to copy');
    } finally {
      document.body.removeChild(txtArea);
    }
    return false;
  }

  mouseEnter() {
    if(this.ngModel != '') {
      // this.copyDisable = false;
    }
    else{
      // this.copyDisable = true;
    }
  }
  copyValues(event) {
    console.log("this.innerValue", this.formControlName);
    console.log("this.ngModel",this.ngModel);
    let copiedValues = '';
    if(this.ngModel != '') {
      this.ngModel.forEach(ele => {
        copiedValues = copiedValues + ele.nametattoo +',';
      })
      console.log("copiii",copiedValues);
      this.copyTextToClipboard(copiedValues);
    }
  else if(this.ngModel =='') {
      this.copyTextToClipboard(' ');
    }
   

}
}