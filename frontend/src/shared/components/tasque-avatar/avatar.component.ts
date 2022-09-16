import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { UserModel } from 'src/core/models/user/user-model';

@Component({
  selector: 'tasque-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.sass'],
})
export class AvatarComponent implements OnInit {
  @Input()
  diameter_px: number = 40;

  @Input()
  alt: string;

  @Input()
  user!: UserModel;

  userAvatar: string | undefined;
  fontSize: number;

  colors = ['#D47500', '#00AA55', '#E3BC01', '#009FD4', '#B281B3', '#D47500', '#DC2929'];
  public background: string;

  constructor() { }

  ngOnInit(): void {
    this.fontSize = this.diameter_px / 2;
    
    this.userAvatar = this.user.avatarURL;
    
    this.background = this.colors[this.user.id % this.colors.length];
  }

  getInitials(user: UserModel): string {
    const partsOfName = user.name.split(/\s+/);

    if (partsOfName.length >= 2) {
      return (partsOfName[0][0] + partsOfName[1][0]).toLocaleUpperCase();
    }

    return partsOfName[0][0].toLocaleUpperCase();
  }
}
