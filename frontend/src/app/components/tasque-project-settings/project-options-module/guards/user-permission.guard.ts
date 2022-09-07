import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserModel } from 'src/core/models/user/user-model';
import { GetCurrentOrganizationService } from 'src/core/services/get-current-organization.service';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';

@Injectable({
  providedIn: 'root'
})
export class UserPermissionGuard implements CanActivate {
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.role >= 3) {
      return true;
    }
    this.router.navigate(['./not-found']);
    return false;
  }

  private currentUser: UserModel;
  private organizationId: number;
  private role: number;

  constructor(
    private router: Router,
    private currentUserService: GetCurrentUserService,
    private currentOrganizationService: GetCurrentOrganizationService,
  ) {
    this.currentUserService.currentUser$.subscribe((user) => {
      this.currentUser = user as UserModel;

      this.organizationId = this.currentOrganizationService.currentOrganizationId;
      this.role = this.currentUser.organizationRoles?.find((r) => r.organizationId === this.organizationId)?.role as number;
    });
  }
}
