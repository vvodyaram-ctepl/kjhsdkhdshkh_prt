import { Component, OnInit, OnDestroy, Input, forwardRef, ViewEncapsulation, Optional, Host, SkipSelf, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlContainer } from "@angular/forms";

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MultiSetComponent),
  multi: true
};

@Component({
  selector: 'multiset',
  templateUrl: './multi-set.component.html',
  styleUrls: ['./multi-set.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})


export class MultiSetComponent implements OnInit, OnDestroy {
  innerValue: any;
  @Input() formControlName: string;
  constructor(
    @Optional() @Host() @SkipSelf()
    private controlContainer: ControlContainer
  ) { }
  @Input() data;
  @Input() ngModel;
  @Input() matcher;
  @Input() propertyId;
  @Input() type;
  @Input() alignment;
  @Input() showSelectAllCheckBox;
  @Output() selected = new EventEmitter();
  @Input() splitTubes;

  ngOnInit() {

    this.controlContainer && this.controlContainer.valueChanges.subscribe(e => {
      if (!this.controlContainer.control.get(this.formControlName) || !this.controlContainer.control.get(this.formControlName).value) {
        if (!this.splitTubes) {

          this.ngModel = '';
          if (this.data) {
            this.data &&  this.data.forEach(ele => {
              //  if(!ele.disabled){
              ele.checked = false;
              //   }
            });

          }
        }
      }
      if (this.controlContainer.control.get(this.formControlName) && this.controlContainer.control.get(this.formControlName).value) {
        this.ngModel = this.controlContainer.control.get(this.formControlName).value;
        this.defaultCheck();
      }
    });
    this.defaultCheck();
  }
  ngOnChanges() {
    this.controlContainer && this.controlContainer.valueChanges.subscribe(e => {

      if (!this.controlContainer.control.get(this.formControlName).value && !this.splitTubes) {
        this.ngModel = '';
        this.data &&   this.data.forEach(ele => {
          // if(!ele.disabled){
          ele.checked = false;
          //  }
        });
      }
      if (this.controlContainer.control.get(this.formControlName).value) {
        this.ngModel = this.controlContainer.control.get(this.formControlName).value;
        this.defaultCheck();
      }
    });
    this.defaultCheck();
  }
  ngAfterViewInit() {

  }
  defaultCheck() {
    this.ngModel && this.data && Array.isArray(this.ngModel) && this.ngModel.forEach(element => {
      this.data.forEach(ele => {
        if (element[this.propertyId] == ele[this.propertyId]) {
          // if(!ele.disabled){
            ele.checked = true;
          // }
        }
      })
    });
  }

  onChecked(index) {
    let selected = [];
    this.data.forEach(ele => {
      if (ele.checked) {
        selected.push(ele);
      }
    });

    if (this.type == "radio") {
      this.data.forEach(ele => {
        //  if(!ele.disabled){
        ele.checked = false;
        //  }
      });
      if (!this.data[index].disabled) {
        this.data[index].checked = true;
      }
      selected = this.data[index];
    }
    this.ngModel = selected;
    this.onChangeCallback(selected);
    this.selected.emit(selected);
  }

  ngOnDestroy() {
    this.data.forEach(ele => {

      ele.checked = false;
    });
  }

  onCheckedAll(event) {
    const checkValue = event.target.checked;
    this.data.forEach(ele => {
      if (!ele.disabled) {
        if (checkValue) {
          ele.checked = true;
        } else {
          ele.checked = false;
        }
      }
    });
    let selected = [];
    this.data.forEach(ele => {
      if (ele.checked) {
        selected.push(ele);
      }
    })

    this.ngModel = selected;
    this.onChangeCallback(selected);
    this.selected.emit(selected);
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
