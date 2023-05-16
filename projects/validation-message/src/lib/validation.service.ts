import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ValidationService {

    constructor() { }
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            'required': 'Required',
            'invalidEmailAddress': 'Invalid email address',
            'phoneNumberValidator': 'Invalid Phone Number',
            'usphoneNumberValidator':'Invalid Phone Number',
            'invalidEmail': 'Invalid email address',
            'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.',
            'minlength': `Minimum length is ${validatorValue.requiredLength} characters`,
            'maxlength': `Maximum length is ${validatorValue.requiredLength} characters`,
            'min': `Value cannot be less than ${validatorValue.min}`,
            'max': `Value cannot be greater than ${validatorValue.max}`,
            'whitespace': 'Value contains only whitespace',
            'pattern': 'Value contains invalid inputs.',
            "passwordMatch":"Password and Re type password should be same"
        };

        return config[validatorName];
    }

    static usernameValidator(control) {
        // RFC 2822 compliant regex
        if (control.value.match(/^[A-Za-z0-9._-]+@[A-Za-z0-9]+\.[a-z]{2,4}$/)) {
            return null;
        } else {
            return { 'invalidUsername': true };
        }
    }


    static emailValidator(control) {
        // RFC 2822 compliant regex
        
        if (control.value && control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }

    static passwordValidator(control) {
        // {6,100}           - Assert password is between 6 and 100 characters
        // (?=.*[0-9])       - Assert a string has at least one number
        if (control.value && control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }
    static containAlphabets(control) {
        // {6,100}           - Assert password is between 6 and 100 characters
        // (?=.*[0-9])       - Assert a string has at least one number
        if (control.value.match(/^(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }
    static containNumeric(control) {
        // {6,100}           - Assert password is between 6 and 100 characters
        // (?=.*[0-9])       - Assert a string has at least one number
        if (control.value.match(/^(?=.*[0-9])([a-zA-Z0-9]+)$/)) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }
    static whiteSpaceValidator(control) {
        const isWhitespace = (control.value || '').toString().trim().length === 0;
        const isBlank = (control.value || '').toString().length === 0;
        if (isBlank === isWhitespace) {
            return null;
        } else {
            const isValid = !isWhitespace;
            return isValid ? null : { 'whitespace': true };
        }
    }



    static phoneNumberValidator(control) {
    
        if (!control.value || (control.value.length == 10 && control.value.match(/^[0-9/-]*$/))) {
            return null;
        } else {
            return { 'phoneNumberValidator': true };
        }
    }

    static usphoneNumberValidator(control) {
    
        if (!control.value || (control.value.length == 10 && control.value.match(/^\(?(\d{3})\)?[-\. ]?(\d{3})[-\. ]?(\d{4})( x\d{4})?$/))) {
            return null;
        } else {
            return { 'usphoneNumberValidator': true };
        }
    }

    static emailValidatorWithValue(control) {
        if (!control.value || control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmail': true };
        }
    }
}
