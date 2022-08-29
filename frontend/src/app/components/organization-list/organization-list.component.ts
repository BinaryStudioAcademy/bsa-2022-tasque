import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrganizationModel } from 'src/core/models/organization/organization-model';
import { OrganizationService } from 'src/core/services/organization.service';
import { UserModel } from 'src/core/models/user/user-model';
import { CreateOrganizationDialogComponent } from '../create-organization/create-organization-dialog/create-organization-dialog.component';
import { takeUntil } from 'rxjs/operators';
import { faMagnifyingGlass, faMessage } from '@fortawesome/free-solid-svg-icons';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';
import { BaseComponent } from 'src/core/base/base.component';
import { GetCurrentOrganizationService } from 'src/core/services/get-current-organization.service';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.sass']
})
export class OrganizationListComponent extends BaseComponent implements OnInit {
  public currentUser: UserModel = {
    id: 0,
    name: '',
    email: ''
  };

  public items: OrganizationModel[] = [];

  public warningIcon = faMessage;
  public inputSearch = '';
  public itemsShow: OrganizationModel[];
  public faMagnifyingGlass = faMagnifyingGlass;

  constructor(
    private currentUserService: GetCurrentUserService,
    private matDialog: MatDialog,
    private organizationService: OrganizationService,
    private getCurrentOrganizationService: GetCurrentOrganizationService) {
    super();
  }

  ngOnInit(): void {
    this.currentUserService.currentUser.subscribe((user) => {
      this.currentUser = user as UserModel;

      this.organizationService.getUserOrganizations(this.currentUser.id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (result) => {
            if (result.body) {
              this.items = result.body;
              this.itemsShow = this.items;
            }
          },
          (error) => {
            if (error.status === 400) {
              this.items = this.itemsShow = [];
            }
          });
    });
  }

  filterItems(): void {
    if (this.inputSearch) {
      this.itemsShow = this.items.filter((item) => {
        return item.name.toLowerCase().includes(this.inputSearch.toLowerCase());
      });
    }
    else {
      this.itemsShow = this.items;
    }
  }

  openCreateOrganizationDialog(): void {
    const dialog = this.matDialog.open(CreateOrganizationDialogComponent, {
      data: this.currentUser,
    });
    dialog.afterClosed().subscribe((result: OrganizationModel) => {

      this.items.push(result);
      this.itemsShow = this.items;
      this.getCurrentOrganizationService.updateOrganizations(result);
    }
    );
  }
}
