import { Component, OnInit } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ProjectInfoModel } from 'src/core/models/project/project-info-model';
import { ProjectService } from 'src/core/services/project.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.sass']
})
export class ProjectListComponent implements OnInit {

  public inputSearch = '';
  public searchIcon = faMagnifyingGlass;

  public items: ProjectInfoModel[] = [];

  public itemsShow = this.items;

  constructor(public projectService: ProjectService) { }

  ngOnInit(): void {
    this.projectService.getAllProjectsOfThisOrganization(1).subscribe(data => {
      if(data.body) {
        this.items = data.body;
        this.itemsShow = this.items;
      }
    })
  }

  filterItems(): void{
    this.itemsShow = this.items.filter((item) => {
      return item.name.includes(this.inputSearch);
    });
  }

}
