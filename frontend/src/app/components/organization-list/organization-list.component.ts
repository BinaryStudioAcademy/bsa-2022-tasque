import { Component, OnInit } from '@angular/core';
import { OrganizationModel } from 'src/core/models/organization/organization-model';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.sass']
})
export class OrganizationListComponent implements OnInit {
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

  constructor() { }

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
}
