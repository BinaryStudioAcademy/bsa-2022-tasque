import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizationModel } from 'src/core/models/organization/organization-model';
import { ProjectInfoModel } from 'src/core/models/project/project-info-model';
import { UserModel } from 'src/core/models/user/user-model';
import { UserProjectRole } from 'src/core/models/user/user-project-roles';
import { UserRole } from 'src/core/models/user/user-roles';
import { GetCurrentOrganizationService } from 'src/core/services/get-current-organization.service';
import { GetCurrentProjectService } from 'src/core/services/get-current-project.service';
import { OrganizationService } from 'src/core/services/organization.service';
import { BusinessRole } from 'src/shared/components/select-users/Models';

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.sass'],
})
export class ProjectListItemComponent implements OnInit {
  @Input() public project: ProjectInfoModel;
  @Input() public currentUser: UserModel;

  public isCurrentUserAdmin = false;
  public isCurrentUserProjectAdmin = false;

  constructor(
    public router: Router,
    private currentProject: GetCurrentProjectService,
    private currentOrganizationService: GetCurrentOrganizationService,
    private organizationService: OrganizationService,
  ) {}

  ngOnInit(): void {
    this.permissionToEdit();
  }

  openProjectBoard(): void {
    this.currentProject.currentProjectId = this.project.id;
    this.router.navigate(['/project/' + this.project.id.toString() + '/board']);
  }

  permissionToEdit(): void {
    const organizationId =
      this.currentOrganizationService.currentOrganizationId;
    this.organizationService
      .getOrganization(organizationId)
      .subscribe((resp) => {
        const currentOrganization = resp.body as OrganizationModel;
        const role = this.currentUser.organizationRoles.find(
          (r) =>
            r.organizationId === organizationId &&
            r.userId === this.currentUser.id,
        )?.role as UserRole;
        if (
          role >= UserRole.projectAdmin ||
          currentOrganization.authorId === this.currentUser.id
        ) {
          this.isCurrentUserAdmin = true;
        } else {
          this.isCurrentUserAdmin = false;
        }

        const projectRole = this.currentUser.roles?.find(
          (r) =>
            r.projectId === this.project.id && r.userId === this.currentUser.id,
        ) as UserProjectRole;

        if (projectRole) {
          if (
            projectRole.roleId == BusinessRole.Admin ||
            this.isCurrentUserAdmin
          ) {
            this.isCurrentUserProjectAdmin = true;
          } else {
            this.isCurrentUserProjectAdmin = false;
          }
        }
      });
  }
}
