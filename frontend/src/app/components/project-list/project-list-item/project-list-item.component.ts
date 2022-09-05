import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectInfoModel } from 'src/core/models/project/project-info-model';
import { UserModel } from 'src/core/models/user/user-model';

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.sass']
})
export class ProjectListItemComponent implements OnInit {

  @Input() public currentUser: UserModel;
  @Input() public project: ProjectInfoModel;

  public projectForEdit: ProjectInfoModel;

  constructor(public router: Router) {
  }

  ngOnInit(): void {
  }

  openProjectBoard(): void {
    this.router.navigate(['/project/' + this.project.id.toString() + '/board']);
  }
}
