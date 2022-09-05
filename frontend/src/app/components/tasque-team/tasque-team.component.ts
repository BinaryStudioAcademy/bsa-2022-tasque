import { Component, OnInit } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { UserModel } from 'src/core/models/user/user-model';

@Component({
  selector: 'app-tasque-team',
  templateUrl: './tasque-team.component.html',
  styleUrls: ['./tasque-team.component.sass'],
})
export class TasqueTeamComponent implements OnInit {
  icon = faMagnifyingGlass;

  public loaded: UserModel[] = [
    {
      id: 1,
      avatarURL:
        'https://img.freepik.com/free-vector/nature-scene-with-river-and-hills-forest-and-mountain-landscape-flat-cartoon-style-illustration_1150-37326.jpg',
      name: 'Test User',
      email: '',
    },
    {
      id: 2,
      avatarURL: '',
      name: 'Test User 2',
      email: '',
    },
    {
      id: 3,
      avatarURL:
        'https://img.freepik.com/free-vector/best-scene-nature-landscape-mountain-river-forest-with-sunset-evening-warm-tone-illustration_1150-39403.jpg',
      name: 'Test User 3',
      email: '',
    },
    {
      id: 4,
      name: 'Test User 4',
      email: '',
    },
    {
      id: 4,
      name: 'Test User 5',
      email: '',
    },
    {
      id: 4,
      avatarURL:
        'https://images.unsplash.com/photo-1484591974057-265bb767ef71?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80',
      name: 'Test User 6',
      email: '',
    },
    {
      id: 4,
      name: 'Test User 7',
      email: '',
    },
    {
      id: 1,
      avatarURL:
        'https://img.freepik.com/free-vector/nature-scene-with-river-and-hills-forest-and-mountain-landscape-flat-cartoon-style-illustration_1150-37326.jpg',
      name: 'Test User 8',
      email: '',
    },
    {
      id: 2,
      avatarURL: '',
      name: 'Test User 9',
      email: '',
    },
    {
      id: 3,
      avatarURL:
        'https://img.freepik.com/free-vector/best-scene-nature-landscape-mountain-river-forest-with-sunset-evening-warm-tone-illustration_1150-39403.jpg',
      name: 'Test User 10',
      email: '',
    },
    {
      id: 4,
      name: 'Test User 11',
      email: '',
    },
    {
      id: 4,
      name: 'Test User 12',
      email: '',
    },
    {
      id: 4,
      avatarURL:
        'https://images.unsplash.com/photo-1484591974057-265bb767ef71?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80',
      name: 'Test User 13',
      email: '',
    },
    {
      id: 4,
      name: 'Test User 14',
      email: '',
    },
  ];
  public visible: UserModel[];

  constructor() {}

  ngOnInit(): void {
    //TODO: Load team members here
    this.visible = this.loaded;
  }

  public filter(val: string): void {
    this.visible = this.loaded.filter((user) =>
      user.name.toLowerCase().includes(val.toLowerCase()),
    );
  }
}
