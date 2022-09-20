import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { OrganizationModel } from 'src/core/models/organization/organization-model';
import { UserModel } from 'src/core/models/user/user-model';
import { GetCurrentOrganizationService } from 'src/core/services/get-current-organization.service';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';
import { OrganizationService } from 'src/core/services/organization.service';

@Injectable({
  providedIn: 'root',
})
export class UserPermissionGuard implements CanActivate {
  
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.setActualData();

    if (this.role >= 3 || this.organization?.authorId === this.currentUser?.id) {
      return true;
    }
    this.router.navigate(['./not-found']);
    return false;
  }

  setActualData(): void {
    this.currentUserService.currentUser$.subscribe((user) => {
      this.currentUser = user;

      this.organizationId = this.currentOrganizationService.currentOrganizationId;
      this.currentOrganizationService.organizations$.subscribe((orgs) => {
        this.organization = orgs.find((org) => org.id === this.organizationId) as OrganizationModel;
      });

      this.role = this.currentUser.organizationRoles?.find((r) => r.organizationId === this.organizationId)?.role as number;
    });
  }

  private currentUser: UserModel;
  private organizationId: number;
  private role: number;
  private organization: OrganizationModel;

  constructor(
    private router: Router,
    private currentUserService: GetCurrentUserService,
    private currentOrganizationService: GetCurrentOrganizationService,
    private organizationService: OrganizationService
  ) { }
}
