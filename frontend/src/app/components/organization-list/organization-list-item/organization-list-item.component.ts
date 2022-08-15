import { Component, Input, OnInit } from '@angular/core';
import { OrganizationModel } from 'src/entity-models/organization-model';

@Component({
  selector: 'app-organization-list-item',
  templateUrl: './organization-list-item.component.html',
  styleUrls: ['./organization-list-item.component.sass']
})
export class OrganizationListItemComponent implements OnInit {
  @Input() public organization: OrganizationModel;

  constructor() { }

  ngOnInit(): void { }
}
