import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ValidationService {

    constructor() { }

    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            'required': 'Required',
            'invalidPhone': 'Enter a valid mobile number',
            'invalidEmail': 'Enter a valid email',
            'invalidUsername': 'Enter a valid username',
            'invalidPassword': 'Enter a valid password',
            'invalidPincode': 'Enter a valid zipcode',
            'minlength': `Minimum length is ${validatorValue.requiredLength} characters`,
            'maxlength': `Maximum length is ${validatorValue.requiredLength} characters`,
            'min': `Value cannot be less than ${validatorValue.min}`,
            'max': `Value cannot be greater than ${validatorValue.max}`,
            'whitespace': 'Value contains only whitespace',
            'pattern': 'Enter valid value',
            'matDatepickerParse': 'Enter a valid date format (MM/dd/YYYY)',
            'matDatepickerMax': 'Maximum Date Reached',
            'matDatepickerMin': 'Minimum Date Reached',
            'invalidDecimal' : 'Invalid Weight',
            'inValidName': 'Enter a valid name',
            'invalidVersion' : 'Enter valid version',
            'invalidNumber' : 'Enter valid number'
        };
        return config[validatorName];
    }

    static emailValidator(control) {
        // RFC 2822 compliant regex
        if (control.value) {
            if (control.value.match(/^[A-Za-z0-9._-]+@[A-Za-z0-9]+\.[a-z]{2,4}$/)) {
                return null;
            } else {
                return { 'invalidEmail': true };
            }
        }
    }

    static usPhoneValidator(control) {
        if (control.value) {
            if (control.value.match(/^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$/)) {
                return null;
            }
            else {
                return { 'invalidPhone': true };
            }
        }
    }

    static ukPhoneValidator(control) {
        if (control.value) {
            let value = control.value;
            if(value.includes('(')){
                //(988)523-9985   
                if (control.value.match(/^[\(0-9\)]{8}-[0-9]{4}$/)) {
                    return null;
                } else {
                    return { 'invalidPhone': true };
                }
            }else{
                if (control.value.match(/^[0-9]{2}-[0-9]{4}-[0-9]{4}$/)) {
                    return null;
                }
                else {
                    return { 'invalidPhone': true };
                }
            }
        }
    }

    static usernameValidator(control) {
        // RFC 2822 compliant regex
        if (control.value.match(/^[A-Za-z0-9._-]+@[A-Za-z0-9]+\.[a-z]{2,4}$/)) {
            return null;
        } else {
            return { 'invalidUsername': true };
        }
    }

    static passwordValidator(control) {
        // {6,100}           - Assert password is between 8 and 15 characters
        // (?=.*[0-9])       - Assert a string has at least one uppercase, one lowercase, one number and one special character from !@#$&^
        if (control.value.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$&^])[A-Za-z\d!@#$&^]{8,15}$/)) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }

    static containAlphabets(control) {
        // {6,100}           - Assert password is between 6 and 100 characters
        // (?=.*[0-9])       - Assert a string has at least one number
        // /^[a-zA-Z ]*$/
        if (control.value.match(/^[a-zA-Z\s]*$/)) {
            return null;
        } else {
            return { 'inValidName': true };
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
        if (!control.value || control.value.match(/^[0-9]{10}$/)) {
            return null;
        } else {
            return { 'invalidPhone': true };
        }
    }

    static pinCodeValidator(control) {
        if (!control.value || control.value.match(/^[0-9]{5}$/)) {
            return null;
        } else {
            return { 'invalidPincode': true };
        }
    }
    static decimalValidatorWithValue(control) {
        if (!control.value || control.value.toString().match(/^[1-9]\d*[.]?\d{0,2}$/)) {
            return null;
        } else {
            return { 'invalidDecimal': true };
        }
    }

    static versionDecimalValidatorWithValue(control) {
        if (!control.value || control.value.toString().match((/^[0-9]\d*([.]?\d)*$/))) {
            return null;
        } else {
            return { 'invalidVersion': true };
        }
    }

    static alphaNumeric(control) {
        if (control.value.match(/^[a-zA-Z0-9\s]*$/)) {
            return null;
        } else {
            return { 'invalidNumber': true };
        }
    }
    static exceptSpecialChar(control) {
        if (!(control.value.includes(`"`))) {
            return null;
        } else {
            return { 'inValidName': true };
        }
    }
}
