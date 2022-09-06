import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCaretDown, faCaretUp, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { UserModel } from 'src/core/models/user/user-model';
import { AuthService } from 'src/core/services/auth.service';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';

@Component({
  selector: 'tasque-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  public searchIcon = faMagnifyingGlass;
  public currentUser: UserModel = { id: 1, name: 'John Doe', email: 'johndoe@gmail.com' };

  public upArrowIcon = faCaretUp;
  public downArrowIcon = faCaretDown;

  constructor(
    private currentUserService: GetCurrentUserService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUserService.currentUser.subscribe((user) => {
      this.currentUser = user as UserModel;
    });

    this.currentUserService.userAvatarUpdated$.subscribe((avatar) => {
      this.currentUser.avatarURL = avatar;
    });
  }

  public openCreateTaskDialog(): void { }

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
