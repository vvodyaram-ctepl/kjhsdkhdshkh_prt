import { Component, OnInit, Input, Injectable, forwardRef, ViewEncapsulation, ViewChild, ElementRef, EventEmitter, Output, Optional, Host, SkipSelf } from '@angular/core';
import * as $ from 'jquery';
import * as moment from 'moment';
import { NgbDateAdapter, NgbDateStruct, NgbInputDatepicker, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, ControlValueAccessor, AbstractControl, ControlContainer } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';


/**
 * Example of a Native Date adapter
 */
@Injectable()
export class NgbDateNativeAdapter extends NgbDateAdapter<Date> {

  fromModel(date: Date): NgbDateStruct {
    return (date && date.getFullYear) ? { month: date.getMonth() + 1, day: date.getDate(), year: date.getFullYear() } : null;
  }

  toModel(date: NgbDateStruct): Date {
    return date ? new Date(date.year, date.month - 1, date.day) : null;
  }
}

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatepickerComponent),
  multi: true
};
export class validateValue {
  validate(control: AbstractControl): { [validator: string]: any } {
    if (!control.value) {
      return null;
    }
    const value = control.value.trim();
    if (value) {
      return null;
    }
    return { required: true };
  }
}

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: NG_VALIDATORS,
    useValue: new validateValue,
    multi: true
  },
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatepickerComponent),
    multi: true
  }, { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class DatepickerComponent implements ControlValueAccessor {
  public dt = new Date();
  public year = this.dt.getFullYear() - 20;
  @Input() formControlName: string;
  @ViewChild('dp') el: ElementRef;
  @ViewChild('maskpicker') maskpicker: ElementRef;
  @Input() ngModel: Date;
  @Input() placeholder: string;
  @Input() format: string;
  @Input() disabled: boolean;
  @Input() minDate: object= new Date(this.year, 1, 1);;
  @Input() hideClose: boolean;
  @Input() maxDate: object;
  @Output() select = new EventEmitter();
  @Output() onClear = new EventEmitter();
  @Output() blur = new EventEmitter();
  popoverPlacement = "bottom-left";
  public maskModel: any;
  public innerValue: any = '';
  public picker = false;
  public cursorArea = false;
  public today = { year: Number(moment().format('YYYY')), month: Number(moment().format('M')), day: Number(moment().format('DD')) }
  todaysDate = this.calendar.getToday();
  constructor(
    @Optional() @Host() @SkipSelf()
    public controlContainer: ControlContainer,
    public calendar: NgbCalendar,
    public toastr:ToastrService
  ) { }

  ngOnInit() {
    this.format = this.format ? this.format : 'MM-DD-YYYY';
    this.controlContainer && this.controlContainer.valueChanges.subscribe(e => {
      if (this.formControlName && this.controlContainer.control.get(this.formControlName) && !this.controlContainer.control.get(this.formControlName).value) {
        this.maskModel = null;
        this.ngModel = null;
        return;
      }
      if (this.formControlName && this.controlContainer.control.get(this.formControlName) && this.controlContainer.control.get(this.formControlName).value) {
        this.ngModel = this.controlContainer.control.get(this.formControlName).value;
        this.maskModel = moment(this.ngModel, this.format).format(this.format);
        this.ngModel = this.ngModel ? new Date(this.ngModel) : null;
        this.innerValue = this.maskModel;
      }
    });
    if (this.ngModel) {
      this.maskModel = moment(this.ngModel, this.format).format(this.format);
      this.ngModel = this.ngModel ? new Date(this.ngModel) : null;
      this.innerValue = this.maskModel;
      this.onChangeCallback(this.maskModel);
    }
  }
  validateInputType($event) {
    console.log("$event$event",$event);
    if ($event.keyCode == 8 || $event.keyCode == 46) {
      this.ngModel = undefined;
      this.innerValue = "";
      this.onChangeCallback("");
    }
    if($event.keyCode == 17) {
      console.log("this.innerValue",this.innerValue);
      console.log("this.ngModel",this.ngModel);
      // this.innerValue = "";
      // this.onChangeCallback("");
      if(Object.prototype.toString.call(this.ngModel) === '[object Date]' ) {
        if(this.innerValue == 'Invalid date') {
          this.toastr.error('Please enter valid date.', 'Error!');
          this.innerValue = "";
          this.onChangeCallback(""); 
        }
      }
      else {
       this.innerValue = "";
        this.onChangeCallback("");
      }
    }
  }
  ngOnChanges() {
    if (this.controlContainer && this.controlContainer.control.get(this.formControlName) && this.controlContainer.control.get(this.formControlName).value) {
      console.log(this.controlContainer.control.get(this.formControlName).value);
      this.ngModel = this.controlContainer.control.get(this.formControlName).value;
      this.maskModel = moment(this.ngModel, this.format).format(this.format);
      this.ngModel = this.ngModel ? new Date(this.ngModel) : null;
      this.innerValue = this.maskModel;
    }

    if (typeof (this.minDate) == 'string') {
      //this.minDate = { year: Number(moment(this.minDate).format('YYYY')), month: Number(moment(this.minDate).format('M')), day: Number(moment(this.minDate).format('DD')) };
      this.minDate = moment(this.minDate, this.format);
      this.minDate = new Date(<any>this.minDate)
    }

    if (this.minDate instanceof Date) {
      this.minDate = { year: Number(moment(this.minDate).format('YYYY')), month: Number(moment(this.minDate).format('M')), day: Number(moment(this.minDate).format('DD')) };
    }

    if (typeof (this.maxDate) == 'string') {
      //this.minDate = { year: Number(moment(this.minDate).format('YYYY')), month: Number(moment(this.minDate).format('M')), day: Number(moment(this.minDate).format('DD')) };
      this.maxDate = moment(this.maxDate, this.format);
      this.maxDate = new Date(<any>this.maxDate)
    }

    if (this.maxDate instanceof Date) {
      this.maxDate = { year: Number(moment(this.maxDate).format('YYYY')), month: Number(moment(this.maxDate).format('M')), day: Number(moment(this.maxDate).format('DD')) };
    }

    if (this.ngModel && this.ngModel instanceof Date) {
      this.maskModel = moment(this.ngModel, this.format).format(this.format);
      this.ngModel = this.ngModel ? new Date(this.ngModel) : null;
      this.innerValue = this.maskModel;
      this.onChangeCallback(this.maskModel);
    }
    if (this.ngModel && typeof (this.ngModel) == "string") {
      this.maskModel = this.ngModel;
      this.ngModel = this.ngModel ? new Date(this.ngModel) : null;
      this.innerValue = this.maskModel;
      this.onChangeCallback(this.maskModel);
    }
    if (!this.ngModel || <any>this.ngModel === 'Invalid Date') {
      this.maskModel = "";
      this.ngModel = undefined;
    }
    if (typeof (this.ngModel) == 'object' && typeof (this.maskModel) == 'string' && this.maskModel == 'Invalid date') {
      this.maskModel = "";
      this.ngModel = undefined;
    }
  }

  onBlur($event) {
    if(this.innerValue === 'Invalid date') {
      this.toastr.error('Please enter valid date.', 'Error!');
      this.innerValue = "";
      this.onChangeCallback(""); 
    }
    this.onTouchedCallback();
  }
  outsideClick(event, element) {
    if (!$(event.target).closest("ngb-datepicker").hasClass("dropdown-menu")) {
      this.blur.emit();
      element.close();
    }
  }
  openPicker($event, element) {
    if (this.ngModel) {
      this.ngModel = new Date(this.ngModel);
    }
    if ($event.clientX < window.innerWidth / 2 && $event.clientY < window.innerHeight / 2) {
      this.popoverPlacement = 'bottom-left';
    }
    if ($event.clientX < window.innerWidth / 2 && $event.clientY > window.innerHeight / 2) {
      this.popoverPlacement = 'top-left';
    }
    if ($event.clientX > window.innerWidth / 2 && $event.clientY > window.innerHeight / 2) {
      this.popoverPlacement = 'top-right';
    }
    if ($event.clientX > window.innerWidth / 2 && $event.clientY < window.innerHeight / 2) {
      this.popoverPlacement = 'bottom-right';
    }
    $("ngb-datepicker").hide();
    setTimeout(function () {
      $($event.target).next().next().show();
      element.open();
    }.bind(this), 100)
  }
  changedInput($event) {
    this.innerValue = this.maskModel;
  

    this.maskModel = moment($event).format(this.format ? this.format : "DD-MM-YYYY");
    this.innerValue = this.maskModel;
    this.onChangeCallback(this.maskModel);
    this.select.emit($event);

    console.log("this.innerValue",this.innerValue);
    console.log("this.maskModel",this.maskModel);

    if (this.maskModel == "") {
      this.ngModel = undefined;
      this.innerValue = "";
      this.onChangeCallback("");
    }
    if (this.maskModel) {
      this.innerValue = this.maskModel;
      this.onChangeCallback(this.maskModel);
    }
  }
  clearInput() {
    this.ngModel = undefined;
    this.maskModel = '';
    this.innerValue = '';
    this.onClear.emit(true);
    this.onChangeCallback(this.maskModel);
  }
  dateSelected($event) {
    // alert($event);
    console.log("Eventtttt",$event);
    this.maskModel = moment($event).format(this.format ? this.format : "DD-MM-YYYY");
    this.innerValue = this.maskModel;
    this.onChangeCallback(this.maskModel);
    this.select.emit($event);
  }

  public onTouchedCallback: () => void = noop;
  public onChangeCallback: (_: any) => void = noop;

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

