import { AbstractControl } from '@angular/forms';
export class PasswordMatch {

    static MatchPassword(AC: AbstractControl) {
        let password = AC.get('newPassword') ? AC.get('newPassword').value : undefined; // to get value in input tag
        let confirmPassword = AC.get('confirmPassword') ? AC.get('confirmPassword').value : undefined; // to get value in input tag
        if (password) {
            if (password !== confirmPassword) {
                AC.get('confirmPassword').setErrors({ MatchPassword: true });
            } else {
                return null;
            }
        }
    }
}