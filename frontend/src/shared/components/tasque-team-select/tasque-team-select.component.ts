import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/core/models/user/user-model';

@Component({
  selector: 'tasque-team-select',
  templateUrl: './tasque-team-select.component.html',
  styleUrls: ['./tasque-team-select.component.sass']
})
export class TasqueTeamSelectComponent implements OnInit {

  public inputSearch = '';

  public showPopUp = false;

  public avatars: UserModel[] = [ // remove when integrated in component with data
    {
      id: 1,
      email: 'petroporoshenko@gmail.com',
      name: 'Petro Poroshenko',
      avatarURL: 'https://i.imgur.com/LqDUiIJ.jpeg',
    },
    {
      id: 2,
      email: 'sibainu@gmail.com',
      name: 'Siba Inu',
      avatarURL: 'https://i.imgur.com/9YDVogY.jpeg',
    },
    {
      id: 3,
      email: 'lilyjohanson@gmail.com',
      name: 'Lily Johanson',
      avatarURL: '',
    },
    {
      id: 4,
      email: 'chelchelovich@gmail.com',
      name: 'Chel Chelovich',
      avatarURL: 'https://i.imgur.com/8aXSW6B.jpeg',
    },
    {
      id: 5,
      email: 'patrickbateman@gmail.com',
      name: 'Patrick Bateman',
      avatarURL: 'https://i.imgur.com/th0HJEk.jpeg',
    },
    {
      id: 6,
      email: 'meow@gmail.com',
      name: 'Meow',
      avatarURL: 'https://i.imgur.com/Z6VrcMz.png',
    },
    {
      id: 7,
      email: 'davidherrmann@gmail.com',
      name: 'David Herrmann',
      avatarURL: '',
    },
    {
      id: 8,
      email: 'jessieosborn@gmail.com',
      name: 'Jessie Osborn',
      avatarURL: '',
    },
  ];

  public avatarsShow: UserModel[] = this.avatars;

  public profileColors: string[] = [];

  constructor() {

  }

  ngOnInit(): void {
    this.generateColor();
  }

  generateColor(): void {
    for(let i = 0; i < this.avatarsShow.length; i++) {
      this.profileColors.push('#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6));
    }
  }

  filterItems(): void{
    this.avatarsShow = this.avatars.filter((avatar) => {
      return avatar.name.includes(this.inputSearch);
    });
  }

}
