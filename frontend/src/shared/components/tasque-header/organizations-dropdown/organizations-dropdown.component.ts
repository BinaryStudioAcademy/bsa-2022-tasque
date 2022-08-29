import { Component, Input, OnInit } from '@angular/core';
import { OrganizationService } from 'src/core/services/organization.service';
import { StorageService } from 'src/core/services/storage.service';
import { OrganizationModel } from 'src/core/models/organization/organization-model';
import { takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { BaseComponent } from 'src/core/base/base.component';
import { UserModel } from 'src/core/models/user/user-model';
import { MenuDropdownOption } from '../../tasque-menu-dropdown/menu-dropdown.component';

@Component({
  selector: 'tasque-organizations-dropdown',
  templateUrl: './organizations-dropdown.component.html',
  styleUrls: ['./organizations-dropdown.component.sass']
})
export class OrganizationsDropdownComponent extends BaseComponent implements OnInit {

  private user: UserModel;

  @Input()
  set currentUser(user: UserModel) {
    if (!user) {
      return;
    }

    this.user = user;

    this.organizationService.getUserOrganizations(this.currentUser.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (result) => {
          this.availableOrganizations = result.body as OrganizationModel[];
        }
      );
  }
  get currentUser(): UserModel {
    return this.user;
  }

  public currentOrganization: OrganizationModel = {
    id: -1,
    name: 'None',
    authorId: -1,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  public availableOrganizations: OrganizationModel[] = [];

  public organizationControl = new FormControl<MenuDropdownOption | undefined>(undefined);

  constructor(
    private organizationService: OrganizationService,
    private storageService: StorageService) {
    super();
  }

  ngOnInit(): void {
    this.subscribeToCurrentOrganization();
    this.subscribeToOrganizationControl();

    if (this.storageService.currentOrganizationId === -1) {
      if (this.availableOrganizations.length > 0) {
        this.currentOrganization = this.availableOrganizations[0];
        this.storageService.currentOrganizationId = this.currentOrganization.id;
      }
      return;
    }

    const searchedOrganization = this.availableOrganizations
      .find((x) => x.id === this.storageService.currentOrganizationId);

    if (searchedOrganization) {
      this.currentOrganization = searchedOrganization;
    }
    else {
      this.setOrganization();
    }
  }

  private setOrganization(): void {
    this.organizationService.getOrganization(this.storageService.currentOrganizationId)
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

  get organizationNames(): MenuDropdownOption[] {
    if (this.availableOrganizations.length > 0) {
      return this.availableOrganizations as MenuDropdownOption[];
    }

    return [];
  }

  private subscribeToCurrentOrganization(): void {
    this.storageService.currentOrganizationId$.subscribe(
      (result) => {
        if (result === -1) {
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

  private subscribeToOrganizationControl(): void {
    this.organizationControl.valueChanges.subscribe(
      () => {
        const searchedOrganization = this.availableOrganizations
          .find((x) => x.id === this.organizationControl.value?.id);

        if (searchedOrganization) {
          this.currentOrganization = searchedOrganization;
          this.storageService.currentOrganizationId = this.currentOrganization.id;
        }
        else {
          this.setOrganization();
        }
      }
    );
  }
}
