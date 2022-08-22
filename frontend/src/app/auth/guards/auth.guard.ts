import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkForActivation();
  }
  canActivateChild(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkForActivation();
  }

  private checkForActivation(): boolean {
    if (this.authService.areTokensExist()) {
      return true;
    }
    this.router.navigate(['/auth']);
    return false;
  }

}
