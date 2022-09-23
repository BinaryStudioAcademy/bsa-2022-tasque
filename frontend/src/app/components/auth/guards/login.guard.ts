import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastrNotificationService } from '../../../../core/services/toastr-notification.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    private notificationService: ToastrNotificationService,
  ) {}

  private key: string;

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      this.activeRoute.queryParams
      .subscribe((params) => {
        this.key = params['key'] as string;
      });
    if (this.authService.areTokensExist() && !this.key) {
      this.router.navigate(['/organizations']);
      this.notificationService.info('You are already logged in', 'Reminding');
      return false;
    }
    return true;
  }
}
