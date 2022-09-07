import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCaretDown, faCaretUp, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { OrganizationModel } from 'src/core/models/organization/organization-model';
import { UserModel } from 'src/core/models/user/user-model';
import { AuthService } from 'src/core/services/auth.service';
import { OpenDialogService } from 'src/core/services/open-dialog.service';
import { GetCurrentOrganizationService } from 'src/core/services/get-current-organization.service';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';

@Component({
  selector: 'tasque-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  public searchIcon = faMagnifyingGlass;
  public currentUser: UserModel;
  public currentOrganizationId: number;

  public upArrowIcon = faCaretUp;
  public downArrowIcon = faCaretDown;

  constructor(
    private getCurrentUserService: GetCurrentUserService,
    private authService: AuthService,
    private router: Router,
    private openDialogService: OpenDialogService,
    private getCurrentOrganizationService: GetCurrentOrganizationService
  ) { }

  ngOnInit(): void {
    this.subscribeToCurrentUser();
    this.subscribeToCurrentOrganization();

    this.getCurrentUserService.userAvatarUpdated$.subscribe((avatar) => {
      this.currentUser.avatarURL = avatar;
    });
  }

  private subscribeToCurrentOrganization(): void {
    this.getCurrentOrganizationService.currentOrganizationId$.subscribe(
      (result) => {
        this.currentOrganizationId = result;
      });
  }

  public subscribeToCurrentUser(): void {
    this.getCurrentUserService.currentUser$.subscribe((user) => {
      if (!user) {
        return;
      }

      this.currentUser = user;
    });
  }

  openCreateOrganizationDialog(): void {
    this.openDialogService.openCreateOrganizationDialog(this.currentUser)
      .subscribe((result: OrganizationModel) => {
        if (!result) {
          return;
        }

        this.getCurrentOrganizationService.updateOrganizations(result);
      });
  }

  public openCreateProjectDialog(): void {
    this.openDialogService.openCreateProjectDialog(this.currentOrganizationId)
      .subscribe((result) => {
        if (!result) {
          return;
        }
      });
  }

  get currentUserAvatar(): string {
    if (!this.currentUser || !this.currentUser.avatarURL) {
      return '\\assets\\avatar.png';
    }

    return this.currentUser.avatarURL;
  }

  public openProjectsPage(): void {
    this.router.navigate(['/projects'], { replaceUrl: true });
    window.scroll(0, 0);
  }

  public logoutClick(): void {
    this.authService.logout();
  }

  public profileSettingsClick(): void {
    this.router.navigate(['/user/profile'], { replaceUrl: true });
  }

  public manageMyProjectsClick(): void {
    this.router.navigate(['/projects'], { replaceUrl: true });
  }
}
