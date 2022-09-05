import { Component, Input, OnInit } from '@angular/core';
import { ProjectModel } from 'src/core/models/project/project-model';
import { UserModel } from 'src/core/models/user/user-model';

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.sass']
})
export class ProjectListItemComponent implements OnInit {

  @Input() public currentUser: UserModel;
  @Input() public project: ProjectModel;

  constructor() { }

  ngOnInit(): void {
  }
}
