import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ProjectModel } from 'src/core/models/project/project-model';
import { UserModel } from 'src/core/models/user/user-model';
import { UserRole } from 'src/core/models/user/user-roles';

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.sass']
})
export class ProjectListItemComponent implements OnInit, OnChanges {

  @Input() public currentUser: UserModel;
  @Input() public project: ProjectModel;
  public role: UserRole;

  constructor() { }

  ngOnInit(): void {
    if(this.currentUser === undefined) {
      this.role = 0;
    } else {
      this.role = this.currentUser.organizationRoles
        .find((m) => m.organizationId === this.project.organizationId)?.role as UserRole;
    }
  }

  ngOnChanges(): void {
    if(this.currentUser === undefined) {
      this.role = 0;
    } else {
      this.role = this.currentUser.organizationRoles
        .find((m) => m.organizationId === this.project.organizationId)?.role as UserRole;
    }
  }
}
