import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OrganizationModel } from 'src/core/models/organization/organization-model';
import {
  BoardType,
  IBoard,
  IUserCard,
} from 'src/shared/components/select-users/Models';
import { EditOrganizationDialogComponent } from './edit-organization-dialog/edit-organization-dialog.component';

@Component({
  selector: 'app-edit-organization',
  templateUrl: './edit-organization.component.html',
  styleUrls: ['./edit-organization.component.sass'],
})
export class EditOrganizationComponent implements OnInit {
  @Input() public organization: OrganizationModel;
  public editOrganization: FormGroup = new FormGroup({});
  public organizationNameControl: FormControl;
  public organizationUsersControl: FormControl;
  public btnText = 'Create project';
  public btnClass = 'mini';
  public test = '';

  get organizationNameErrorMessage(): string {
    const ctrl = this.organizationNameControl;

    if (ctrl.errors?.['required']) {
      return 'Project is required';
    }
    return '';
  }

  constructor(public matDialog: MatDialog) {}

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
    type: BoardType.Organization,
    users: this.user,
    hasRoles: true,
  };
  ngOnInit(): void {
    this.editOrganization = new FormGroup({
      editOrganization: this.editOrganization,
    });

    this.organizationNameControl = new FormControl(this.organization.name, [
      Validators.required,
    ]);
  }

  openDialog(): void {
    const dialog = this.matDialog.open(EditOrganizationDialogComponent);
    dialog.afterClosed().subscribe();
  }

  save() {
    this.organization.name = 'teeeeeeeest';
    console.log(this.board);
  }
}
