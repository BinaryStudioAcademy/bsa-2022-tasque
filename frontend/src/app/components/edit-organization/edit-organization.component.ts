import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IBoard, IUserCard } from 'src/shared/components/select-users/Models';
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

  public user: IUserCard[] = [
    {
      email: 'test@email.com',
      username: 'username 1',
      profileURL: 'null',
      avatarURL: 'https://www.w3schools.com/howto/img_avatar.png',
      role: null,
    },
  ];

  public board: IBoard = {
    id: 1,
    type: 1,
    users: this.user,
    hasRoles: false,
  };
  ngOnInit(): void {}

  openDialog(): void {
    const dialog = this.matDialog.open(EditOrganizationDialogComponent);
    dialog.afterClosed().subscribe();
  }
}
