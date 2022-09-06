import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectInfoModel } from 'src/core/models/project/project-info-model';
import { UserModel } from 'src/core/models/user/user-model';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.sass']
})
export class ProjectListItemComponent implements OnInit {

  @Input() public project: ProjectInfoModel;

  public user: UserModel;

  constructor(public router: Router, private currentUser: GetCurrentUserService) {
  }

  ngOnInit(): void {
    this.currentUser.currentUser.subscribe((data) => {
      if(data) {
        this.user = data;
      }
    });
  }

  openProjectBoard(): void {
    this.router.navigate(['/project/' + this.project.id.toString() + '/board']);
  }

  permissionToEdit(): boolean {
    if(this.user.id === this.project.authorId) {
      return true;
    }
    if (this.project.users.every((x) => { x.id == this.user.id && x.role === 1; })) {
      return true;
    }

    return false;
  }
}
