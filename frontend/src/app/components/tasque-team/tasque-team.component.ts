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
      avatarURL: 'https://api.tinyfox.dev/img?animal=fox',
      name: 'Test User',
      email: '',
      organizationRoles: [],
    },
    {
      id: 2,
      avatarURL: 'https://api.tinyfox.dev/img?animal=yeen',
      name: 'Test User 2',
      email: '',
      organizationRoles: [],
    },
    {
      id: 3,
      avatarURL: 'https://api.tinyfox.dev/img?animal=snek',
      name: 'Test User 3',
      email: '',
      organizationRoles: [],
    },
    {
      id: 4,
      avatarURL: 'https://api.tinyfox.dev/img?animal=poss',
      name: 'Test User 4',
      email: '',
      organizationRoles: [],
    },
    {
      id: 4,
      avatarURL: 'https://api.tinyfox.dev/img?animal=leo',
      name: 'Test User 5',
      email: '',
      organizationRoles: [],
    },
    {
      id: 4,
      avatarURL: 'https://api.tinyfox.dev/img?animal=serval',
      name: 'Test User 6',
      email: '',
      organizationRoles: [],
    },
    {
      id: 4,
      avatarURL: 'https://api.tinyfox.dev/img?animal=racc',
      name: 'Test User 7',
      email: '',
      organizationRoles: [],
    },
    {
      id: 1,
      avatarURL: 'https://api.tinyfox.dev/img?animal=bear',
      name: 'Test User 8',
      email: '',
      organizationRoles: [],
    },
    {
      id: 2,
      avatarURL: 'https://api.tinyfox.dev/img?animal=caracal',
      name: 'Test User 9',
      email: '',
      organizationRoles: [],
    },
    {
      id: 3,
      avatarURL: 'https://api.tinyfox.dev/img?animal=tig',
      name: 'Test User 10',
      email: '',
      organizationRoles: [],
    },
    {
      id: 4,
      avatarURL: 'https://api.tinyfox.dev/img?animal=puma',
      name: 'Test User 11',
      email: '',
      organizationRoles: [],
    },
    {
      id: 4,
      avatarURL: 'https://api.tinyfox.dev/img?animal=yote',
      name: 'Test User 12',
      email: '',
      organizationRoles: [],
    },
    {
      id: 4,
      avatarURL: 'https://api.tinyfox.dev/img?animal=jaguar',
      name: 'Test User 13',
      email: '',
      organizationRoles: [],
    },
    {
      id: 4,
      avatarURL: 'https://api.tinyfox.dev/img?animal=capy',
      name: 'Test User 14',
      email: '',
      organizationRoles: [],
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
      user.name?.toLowerCase().includes(val.toLowerCase()),
    );
  }
}
