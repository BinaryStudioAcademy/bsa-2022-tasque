import { Component, OnInit } from '@angular/core';
import { OrganizationService } from 'src/core/services/organization.service';
import { GetCurrentOrganizationService } from 'src/core/services/get-current-organization.service';
import { OrganizationModel } from 'src/core/models/organization/organization-model';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/core/base/base.component';
import { UserModel } from 'src/core/models/user/user-model';
import { Router } from '@angular/router';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';

@Component({
  selector: 'tasque-organizations-dropdown',
  templateUrl: './organizations-dropdown.component.html',
  styleUrls: ['./organizations-dropdown.component.sass']
})
export class OrganizationsDropdownComponent extends BaseComponent implements OnInit {

  public currentUser: UserModel;

  public currentOrganization: OrganizationModel = {
    id: -1,
    name: 'My Organizations',
    authorId: -1,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  public availableOrganizations: OrganizationModel[] = [];

  constructor(
    private organizationService: OrganizationService,
    private getCurrentOrganizationService: GetCurrentOrganizationService,
    private getCurrentUserService: GetCurrentUserService,
    private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.subscribeToCurrentUser();
    this.subscribeToCurrentOrganization();
    this.subscribeToOrganizationChange();
  }

  private setOrganization(): void {
    if (this.currentOrganization.id === -1) {
      return;
    }

    this.organizationService.getOrganization(this.getCurrentOrganizationService.currentOrganizationId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (result) => {
          if (result.body) {
            this.currentOrganization = result.body;
            this.availableOrganizations.push(this.currentOrganization);
          }
        }
      );
  }

  private subscribeToCurrentOrganization(): void {
    this.getCurrentOrganizationService.currentOrganizationId$.subscribe(
      (result) => {
        if (result === -1) {
          return;
        }

        if (this.currentOrganization.id === result) {
          return;
        }

        const searchedOrganization = this.availableOrganizations.find((x) => x.id === result);

        if (searchedOrganization) {
          this.currentOrganization = searchedOrganization;
        }
        else {
          this.setOrganization();
        }
      });
  }

  public selectOrganization(organization: OrganizationModel): void {
    if (this.currentOrganization.id === organization.id &&
      this.getCurrentOrganizationService.currentOrganizationId === organization.id) {
      return;
    }

    this.getCurrentOrganizationService.currentOrganizationId = organization.id;

    this.router.navigate(['/projects'], { replaceUrl: true });
    window.scroll(0, 0);
  }

  private subscribeToOrganizationChange(): void {
    this.getCurrentOrganizationService.organizationUpdated$.subscribe(
      (organization) => {
        const index = this.availableOrganizations.findIndex((org) => org.id === organization.id);

        if (index === -1) {
          this.availableOrganizations.push(organization);

          if (this.getCurrentOrganizationService.currentOrganizationId === -1) {
            this.getCurrentOrganizationService.currentOrganizationId = this.availableOrganizations[0].id;
          }

          return;
        }

        this.availableOrganizations[index] = organization;

        if (this.currentOrganization.id === organization.id) {
          this.currentOrganization = organization;
        }
      }
    );
  }

  public openOrganizationsPage(): void {
    this.router.navigate(['/organizations'], {
      replaceUrl: true,
    });
    window.scroll(0, 0);
  }

  public trackByOrganization(index: number, organization: OrganizationModel): number {
    return organization.id;
  }

  public subscribeToCurrentUser(): void {
    this.getCurrentUserService.currentUser$.subscribe((user) => {
      this.currentUser = user;

      this.organizationService.getUserOrganizations(user.id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((response) => {

          this.availableOrganizations = response.body as OrganizationModel[];

          if (this.availableOrganizations.length === 0) {
            this.currentOrganization = {
              id: -1,
              name: 'My Organizations',
              authorId: -1,
              createdAt: new Date(),
              updatedAt: new Date()
            };

            this.getCurrentOrganizationService.setOrganizations(this.availableOrganizations);
            return;
          }

          const searchedOrganization = this.availableOrganizations
            .find((x) => x.id === this.getCurrentOrganizationService.currentOrganizationId);

          if (searchedOrganization) {
            this.currentOrganization = searchedOrganization;

            this.getCurrentOrganizationService.setOrganizations(this.availableOrganizations);
            return;
          }

          if (this.getCurrentOrganizationService.currentOrganizationId === -1
            && this.availableOrganizations.length > 0) {

            this.getCurrentOrganizationService.currentOrganizationId = this.availableOrganizations[0].id;

            this.getCurrentOrganizationService.setOrganizations(this.availableOrganizations);
            return;
          }
        });
    });
  }
}
