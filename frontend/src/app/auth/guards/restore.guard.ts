import { Injectable } from '@angular/core';
import { CanDeactivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RestorePageComponent } from '../components/restore-page/restore-page.component';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

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
}
