import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchValidator(ctrl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isMatch = ctrl.value === control.value;
    return isMatch ? null : { noMatch: { value: control.value } };
  };
}
