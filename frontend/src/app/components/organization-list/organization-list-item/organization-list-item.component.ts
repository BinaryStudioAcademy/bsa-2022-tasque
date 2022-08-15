import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from 'src/core/models/user/user-model';
import { OrganizationModel } from 'src/entity-models/organization-model';

@Component({
  selector: 'app-organization-list-item',
  templateUrl: './organization-list-item.component.html',
  styleUrls: ['./organization-list-item.component.sass']
})
export class OrganizationListItemComponent implements OnInit {
  @Input() public currentUser: UserModel = {
    name: 'Login1',
    email: 'testlogin@gmail.com',
    id: 1,
    salt: 'Salt',
    password: 'Password'
  };
  @Input() public organization: OrganizationModel;

  constructor() { }

  ngOnInit(): void { }
}
