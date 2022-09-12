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
  public selectedUserId: number;
  public searchIcon = faMagnifyingGlass;
  public showPopUp = false;

  //Show avatar of first user only
  @Input() miniView = false;

  @Input() public avatars: UserModel[] = [];

  public avatarsShow: UserModel[] = this.avatars;

  constructor() {}

  ngOnInit(): void {}

  filterItems(): void {
    this.avatarsShow = this.avatars.filter((avatar) => {
      return avatar.name.toLocaleLowerCase().includes(this.inputSearch.toLocaleLowerCase());
    });
  }

  selectUser(user: UserModel): void {
    this.selectedUser.emit(user);
    if (this.selectedUserId != user.id){
      this.selectedUserId = user.id;
    }
    else {
      this.selectedUserId = 0;
    }
    
  }

  switchPopUp(): void {
    this.avatarsShow = this.avatars;
    this.showPopUp = !this.showPopUp;
  }
}
