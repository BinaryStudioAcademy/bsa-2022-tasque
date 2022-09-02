import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from 'src/core/models/user/user-model';
import { OrganizationModel } from 'src/core/models/organization/organization-model';
import { Router } from '@angular/router';
import { GetCurrentOrganizationService } from 'src/core/services/get-current-organization.service';

@Component({
  selector: 'app-organization-list-item',
  templateUrl: './organization-list-item.component.html',
  styleUrls: ['./organization-list-item.component.sass']
})
export class OrganizationListItemComponent implements OnInit {
  @Input() public currentUser: UserModel;
  @Input() public organization: OrganizationModel;

  constructor(
    private router: Router,
    private getCurrentOrganizationService: GetCurrentOrganizationService
  ) { }

  ngOnInit(): void { }

<<<<<<< HEAD
=======
  public openOrganization(): void {
    this.getCurrentOrganizationService.currentOrganizationId = this.organization.id;
    this.router.navigate(['projects'], { replaceUrl: true });
    window.scroll(0, 0);
  }
>>>>>>> dev
}
