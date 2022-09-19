import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ProjectModel } from 'src/core/models/project/project-model';
import { UserModel } from 'src/core/models/user/user-model';
import { UserRole } from 'src/core/models/user/user-roles';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';
import { ProjectService } from 'src/core/services/project.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/core/base/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.sass']
})
export class LeftSidebarComponent extends BaseComponent implements OnInit, OnChanges {
  public projectId: number;
  public project: ProjectModel;

  public currentUser: UserModel;
  public userRole: UserRole;

  public containerWidth: number;

  public sideBarMinimized: boolean;
  public showSettings = false;

  @Input() isChanged: Observable<void>;

  isBoard = false;
  isBacklog = false;
  isTeam = false;
  isWiki = false;
  isSettings = false;
  isColumnsAndStatuses = false;
  isIssueTypes = false;
  isIssueTemplate = false;
  isBasicIssueTemplate = false;

  selectedColor = '#F0F3F9';

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private currentUserService: GetCurrentUserService,
    private projectService: ProjectService) {
    super();
  }

  ngOnInit(): void {
    this.getProject();
    this.checkActivatedRoute();

    this.breakpointObserver
      .observe(['(max-width: 1200px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.containerWidth = 127;
          this.sideBarMinimized = true;
        } else {
          this.containerWidth = 252;
          this.sideBarMinimized = false;
        }
      });
  }

  ngOnChanges(): void {
    this.ngOnInit();
  }

  minimize(): void {
    this.sideBarMinimized = !this.sideBarMinimized;
    if (this.sideBarMinimized) {
      this.containerWidth = 127;
      return;
    }
    this.containerWidth = 252;
  }

  public getProject(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectId = parseInt(id);

      this.projectService.getProjectById(this.projectId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((resp) => {
          this.project = resp.body as ProjectModel;
          this.subsribeToCurrentUser();
        });
    }
  }

  public subsribeToCurrentUser(): void {
    this.currentUserService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.userRole = this.currentUser.organizationRoles.find(
        (r) => r.organizationId === this.project.organizationId,
      )?.role ?? UserRole.projectMember;
    });
  }

  navigateToIssueTemplate(): void {
    this.router.navigate(['project/' + this.projectId + '/settings/issue-template']);
    this.setAllStylesUndefined();
    this.isSettings = true;
    this.isIssueTemplate = true;
  }

  navigateToBasicIssueTemplate(): void {
    this.router.navigate(['project/' + this.projectId + '/settings/basic-issue-template']);
    this.setAllStylesUndefined();
    this.isSettings = true;
    this.isBasicIssueTemplate = true;
  }

  navigateToColumnsAndStatuses(): void {
    this.router.navigate(['project/' + this.projectId + '/settings/columns-and-statuses']);
    this.setAllStylesUndefined();
    this.isSettings = true;
    this.isColumnsAndStatuses = true;
  }

  navigateToIssueTypes(): void {
    this.router.navigate(['project/' + this.projectId + '/settings/issue-types']);
    this.setAllStylesUndefined();
    this.isSettings = true;
    this.isIssueTypes = true;
  }

  navigateToBoard(): void {
    this.router.navigate(['project/' + this.projectId + '/board']);
    this.setAllStylesUndefined();
    this.isBoard = true;
  }

  navigateToBacklog(): void {
    this.router.navigate(['project/' + this.projectId + '/backlog']);
    this.setAllStylesUndefined();
    this.isBacklog = true;
  }

  navigateToTeam(): void {
    this.router.navigate(['project/' + this.projectId + '/team']);
    this.setAllStylesUndefined();
    this.isTeam = true;
  }

  navigateToWiki(): void {
    this.router.navigate(['project/' + this.projectId + '/wiki']);
    this.setAllStylesUndefined();
    this.isWiki = true;
  }

  public toggleSettings(): void {
    this.showSettings = !this.showSettings;
  }

  public hideSettings(): void {
    if (this.showSettings) {
      this.showSettings = false;
    }
  }

  public isProjectAdmin(): boolean {
    return this.userRole >= 3 || this.project?.authorId === this.currentUser?.id;
  }

  checkActivatedRoute(): void {
    this.setAllStylesUndefined();

    const currentUrl = this.router.url.split('/');

    if (currentUrl.includes('settings')) {
      this.showSettings = true;
      switch (currentUrl[currentUrl.length - 1]) {
        case 'columns-and-statuses':
          this.isSettings = true;
          this.isColumnsAndStatuses = true;
          return;
        case 'issue-types':
          this.isSettings = true;
          this.isIssueTypes = true;
          return;
        case 'issue-template':
          this.isSettings = true;
          this.isIssueTemplate = true;
          return;
        case 'basic-issue-template':
          this.isSettings = true;
          this.isBasicIssueTemplate = true;
          return;
      }
    }

    switch (currentUrl[currentUrl.length - 1]) {
      case 'board':
        this.isBoard = true;
        return;
      case 'backlog':
        this.isBacklog = true;
        return;
      case 'team':
        this.isTeam = true;
        return;
      case 'wiki':
        this.isWiki = true;
        return;
    }
  }

  setAllStylesUndefined(): void {
    this.isBacklog = false;
    this.isBoard = false;
    this.isSettings = false;
    this.isTeam = false;
    this.isWiki = false;
    this.isColumnsAndStatuses = false;
    this.isIssueTypes = false;
    this.isIssueTemplate = false;
    this.isBasicIssueTemplate = false;
  }
}
