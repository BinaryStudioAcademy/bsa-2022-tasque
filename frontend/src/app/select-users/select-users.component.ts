import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-users',
  templateUrl: './select-users.component.html',
  styleUrls: ['./select-users.component.sass']
})
export class SelectUsersComponent implements OnInit {

  public inputWidth = 683;
  public roles: string[] = ["Participant", "Admin", "Organizer"]

  constructor() { }

  ngOnInit(): void {
  }

}
