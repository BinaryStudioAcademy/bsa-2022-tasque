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

  get fontSize(): number {
    return this.diameter_px
      ? this.diameter_px / 2
      : this.el.nativeElement.offsetWidth / 2.5;
  }

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
  }

  getInitials(user: UserModel): string {
    const partsOfName = user.name.split(' ');
    if (partsOfName.length >= 2) {
      return partsOfName[0][0] + partsOfName[1][0];
    }

    return partsOfName[0][0];
  }
}
