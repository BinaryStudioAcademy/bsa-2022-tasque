import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from 'src/core/models/user/user-model';

@Component({
  selector: 'tasque-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.sass']
})
export class AvatarComponent implements OnInit {

  @Input()
  diameter_px!: number;

  @Input()
  alt: string;

  @Input()
  user: UserModel;

  userAvatar: string;

  fontSize: number;

  constructor() { }

  ngOnInit(): void {
    this.fontSize = this.diameter_px / 2;
    if(this.user.avatarURL === undefined) {
      this.userAvatar = '';
    } else {
        this.userAvatar = this.user.avatarURL as string;
    }
  }

  getInitials(user: UserModel): string {
    if(user.name !== undefined && user.name?.includes(' ')) {

      const partsOfName = user.name.split(' ');
      if (partsOfName.length >= 2) {
        return partsOfName[0][0] + partsOfName[1][0];
      }

      return partsOfName[0][0];
    } else if(user.name !== undefined) {
      return user.name.charAt(0);
    } 
    return '';
  }
}
