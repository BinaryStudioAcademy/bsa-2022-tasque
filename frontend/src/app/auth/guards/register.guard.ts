import { Injectable } from '@angular/core';
import { CanDeactivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RegisterPageComponent } from '../components/register-page/register-page.component';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class RegisterGuard implements CanDeactivate<RegisterPageComponent> {
  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {}
  canDeactivate(
    component: RegisterPageComponent,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!component.registerForm.dirty) return true;
    return window.confirm('Data would not be saved. Continue?');
  }
}
