import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectInfoModel } from 'src/core/models/project/project-info-model';
import { Component, Input, OnInit } from '@angular/core';
import { ProjectModel } from 'src/core/models/project/project-model';
import { UserModel } from 'src/core/models/user/user-model';

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.sass']
})
export class ProjectListItemComponent implements OnInit {

  @Input() public project: ProjectInfoModel;
  @Input() public currentUser: UserModel;

  constructor(public router: Router) {
  }

  ngOnInit(): void {
  }

  openProjectBoard(): void {
    this.router.navigate(['/project/' + this.project.id.toString() + '/board']);
  }

  permissionToEdit(): boolean {
    if(this.currentUser.id === this.project.authorId) {
      return true;
    }
    if (this.project.users.every((x) => { x.id == this.currentUser.id && x.role === 1; })) {
      return true;
    }

    return false;
  }
}
