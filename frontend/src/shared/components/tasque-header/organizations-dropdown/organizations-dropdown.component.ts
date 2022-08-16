import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { OrganizationService } from 'src/core/services/organization.service';
import { StorageService } from 'src/core/services/storage.service';
import { OrganizationModel } from 'src/entity-models/organization-model';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tasque-organizations-dropdown',
  templateUrl: './organizations-dropdown.component.html',
  styleUrls: ['./organizations-dropdown.component.sass']
})
export class OrganizationsDropdownComponent implements OnInit {
  @Input() public availableOrganizations: OrganizationModel[] = [];

  public currentOrganization: OrganizationModel = {
    id: -1,
    name: 'None',
    authorId: -1
  };

  public unsubscribe$ = new Subject<void>();

  constructor(
    private organizationService: OrganizationService,
    private storageService: StorageService) { }

  ngOnInit(): void {
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

    if (this.storageService.currentOrganizationId === -1) {
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

  onClick(organizationId: number): void {
    this.storageService.currentOrganizationId = organizationId;
  }
}
