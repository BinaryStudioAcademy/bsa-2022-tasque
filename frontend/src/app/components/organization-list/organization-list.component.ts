import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrganizationModel } from 'src/core/models/organization/organization-model';
import { UserModel } from 'src/entity-models/user-model';
import { CreateOrganizationDialogComponent } from '../create-organization/create-organization-dialog/create-organization-dialog.component';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.sass']
})
export class OrganizationListComponent implements OnInit {
  @Input() public currentUser: UserModel = {
    name: 'Login1',
    email: 'testlogin@gmail.com',
    id: 1,
    salt: 'Salt',
    password: 'Password'
  };

  public items: OrganizationModel[] = [
    {
      id: 1,
      name: 'Organization 1',
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 1,
      name: 'Organization 2',
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 1,
      name: 'Organization 3',
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  public inputSearch = '';
  public itemsShow = this.items;

  constructor(public matDialog: MatDialog) { }

  ngOnInit(): void { }

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

  openDialog(): void {
    const dialog = this.matDialog.open(CreateOrganizationDialogComponent, {
      data: this.currentUser,
      height: '400px',
    });
    dialog.afterClosed().subscribe();
  }
}
