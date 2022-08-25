import { Component, Input, OnInit } from '@angular/core';
import { OrganizationService } from 'src/core/services/organization.service';
import { StorageService } from 'src/core/services/storage.service';
import { OrganizationModel } from 'src/core/models/organization/organization-model';
import { takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { BaseComponent } from 'src/core/base/base.component';

@Component({
  selector: 'tasque-organizations-dropdown',
  templateUrl: './organizations-dropdown.component.html',
  styleUrls: ['./organizations-dropdown.component.sass']
})
export class OrganizationsDropdownComponent extends BaseComponent implements OnInit {

  @Input() public availableOrganizations: OrganizationModel[] = [];

  public currentOrganization: OrganizationModel = {
    id: -1,
    name: 'None',
    authorId: -1,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  public organizationControl = new FormControl('');

  constructor(
    private organizationService: OrganizationService,
    private storageService: StorageService) {
    super();
  }

  ngOnInit(): void {
    if (this.storageService.currentOrganizationId === -1) {
      return;
    }

    this.subscribeToCurrentOrganization();
    this.subscribeToOrganizationControl();

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

  get organizationNames(): string[] {
    return this.availableOrganizations.map((x) => x.name);
  }

  private subscribeToCurrentOrganization(): void {
    this.storageService.currentOrganizationId$.subscribe(
      (result) => {
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
          .find((x) => x.name === this.organizationControl.value);

        if (searchedOrganization) {
          this.currentOrganization = searchedOrganization;
        }
        else {
          this.setOrganization();
        }
      }
    );
  }
}
