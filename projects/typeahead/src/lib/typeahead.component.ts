import { Component, OnInit, ViewEncapsulation, forwardRef, ViewChild, ElementRef, Input, Output, EventEmitter, Optional, Host, SkipSelf, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ControlValueAccessor, ControlContainer } from '@angular/forms';
import { Observable, of, Subject } from "rxjs";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import {  merge, filter, map, debounceTime, distinctUntilChanged, tap, switchMap, catchError } from "rxjs/operators";
import { TypeaheadService } from './typeahead.service';

const noop = () => {
};

export class validateValue {
  validate(control: AbstractControl): { [validator: string]: any } {
    if (!control.value) {
      return null;
    }
    const value = control.value;
    if (value) {
      return null;
    }
    // console.log("value",control.value)
    return { required: true };
  }
}

@Component({
  selector: 'lib-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: NG_VALIDATORS,
    useValue: new validateValue,
    multi: true
  },
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TypeaheadComponent),
    multi: true
  }]
})

export class TypeaheadComponent implements ControlValueAccessor {
  // timer: NodeJS.Timer;
  @ViewChild("input") input: ElementRef;
  @Input() url: string;
  @Input() offlineURL: string;
  @Input() data: any;
  @Input() class: string;
  @Input() placeholder: string;
  @Input() matcher: string
  @Output() selectedItem = new EventEmitter();
  @Output() onClear = new EventEmitter();
  @Output() enterKey = new EventEmitter();
  @Input() disabled: boolean;
  @Output() formatter = new EventEmitter();
  @Output() blur = new EventEmitter();
  @Input() display: string;
  @Input() ngModel: any;
  @Input() allowTyping: any;
  @Input() queryParamValue: any;
  public searching = false;
  public searchFailed = false;
  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
  //The internal data model
  private innerValue: any = '';
  @Input() formControlName: string;
  @Input() idProperty: string;
  @Input() maxlength: any = null;
  @Input() from: any;
  allowTimer: any;

  private control: AbstractControl;
  constructor(
    private componentService: TypeaheadService,
    @Optional() @Host() @SkipSelf()
    private controlContainer: ControlContainer,
    private ref: ChangeDetectorRef
  ) {
    // ref.detach();
    // this.timer = setInterval(() => {
    //   this.ref.detectChanges();
    // }, 500);
  }
  ngOnDestroy() {
    // clearTimeout(this.timer);
  }
  ngOnInit() {

  }
  ngAfterViewInit() {
    if (this.ngModel && !Object.keys(this.ngModel).length) {
      this.ngModel = '';
    }
    this.ref.detectChanges();
    /*  if (!(this.controlContainer && this.formControlName && (this.controlContainer.control.get(this.formControlName).value && this.controlContainer.control.get(this.formControlName).value))) {
       console.log(this.controlContainer.control.get(this.formControlName).value);
       this.input.nativeElement = '';
       this.onBlur();
     } */
  }
  ngOnChanges() {
    // console.log(this.from == "sample", this.controlContainer.control.get(this.formControlName).value);
    if (this.from == "sample" && (this.allowTyping && !(this.controlContainer && (this.controlContainer.control.get(this.formControlName) && this.controlContainer.control.get(this.formControlName).value)))) {
      setTimeout(() => {
       this.ngModel = "";
     //   this.input.nativeElement.value = "";
   //     this.onChangeCallback("");
      }, 1000)
    }
    else if (this.allowTyping && !(this.controlContainer && (this.controlContainer.control.get(this.formControlName) && this.controlContainer.control.get(this.formControlName)))) {
      setTimeout(() => {
        this.ngModel = "";
        this.input.nativeElement.value = "";
        this.onChangeCallback("");
      }, 1000)
    }
    if (this.input && this.input.nativeElement && this.ngModel && Object.keys(this.ngModel).length) {
      this.input.nativeElement.value = this.ngModel[this.matcher];
    } else if (this.input && this.input.nativeElement && this.controlContainer && (this.controlContainer.control.get(this.formControlName) && this.controlContainer.control.get(this.formControlName).value[this.matcher])) {
      this.input.nativeElement.value = this.controlContainer.control.get(this.formControlName).value[this.matcher];
    } else if (this.input && this.input.nativeElement) {
      this.input.nativeElement.value = '';
    }
  }
  clearInput() {
    if (this.input && this.input.nativeElement) {
      this.input.nativeElement.value = "";
    }
  }
  typeBlur() {
    this.onTouchedCallback();
    this.blur.emit();
    setTimeout(() => {
      if (this.controlContainer && (this.controlContainer.control.get(this.formControlName) && this.controlContainer.control.get(this.formControlName).value!== null && this.controlContainer.control.get(this.formControlName).value[this.matcher] != this.input.nativeElement.value)) {
        if (this.allowTyping && this.input.nativeElement.value) {
          this.innerValue = {
            [this.matcher]: this.input.nativeElement.value
          };
          this.onChangeCallback(this.innerValue);
          this.selectedItem.emit(this.idProperty ? this.innerValue[this.idProperty] : this.innerValue);
        } else {
          this.onChangeCallback('');
          this.input.nativeElement.value = '';
          this.ngModel = '';
          this.onClear.emit();
        }
        let value = this.controlContainer && this.controlContainer.control.get(this.formControlName) && this.controlContainer.control.get(this.formControlName).value || this.ngModel;
        // console.log(value);
      }
      // console.log('this.input.nativeElement.value', this.input.nativeElement.value);
      if (!(this.controlContainer && (this.controlContainer.control.get(this.formControlName))) && this.input.nativeElement.value) {
        // console.log(this.ngModel, this.input.nativeElement.value);
        if (this.ngModel[this.matcher] != this.input.nativeElement.value) {
          this.onChangeCallback('');
          this.input.nativeElement.value = '';
          this.ngModel = '';
          this.onClear.emit();
        }
      }
      /*    if (!(this.controlContainer && (this.controlContainer.control.get(this.formControlName)) && this.ngModel[this.matcher] != this.input.nativeElement.value)) {
           if (this.allowTyping && this.input.nativeElement.value) {
             this.innerValue = {
               [this.matcher]: this.input.nativeElement.value
             };
             this.onChangeCallback(this.innerValue);
             this.selectedItem.emit(this.idProperty ? this.innerValue[this.idProperty] : this.innerValue);
           } else {
             this.onChangeCallback('');
             this.input.nativeElement.value = '';
             this.ngModel = '';
             this.onClear.emit();
           }
           let value = this.controlContainer && this.controlContainer.control.get(this.formControlName) && this.controlContainer.control.get(this.formControlName).value || this.ngModel;
           console.log(value);
         } */


    }, 500);

  }


  formatMatches = (value: any) => value[this.matcher ? this.matcher : this.display] || '';
  outputFormatter = (value: any) => value
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300)
      ,distinctUntilChanged()
      ,tap(() => this.searching = true)
      ,switchMap(term =>
        this.componentService.search(term, this.url).pipe(
          tap((data) => {
            this.searchFailed = false
            this.formatter.emit(data);
          })
          ,catchError(() => {
            this.searchFailed = true;
            return of([]);
          })))
      ,tap(() => this.searching = false)
      ,merge(this.hideSearchingWhenUnsubscribed));

  offlineSearchURL = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300)
      ,distinctUntilChanged()
      ,tap(() => this.searching = true)
      ,switchMap(term =>
        this.componentService.offlineSearchURL(term, this.offlineURL, this.matcher, this.queryParamValue).pipe(
          tap((data) => {
            this.searchFailed = false;
            this.formatter.emit(data);
          })
          ,catchError(() => {
            this.searchFailed = true;
            return of([]);
          })))
      ,tap(() => this.searching = false)
      ,merge(this.hideSearchingWhenUnsubscribed));


  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  searchLocal = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      merge(this.focus$),
      merge(this.click$.pipe(filter(() => !this.instance.isPopupOpen()))),
      map((term: any) => term === '' ? this.data
        : this.data.filter(v => v[this.matcher] ? v[this.matcher].toLowerCase().indexOf(term.toLowerCase()) > -1 : '').slice(0, 10)
        )
    );

  selectItem(event) {
    this.innerValue = event.item;
    if (this.allowTyping) {
      this.ngModel = event.item;
    }
    // console.log(this.innerValue);
    this.onChangeCallback(this.innerValue);
    this.selectedItem.emit(this.idProperty ? this.innerValue[this.idProperty] : this.innerValue);
  }
  changedInput($event) {
    this.enterKey.emit($event.keyCode);
    if ($event.keyCode == 13) {

      return;
    }

    if (this.allowTyping && this.input.nativeElement.value) {
      this.innerValue = {
        [this.matcher]: this.input.nativeElement.value
      };
      //this.ngModel = this.innerValue;
      this.onChangeCallback(this.innerValue);
      this.selectedItem.emit(this.idProperty ? this.innerValue[this.idProperty] : this.innerValue);
      return;
    }
    if (!$event || !$event.target.value) {
      this.innerValue = '';
      this.onClear.emit($event.target.value);
      this.onChangeCallback(this.innerValue);
    }

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

}
