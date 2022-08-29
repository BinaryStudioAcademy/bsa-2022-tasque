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

  public projectsModel: ProjectInfoModel[] = [];

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
