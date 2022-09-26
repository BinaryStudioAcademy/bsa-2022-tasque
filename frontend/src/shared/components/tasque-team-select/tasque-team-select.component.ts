import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserModel } from 'src/core/models/user/user-model';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'tasque-team-select',
  templateUrl: './tasque-team-select.component.html',
  styleUrls: ['./tasque-team-select.component.sass'],
})
export class TasqueTeamSelectComponent implements OnInit {
  public inputSearch = '';
  //Notify the parent component when the avatar is clicked and pass the selected user to it
  @Output() selectedUser = new EventEmitter<UserModel>();
  @Input() selectedUserId: number;
  public searchIcon = faMagnifyingGlass;
  public showPopUp = false;
  @Input() canPopUp = true;

  //Show avatar of first user only
  @Input() miniView = false;
  @Input() miniViewDiameter: number;
  @Input() public avatars: UserModel[] = [];

  public avatarsShow: UserModel[] = this.avatars;

  constructor() { }

  ngOnInit(): void {
    this.avatarsShow = this.avatars;
    if (!this.miniViewDiameter) {
      this.miniViewDiameter = 40;
    }
  }

  filterItems(): void {
    this.avatarsShow = this.avatars.filter((avatar) => {
      return avatar.name
        .toLocaleLowerCase()
        .includes(this.inputSearch.toLocaleLowerCase());
    });
  }

  selectUser(user: UserModel): void {
    if (this.selectedUserId != user.id) {
      this.selectedUserId = user.id;
      this.selectedUser.emit(user);
    } else {
      this.selectedUserId = 0;
      this.selectedUser.emit({
        ...user,
        id: -1
      });
    }
  }

  switchPopUp(): void {
    if (this.canPopUp && !this.showPopUp) {
      this.openPopUp();
    }
    else {
      this.closePopUp();
    }
  }

  openPopUp(): void {
    this.avatarsShow = this.avatars;
    this.showPopUp = true;
  }

  closePopUp(): void {
    if (this.showPopUp) {
      this.showPopUp = false;
      this.inputSearch = '';
    }
  }
}
