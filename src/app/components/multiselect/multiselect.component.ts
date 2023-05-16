import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation, forwardRef, Optional, Host, SkipSelf } from '@angular/core';
import { NG_VALUE_ACCESSOR, AbstractControl, NG_VALIDATORS, ControlContainer } from "@angular/forms";

const noop = () => {
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
  selector: 'multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: NG_VALIDATORS,
    useValue: new validateValue,
    multi: true
  },
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiselectComponent),
    multi: true
  }]
})

export class MultiselectComponent implements OnInit {
  @Input() formControlName: string;
  @Input() data: any;
  @Input() ngModel: any;
  @Input() matcher: any;
  @Input() primaryKey: any;
  @Input() disabled: boolean;
  @Output() onSelect = new EventEmitter();
  @Output() onDeSelect = new EventEmitter();
  @Output() onSelectAll = new EventEmitter();
  @Output() onDeSelectAll = new EventEmitter();
  private innerValue: any;
  public model: any;
  public dropdownSettings = {
    singleSelection: false,
    text: "Select",
    selectAllText: 'Select All',
    unSelectAllText: 'Select All',
    enableSearchFilter: false,
    classes: "dropdown-box",
    badgeShowLimit: 1
  };
  constructor(
    @Optional() @Host() @SkipSelf()
    private controlContainer: ControlContainer
  ) { }

  ngOnInit() {

    if (this.primaryKey) {
      this.data && this.data.forEach(element => {
        element.id = element[this.primaryKey];
      });
    }

    this.controlContainer && this.controlContainer.valueChanges.subscribe(e => {
      if (!this.controlContainer.control.get(this.formControlName) || !this.controlContainer.control.get(this.formControlName).value) {
        this.model = [];
        this.ngModel = [];
        return;
      }
      if (this.controlContainer.control.get(this.formControlName).value) {
        if (this.primaryKey) {
          this.controlContainer.control.get(this.formControlName).value && this.controlContainer.control.get(this.formControlName).value.forEach(element => {
            element.id = element[this.primaryKey];
          });
        }
        this.model = this.controlContainer.control.get(this.formControlName).value;
        this.ngModel = this.controlContainer.control.get(this.formControlName).value;
      }
    });
    this.model = this.ngModel;
    this.innerValue = this.model;
    this.onChangeCallback(this.model);
  }
  ngOnChanges() {
    if (this.primaryKey && Array.isArray(this.data)) {
      this.data.forEach(element => {
        element.id = element[this.primaryKey];
      });
    }
    if (this.controlContainer) {
      if (!this.controlContainer.control.get(this.formControlName) || !this.controlContainer.control.get(this.formControlName).value) {
        this.model = [];
        this.ngModel = [];
        return;
      }
      if (this.controlContainer.control.get(this.formControlName).value) {
        if (this.primaryKey) {
          this.controlContainer.control.get(this.formControlName).value && this.controlContainer.control.get(this.formControlName).value.forEach(element => {
            element.id = element[this.primaryKey];
          });
        }
        this.model = this.controlContainer.control.get(this.formControlName).value;
        this.ngModel = this.controlContainer.control.get(this.formControlName).value;
      }
    }
    //console.log(this.data);
  }

  itemSelect(item: any) {
    this.innerValue = this.ngModel;
    this.onChangeCallback(this.ngModel);
    this.onSelect.emit(item);
  }
  itemDeSelect(item: any) {
    this.innerValue = this.ngModel;
    this.onChangeCallback(this.ngModel);
    this.onDeSelect.emit(item);
  }
  selectAll(items: any) {
    this.innerValue = this.ngModel;
    this.onChangeCallback(this.ngModel);
    this.onSelectAll.emit(items);
  }
  deSelectAll(items: any) {
    this.innerValue = this.ngModel;
    this.onChangeCallback(this.ngModel);
    this.onDeSelectAll.emit(items);
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
