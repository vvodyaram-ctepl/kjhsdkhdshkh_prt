import { Component, OnInit } from '@angular/core';
import { Input, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ValidationService } from './validation.service';

@Component({
  selector: 'validation-message',
  templateUrl: './validation-message.component.html',
  styleUrls: ['./validation-message.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ValidationMessageComponent implements OnInit {
  @Input() control: FormControl;
  @Input() hideDefaultMessage: boolean;
  constructor() { }

  ngOnInit() {
  }
  get errorMessage() {
    if (this.control) {
      for (let propertyName in this.control.errors) {
        if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
          return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
        }
      }
    }
    return null;
  }
}
