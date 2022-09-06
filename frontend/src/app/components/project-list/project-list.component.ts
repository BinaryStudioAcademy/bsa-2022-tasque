import { Component, OnInit } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ProjectInfoModel } from 'src/core/models/project/project-info-model';
import { ProjectModel } from 'src/core/models/project/project-model';
import { UserModel } from 'src/core/models/user/user-model';
import { GetCurrentOrganizationService } from 'src/core/services/get-current-organization.service';
import { ProjectService } from 'src/core/services/project.service';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.sass']
})
export class ProjectListComponent implements OnInit {

  public currentUser: UserModel;

  public inputSearch = '';
  public searchIcon = faMagnifyingGlass;

  public projects: ProjectInfoModel[] = [];
  public items: ProjectModel[] = [];


  public itemsShow = this.projects;

  constructor(public projectService: ProjectService, 
    private currentOrganization: GetCurrentOrganizationService,
    private currentUserService: GetCurrentUserService) {
    this.currentUserService.currentUser.subscribe((res) => {
      this.currentUser = res as UserModel;
    });
  }

  ngOnInit(): void {
    this.projectService.getAllProjectsOfThisOrganization(this.currentOrganization.currentOrganizationId).subscribe((data) => {
      if(data.body) {
        this.projects = data.body;
        this.itemsShow = this.projects;
      }
    });   
  }

  filterItems(): void {
    if (this.inputSearch) {
      this.itemsShow = this.projects.filter((item) => {
        return item.name.toLowerCase().includes(this.inputSearch.toLowerCase());
      });
    }
    else {
      this.itemsShow = this.projects;
    }
  }

}
