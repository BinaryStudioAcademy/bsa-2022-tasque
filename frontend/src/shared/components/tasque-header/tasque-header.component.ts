import { Component, OnInit } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { UserModel } from 'src/core/models/user/user-model';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';

@Component({
  selector: 'tasque-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  public searchIcon = faMagnifyingGlass;
  public currentUser: UserModel;

  constructor(
    private currentUserService: GetCurrentUserService,
  ) { }

  ngOnInit(): void {
    this.currentUserService.currentUser.subscribe((user) => {
      this.currentUser = user as UserModel;
    });
  }
}
