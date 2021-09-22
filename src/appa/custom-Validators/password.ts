import { AbstractControl } from '@angular/forms';
export function PassCompare(control: AbstractControl) {
  if (control.value && control.value !== null && control.value !== undefined) {
    var cpass = control.value;
    var pass = control.root.get('password').value;
    if (cpass !== pass) {
      return { invalidPss: true };
    }
  }
  return null;
}