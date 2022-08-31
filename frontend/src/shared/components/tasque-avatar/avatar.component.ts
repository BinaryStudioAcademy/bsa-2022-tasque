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

  fontSize: number;

  constructor() { }

  ngOnInit(): void {
    this.fontSize = this.diameter_px / 2;
    console.log(this.user);
  }

  getInitials(user: UserModel): string {
    let partsOfName = user.name.split(" ");
    if (partsOfName.length >= 2) {
      return partsOfName[0][0] + partsOfName[1][0];
    }
    else {
      return partsOfName[0][0];
    }
  }
}
