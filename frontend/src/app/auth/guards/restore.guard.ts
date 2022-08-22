import { Injectable } from '@angular/core';
import { CanDeactivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RestorePageComponent } from '../auth/components/restore-page/restore-page.component';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { RestorePageComponent } from '../components/restore-page/restore-page.component';

@Injectable({
  providedIn: 'root'
})
export class RestoreGuard implements CanDeactivate<RestorePageComponent> {
  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {}
  canDeactivate(
    component: RestorePageComponent,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!component.requestForm.dirty) return true;
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
