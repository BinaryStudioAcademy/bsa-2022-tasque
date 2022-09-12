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
  public searchIcon = faMagnifyingGlass;
  public showPopUp = false;

  //Show avatar of first user only
  @Input() miniView = false;

  @Input() public avatars: UserModel[] = [];

  public avatarsShow: UserModel[] = this.avatars;

  public profileColors: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.avatarsShow = this.avatars;
    this.generateColor();
  }

  generateColor(): void {
    for (let i = 0; i < this.avatarsShow.length; i++) {
      this.profileColors.push(
        '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
      );
    }
  }

  filterItems(): void {
    this.avatarsShow = this.avatars.filter((avatar) => {
      return avatar.name.includes(this.inputSearch);
    });
  }

  selectUser(avatars: UserModel): void {
    this.selectedUser.emit(avatars);
  }
}
