import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginPageComponent } from '../auth/components/login-page/login-page.component';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanDeactivate<LoginPageComponent>, CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {}

  canDeactivate(component:
    LoginPageComponent): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(!component.loginForm.dirty)
      return true;
    return window.confirm('Data would not be saved. Continue?');
  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.areTokensExist()) {
      this.router.navigate(['/organizations']);
      this.notificationService.info('You are already logged in', 'Reminding');
      return false;
    }
    return true;
  }
}
