import { Injectable } from '@angular/core';
import { CanDeactivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RegisterPageComponent } from '../components/register-page/register-page.component';

@Injectable({
  providedIn: 'root',
})
export class RegisterGuard implements CanDeactivate<RegisterPageComponent> {
  canDeactivate(
    component: RegisterPageComponent,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!component.registerForm.touched && !component.passwordRepeatControl.touched) return true;
    if(component.registerForm.valid && component.passwordRepeatControl.valid) return true;
    return window.confirm('Data would not be saved. Continue?');
  }
}
