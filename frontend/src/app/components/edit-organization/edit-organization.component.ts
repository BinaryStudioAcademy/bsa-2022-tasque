import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditOrganizationDialogComponent } from './edit-organization-dialog/edit-organization-dialog.component';

@Component({
  selector: 'app-edit-organization',
  templateUrl: './edit-organization.component.html',
  styleUrls: ['./edit-organization.component.sass'],
})
export class EditOrganizationComponent implements OnInit {
  constructor(public matDialog: MatDialog) {}

  public btnText = 'Create project';
  public btnClass = 'mini';

  ngOnInit(): void {}

  openDialog(): void {
    const dialog = this.matDialog.open(EditOrganizationDialogComponent);
    dialog.afterClosed().subscribe();
  }
}
