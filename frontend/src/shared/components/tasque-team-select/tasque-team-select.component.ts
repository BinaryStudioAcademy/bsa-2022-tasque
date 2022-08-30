import { Component, OnInit } from '@angular/core';
import { UserCircle } from './models';

@Component({
  selector: 'tasque-team-select',
  templateUrl: './tasque-team-select.component.html',
  styleUrls: ['./tasque-team-select.component.sass'],
})
export class TasqueTeamSelectComponent implements OnInit {
  public inputSearch = '';

  public showPopUp = false;

  public avatars: UserCircle[] = [
    // remove when integrated in component with data
    {
      email: 'petroporoshenko@gmail.com',
      username: 'Petro Poroshenko',
      profileURL: 'https://i.imgur.com/LqDUiIJ.jpeg',
      avatarURL: 'https://i.imgur.com/LqDUiIJ.jpeg',
    },
    {
      email: 'sibainu@gmail.com',
      username: 'Siba Inu',
      profileURL: 'https://i.imgur.com/LqDUiIJ.jpeg',
      avatarURL: 'https://i.imgur.com/9YDVogY.jpeg',
    },
    {
      email: 'lilyjohanson@gmail.com',
      username: 'Lily Johanson',
      profileURL: 'https://i.imgur.com/LqDUiIJ.jpeg',
      avatarURL: '',
    },
    {
      email: 'chelchelovich@gmail.com',
      username: 'Chel Chelovich',
      profileURL: 'https://i.imgur.com/LqDUiIJ.jpeg',
      avatarURL: 'https://i.imgur.com/8aXSW6B.jpeg',
    },
    {
      email: 'patrickbateman@gmail.com',
      username: 'Patrick Bateman',
      profileURL: 'https://i.imgur.com/LqDUiIJ.jpeg',
      avatarURL: 'https://i.imgur.com/th0HJEk.jpeg',
    },
    {
      email: 'meow@gmail.com',
      username: 'Meow',
      profileURL: 'https://i.imgur.com/LqDUiIJ.jpeg',
      avatarURL: 'https://i.imgur.com/Z6VrcMz.png',
    },
    {
      email: 'davidherrmann@gmail.com',
      username: 'David Herrmann',
      profileURL: 'https://i.imgur.com/LqDUiIJ.jpeg',
      avatarURL: '',
    },
    {
      email: 'jessieosborn@gmail.com',
      username: 'Jessie Osborn',
      profileURL: 'https://i.imgur.com/LqDUiIJ.jpeg',
      avatarURL: '',
    },
  ];

  public avatarsShow: UserCircle[] = this.avatars;

  public profileColors: string[] = [];

  constructor() {}

  ngOnInit(): void {
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
      return avatar.username.includes(this.inputSearch);
    });
  }
}
