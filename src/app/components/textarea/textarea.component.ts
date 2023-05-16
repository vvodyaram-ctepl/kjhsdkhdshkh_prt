// import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';

// @Component({
//   selector: 'app-textarea',
//   templateUrl: './textarea.component.html',
//   styleUrls: ['./textarea.component.scss']
// })
// export class TextareaComponent implements OnInit {
//   textForm: FormGroup;
//   @Output() formReady = new EventEmitter<FormGroup>();
//   @Input() labelName :any= ''

//   constructor(private fb: FormBuilder) { 
//     this.textForm = this.fb.group({
//       description :''
//     });
//   }

//   ngOnInit() {
  
//     this.formReady.emit(this.textForm);
//   }
  


// }

import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation, forwardRef, Optional, Host, SkipSelf, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ControlValueAccessor, ControlContainer, Validators } from '@angular/forms';

const noop = () => {
};
export class validateValue {
  validate(control: AbstractControl): { [validator: string]: any } {
    if (!control.value) {
      return null;
    }
    const value = control.value ? control.value.toString().trim() : '';
    if (value) {
      return null;
    }
    return { required: true };
  }
}

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: NG_VALIDATORS,
    useValue: new validateValue,
    multi: true
  },
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextareaComponent),
    multi: true
  }]
})
export class TextareaComponent implements ControlValueAccessor {

  @Input() formControlName: string;
  @Input() maxLengthT :any = 500;
  @Input() placeHolderText:any ='';
  innerValue: any;
  @Input() isRequired: boolean = false;
 
  @Input() labelName = 'Description';
  @Input() ngModel: any;

  @Output() inputValue = new EventEmitter();
  public searchBy: any = '';

  constructor(
    @Optional() @Host() @SkipSelf()
    private controlContainer: ControlContainer
  ) { }


  ngOnInit() {
    this.searchBy = this.controlContainer.control.get(this.formControlName).value;

    this.controlContainer && this.controlContainer.valueChanges.subscribe(e => {
      if (!this.controlContainer.control.get(this.formControlName).value) {
        this.searchBy = '';
        return;
      }
      if (this.controlContainer.control.get(this.formControlName).value) {
        this.ngModel = this.controlContainer.control.get(this.formControlName).value;
        this.searchBy = this.ngModel;
        this.inputValue.emit(this.searchBy);
      }

    });

  }


  ngOnChanges() {
    
    if (!this.ngModel) {
      this.ngModel = "";
      this.searchBy = '';
    }


  }

  searchByChange() {
    // this.ngModel = {
    //   description: this.searchBy
    //   // searchByValue: this.searchByValue && this.searchByValue.item
    // };
    this.ngModel = this.searchBy
    this.innerValue = this.ngModel;
    this.onChangeCallback(this.innerValue);
    
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
