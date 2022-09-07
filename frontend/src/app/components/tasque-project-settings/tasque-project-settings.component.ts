import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectModel } from 'src/core/models/project/project-model';
import { UserModel } from 'src/core/models/user/user-model';
import { UserRole } from 'src/core/models/user/user-roles';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';
import { ProjectService } from 'src/core/services/project.service';

@Component({
  selector: 'app-tasque-project-settings',
  templateUrl: './tasque-project-settings.component.html',
  styleUrls: ['./tasque-project-settings.component.sass'],
})
export class TasqueProjectSettingsComponent implements OnInit {

  @Input() public projectId = 5; // TODO: Replace with number type when project page will be implemented 
  public project: ProjectModel;

  public columnButtonText = 'Column and statuses';
  public issueTypesText = 'Issue types';
  public issueTemplateText = 'Basic issue template';
  public currentUser: UserModel;
  public userRole: UserRole;

  constructor(
    public router: Router,
    private currentUserService: GetCurrentUserService,
    private projectService: ProjectService
  ) {
    this.projectService.getProjectById(this.projectId).subscribe((resp) => {
      this.project = resp.body as ProjectModel;
    });

    this.currentUserService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.userRole = this.currentUser.organizationRoles.find(
        (r) => r.organizationId === this.project.organizationId,
      )?.role as UserRole;
    });
  }

  ngOnInit(): void { }

  moveToIssueTemplates(): void {
    this.router.navigate(['project/issue-template']);
  }
}
