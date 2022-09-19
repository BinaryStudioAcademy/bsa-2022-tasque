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

  isBoard: string | undefined;
  isBacklog: string | undefined;
  isTeam: string | undefined;
  isWiki: string | undefined;
  isSettings: string | undefined;

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

  navigateToIssueTemplate():void {
    this.router.navigate(['project/' + this.projectId + '/settings/issue-template']);
    this.setAllStylesUndefined();
    this.isSettings = '#F0F3F9';
  }

  navigateToBoard():void {
    this.router.navigate(['project/' + this.projectId + '/board']);
    this.setAllStylesUndefined();
    this.isBoard = '#F0F3F9';
  }

  navigateToBacklog():void {
    this.router.navigate(['project/' + this.projectId + '/backlog']);
    this.setAllStylesUndefined();
    this.isBacklog = '#F0F3F9';
  }

  navigateToTeam():void {
    this.router.navigate(['project/' + this.projectId + '/team']);
    this.setAllStylesUndefined();
    this.isTeam = '#F0F3F9';
  }

  navigateToWiki():void {
    this.router.navigate(['project/' + this.projectId + '/wiki']);
    this.setAllStylesUndefined();
    this.isWiki = '#F0F3F9';
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

    if(this.router.url.includes('board')) {
      this.isBoard = '#F0F3F9';
    } else if(this.router.url.includes('backlog')) {
      this.isBacklog = '#F0F3F9';
    } else if(this.router.url.includes('wiki')) {
      this.isWiki = '#F0F3F9';
    } else if(this.router.url.includes('settings')) {
      this.isSettings = '#F0F3F9';
    } else if(this.router.url.includes('team')) {
      this.isTeam = '#F0F3F9';
    }
  }

  setAllStylesUndefined(): void {
    this.isBacklog = undefined;
    this.isBoard = undefined;
    this.isSettings = undefined;
    this.isTeam = undefined;
    this.isWiki = undefined;
  }
}
