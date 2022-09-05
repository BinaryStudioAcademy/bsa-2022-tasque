import { Component, OnInit } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { UserModel } from 'src/core/models/user/user-model';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';
import { NotificationService } from 'src/core/services/notification.service';
import { ProjectModel } from '../../../core/models/project/project-model';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.sass']
})
export class ProjectListComponent implements OnInit {
  public currentUser: UserModel;

  public inputSearch = '';
  public searchIcon = faMagnifyingGlass;

  public items: ProjectModel[] = [
    {
      id: 1,
      name: 'Tasque',
      authorId: 2,
      organizationId: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    },
    {
      id: 2,
      name: 'Youtube',
      authorId: 1,
      organizationId: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    },
    {
      id: 3,
      name: 'Facebook',
      authorId: 1,
      organizationId: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    },
    {
      id: 4,
      name: 'Twitch',
      authorId: 1,
      organizationId: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    },
    {
      id: 5,
      name: 'AWS',
      authorId: 1,
      organizationId: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    },
    {
      id: 6,
      name: 'Dia',
      authorId: 1,
      organizationId: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    },
    {
      id: 7,
      name: 'Spotify',
      authorId: 1,
      organizationId: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    },
    {
      id: 8,
      name: 'Google Chrome',
      authorId: 1,
      organizationId: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    },
  ];

  public itemsShow = this.items;

  constructor(
    private currentUserService: GetCurrentUserService,
    private notificationService: NotificationService,
  ) { 
    this.currentUserService.currentUser.subscribe((res) => {
      this.currentUser = res as UserModel;
    }, () => {
      this.notificationService.error('Something go wrong, try again');
    });
  }

  ngOnInit(): void {
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

}
