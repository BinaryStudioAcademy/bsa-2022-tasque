import { Component, Input, OnInit } from '@angular/core';
import { StorageService } from 'src/core/services/storage.service';
import { OrganizationModel } from 'src/entity-models/organization-model';

@Component({
  selector: 'tasque-organizations-dropdown',
  templateUrl: './organizations-dropdown.component.html',
  styleUrls: ['./organizations-dropdown.component.sass']
})
export class OrganizationsDropdownComponent implements OnInit {
  public currentOrganization: OrganizationModel = {
    id: -1,
    name: 'None',
    authorId: -1
  };

  constructor(private storageService: StorageService) {
    // make request for current organization
  }

  ngOnInit(): void {
    this.storageService.currentOrganizationId$.subscribe(
      (result) => {
        const searchedOrganization = this.availableOrganizations.find((x) => x.id == result);
        if (searchedOrganization) {
          this.currentOrganization = searchedOrganization;
        }
        else {
          // eslint-disable-next-line no-console
          console.log('error');
        }
      });
  }

  @Input() public availableOrganizations: OrganizationModel[] = [];

  onClick(organizationId: number): void {
    this.storageService.currentOrganizationId = organizationId;
  }
}
