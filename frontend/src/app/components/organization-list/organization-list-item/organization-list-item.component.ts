import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from 'src/core/models/user/user-model';
import { OrganizationModel } from 'src/core/models/organization/organization-model';

@Component({
  selector: 'app-organization-list-item',
  templateUrl: './organization-list-item.component.html',
  styleUrls: ['./organization-list-item.component.sass']
})
export class OrganizationListItemComponent implements OnInit {
  @Input() public currentUser: UserModel;
  @Input() public organization: OrganizationModel;

  constructor() { }

  ngOnInit(): void { }
}
