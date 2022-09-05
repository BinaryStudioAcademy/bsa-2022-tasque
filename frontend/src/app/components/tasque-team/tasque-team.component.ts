import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/core/models/user/user-model';

@Component({
  selector: 'app-tasque-team',
  templateUrl: './tasque-team.component.html',
  styleUrls: ['./tasque-team.component.sass'],
})
export class TasqueTeamComponent implements OnInit {
  public teamMembers: UserModel[] = [
    {
      id: 1,
      avatarURL:
        'https://img.freepik.com/free-vector/nature-scene-with-river-and-hills-forest-and-mountain-landscape-flat-cartoon-style-illustration_1150-37326.jpg',
      name: 'User 1',
      email: '',
    },
    {
      id: 2,
      avatarURL:
        '',
      name: 'User 2',
      email: '',
    },
    {
      id: 3,
      avatarURL:
        'https://img.freepik.com/free-vector/best-scene-nature-landscape-mountain-river-forest-with-sunset-evening-warm-tone-illustration_1150-39403.jpg',
      name: 'User 3',
      email: '',
    },
    {
      id: 4,
      avatarURL:
        'https://images.unsplash.com/photo-1484591974057-265bb767ef71?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80',
      name: 'User 1',
      email: '',
    },
    {
      id: 4,
      name: 'User 1',
      email: '',
    },
    {
      id: 4,
      name: 'User 1',
      email: '',
    },
    {
      id: 4,
      name: 'User 1',
      email: '',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
