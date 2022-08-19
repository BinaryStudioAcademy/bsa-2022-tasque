import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-organization-dialog',
  templateUrl: './edit-organization-dialog.component.html',
  styleUrls: ['./edit-organization-dialog.component.sass'],
})
export class EditOrganizationDialogComponent implements OnInit {
  constructor() {}

  public createBtnName = 'Create';
  public btnClass = 'mini';
  public cancelBtnName = 'Cancel';
  public inputClass = 'input';
  public placeholderText = 'Write organization name';
  public inputType = 'text';
  public inputLabel = 'Organization name';

  ngOnInit(): void {}
}
