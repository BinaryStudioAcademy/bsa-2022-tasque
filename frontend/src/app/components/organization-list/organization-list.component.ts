import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { OrganizationModel } from 'src/core/models/organization/organization-model';
import { OrganizationService } from 'src/core/services/organization.service';
import { UserModel } from 'src/core/models/user/user-model';
import { CreateOrganizationDialogComponent } from '../create-organization/create-organization-dialog/create-organization-dialog.component';
import { takeUntil } from 'rxjs/operators';
import {
  faMagnifyingGlass,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.sass'],
})
export class OrganizationListComponent implements OnInit {
  @Input() public currentUser: UserModel = {
    name: 'Login1',
    email: 'testlogin@gmail.com',
    id: 2,
  };

  public items: OrganizationModel[] = [
    {
      id: 1,
      name: 'Organization 1',
      authorId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Organization 2',
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: 'Organization 3',
      authorId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 4,
      name: 'Organization 2',
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 5,
      name: 'Organization 3',
      authorId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 6,
      name: 'Organization 2',
      authorId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 7,
      name: 'Organization 3',
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 8,
      name: 'Organization 2',
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 9,
      name: 'Organization 3',
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  public inputSearch = '';
  public itemsShow: OrganizationModel[] = this.items;
  public unsubscribe$ = new Subject<void>();
  public faMagnifyingGlass: IconDefinition = faMagnifyingGlass;

  constructor(
    private matDialog: MatDialog,
    private organizationService: OrganizationService,
  ) {}

  ngOnInit(): void {
    this.organizationService
      .getUserOrganizations(this.currentUser.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.items = result.body;
          this.itemsShow = this.items;
        }
      });
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

  openDialog(): void {
    const dialog = this.matDialog.open(CreateOrganizationDialogComponent, {
      data: this.currentUser,
    });
    dialog.afterClosed().subscribe();
  }
}
