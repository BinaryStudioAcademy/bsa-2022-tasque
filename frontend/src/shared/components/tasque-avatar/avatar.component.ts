import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { UserModel } from 'src/core/models/user/user-model';

@Component({
  selector: 'tasque-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.sass'],
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

  colors = ['#D47500', '#00AA55', '#E3BC01', '#009FD4', '#B281B3', '#D47500', '#DC2929'];
  public background: string;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.fontSize = this.diameter_px
    ? this.diameter_px / 2
    : this.el.nativeElement.offsetWidth / 2.5;
    if(this.user === undefined || this.user.avatarURL === undefined) {
      this.userAvatar = '';
    } else {
        this.userAvatar = this.user.avatarURL as string;
    }
    if(this.user) {
      this.background = this.colors[this.user.id % this.colors.length];
    }
  }

  getInitials(user: UserModel): string {
    if(user === undefined) {
      return '';
    }
    if(user.name !== undefined && user.name?.includes(' ')) {

      const partsOfName = user.name.split(' ');
      if (partsOfName.length >= 2) {
        return (partsOfName[0][0] + partsOfName[1][0]).toLocaleUpperCase();
      }

      return partsOfName[0][0];
    } if(user.name !== undefined) {
      return user.name.charAt(0).toLocaleUpperCase();
    }
    return '';
  }
}
