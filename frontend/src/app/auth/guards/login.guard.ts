import { Injectable } from '@angular/core';
import { CanDeactivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginPageComponent } from '../components/login-page/login-page.component';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanDeactivate<LoginPageComponent> {
  canDeactivate(
    component: LoginPageComponent,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!component.loginForm.dirty) return true;
    return window.confirm('Data would not be saved. Continue?');
  }
}
