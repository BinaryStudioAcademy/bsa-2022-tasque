import { Component, OnInit } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ProjectInfoModel } from 'src/core/models/project/project-info-model';
import { UserModel } from 'src/core/models/user/user-model';
import { ProjectService } from 'src/core/services/project.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.sass']
})
export class ProjectListComponent implements OnInit {
  
  public currentUser: UserModel = {
    id: 1,
    name: 'tester',
    email: 'tester@gmail.com'
  };

  public inputSearch = '';
  public searchIcon = faMagnifyingGlass;

<<<<<<< HEAD
  public projectsModel: ProjectInfoModel[] = [];
=======
  public items: ProjectModel[] = [
    {
      id: 1,
      name: 'Tasque',
      authorId: 1,
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
>>>>>>> dev

  public itemsShow = this.projectsModel;

  constructor(public projectService: ProjectService) { 
  }

  ngOnInit(): void {
    this.projectService.getAllProjectsOfThisOrganization(1).subscribe((data) => {
      if(data.body) {
        this.projectsModel = data.body;
        this.itemsShow = this.projectsModel;
      }
    });
  }

  filterItems(): void {
    if (this.inputSearch) {
      this.itemsShow = this.projectsModel.filter((item) => {
        return item.name.toLowerCase().includes(this.inputSearch.toLowerCase());
      });
    }
    else {
      this.itemsShow = this.projectsModel;
    }
  }

}
