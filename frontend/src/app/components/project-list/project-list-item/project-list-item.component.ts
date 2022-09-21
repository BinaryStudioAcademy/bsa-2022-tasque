import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectInfoModel } from 'src/core/models/project/project-info-model';
import { UserModel } from 'src/core/models/user/user-model';
import { UserRole } from 'src/core/models/user/user-roles';
import { GetCurrentProjectService } from 'src/core/services/get-current-project.service';

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.sass']
})
export class ProjectListItemComponent implements OnInit {

  @Input() public project: ProjectInfoModel;
  @Input() public currentUser: UserModel;

  constructor(
    public router: Router, 
    private currentProject: GetCurrentProjectService
  ) { }

  ngOnInit(): void {
  }

  openProjectBoard(): void {
    this.currentProject.currentProjectId = this.project.id;
    this.router.navigate(['/project/' + this.project.id.toString() + '/board']);
  }

  permissionToEdit(): boolean {
    const role = this.currentUser.organizationRoles
    .find((role) => role.organizationId === this.project.organizationId)?.role as UserRole;
    if(this.currentUser?.id === this.project.authorId || role >= 3) {
      return true;
    }
    if (this.project.users?.every((x) => { x.id == this.currentUser?.id && x.role === 1; })) {
      return true;
    }

    return false;
  }
}
