import { Component, Input, OnInit } from '@angular/core';
import { ProjectInfoModel } from 'src/core/models/project/project-info-model';

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.sass']
})
export class ProjectListItemComponent implements OnInit {

  @Input()
  public project: ProjectInfoModel

  constructor() { }

  ngOnInit(): void {
  }

}
