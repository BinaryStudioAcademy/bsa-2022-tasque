import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'tasque-organizations-dropdown',
  templateUrl: './organizations-dropdown.component.html',
  styleUrls: ['./organizations-dropdown.component.sass']
})
export class OrganizationsDropdownComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  private selectedOrganization$ = new BehaviorSubject<string>(this.selectedOrganization);

  set selectedOrganization(value: string) {
    this.selectedOrganization$.next(value);
    localStorage.setItem('selectedOrganization', value);
  }

  get selectedOrganization(): string {
    return localStorage.getItem('selectedOrganization') ?? 'None';
  }

  @Input() public availableOrganizations: string[] = [];

  onClick(organization: string): void {
    this.selectedOrganization = organization;
  }
}
