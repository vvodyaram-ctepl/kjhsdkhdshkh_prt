import {
  Component,
  OnInit,
  Input,
  forwardRef,
  ViewEncapsulation,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SortablejsOptions } from 'ngx-sortablejs';

const noop = () => {};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SortableListComponent),
  multi: true
};

@Component({
  selector: 'sortable-list',
  templateUrl: './sortable-list.component.html',
  styleUrls: ['./sortable-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class SortableListComponent implements OnInit {
  options: {
    onUpdate: (event: any) => void;
  };
  @ViewChild('myDrop', { static: false }) drop: ElementRef;
  @Input() data;
  @Input() matcher;
  @Input() ngModel;
  @Input() limitSelection;
  // tslint:disable-next-line: no-output-native
  @Output() change = new EventEmitter();
  private innerValue: any;
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  constructor() {
    this.options = {
      onUpdate: (event: any) => {
        const checkedItems = this.data.filter(function(ele) {
          return ele.checked;
        });
        this.change.emit(checkedItems);
      }
    };
  }
  close() {
    const drop = this.drop as any;
    drop.close();
  }
  preventListSelect() {
    if (this.limitSelection) {
      const checked = [];
      this.data.map(ele => {
        if (ele.checked) {
          checked.push(ele);
        }
      });
      if (checked.length >= this.limitSelection) {
        this.data.filter(ele => {
          if (!ele.checked) {
            ele.disabled = true;
          }
        });
      } else {
        this.data.filter(ele => {
          ele.disabled = false;
        });
      }
    }
  }
  ngOnInit() {
    this.preventListSelect();
    this.innerValue = this.ngModel;
    this.onChangeCallback(this.ngModel);
  }
  changeChecked() {
    const checkedItems = this.data.filter(function(ele) {
      return ele.checked;
    });
    this.preventListSelect();
    this.change.emit(checkedItems);
  }

  //get accessor
  get value(): any {
    return this.innerValue;
  }

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