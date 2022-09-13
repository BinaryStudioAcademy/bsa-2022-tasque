import { Component, OnInit } from '@angular/core';
import { OrganizationModel } from 'src/core/models/organization/organization-model';
import { UserModel } from 'src/core/models/user/user-model';
import {
  faMagnifyingGlass,
  faMessage,
} from '@fortawesome/free-solid-svg-icons';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';
import { BaseComponent } from 'src/core/base/base.component';
import { GetCurrentOrganizationService } from 'src/core/services/get-current-organization.service';
import { OpenDialogService } from 'src/core/services/open-dialog.service';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.sass'],
})
export class OrganizationListComponent extends BaseComponent implements OnInit {
  public currentUser: UserModel;

  public items: OrganizationModel[] = [];

  public warningIcon = faMessage;
  public inputSearch = '';
  public itemsShow: OrganizationModel[] = [];
  public faMagnifyingGlass = faMagnifyingGlass;

  constructor(
    private currentUserService: GetCurrentUserService,
    private getCurrentOrganizationService: GetCurrentOrganizationService,
    private openDialogService: OpenDialogService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.currentUserService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.currentUserService.currentUserId = this.currentUser.id;
    });

    this.getCurrentOrganizationService.organizations$.subscribe(
      (organizations) => {
        this.items = this.itemsShow = organizations;
      },
    );
  }

  filterItems(): void {
    if (this.inputSearch) {
      this.itemsShow = this.items.filter((item) => {
        return item.name.toLowerCase().includes(this.inputSearch.toLowerCase());
      });
    } else {
      this.itemsShow = this.items;
    }
  }

  openCreateOrganizationDialog(): void {
    this.openDialogService
      .openCreateOrganizationDialog(this.currentUser)
      .subscribe((result: OrganizationModel) => {
        if (!result) {
          return;
        }

        this.items.push(result);
        this.itemsShow = this.items;
        this.getCurrentOrganizationService.updateOrganization(result);
      });
  }
}
