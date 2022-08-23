import { Component, OnInit } from '@angular/core';
import { CreateProjectDialogComponent } from './create-project-dialog/create-project-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserModel } from '../../../core/models/user/user-model';
import { OrganizationModel } from '../../../core/models/organization/organization-model';
import { NewProjectCredentialsModel } from '../../../core/models/project/new-project-credentials.model';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.sass']
})
export class CreateProjectComponent implements OnInit {

  public currentUser: UserModel;
  public currentOrganization: OrganizationModel = {
    id: 1,
    name: 'Organization1',
    authorId: 1,
    createdAt: new Date(2000, 1, 1),
    updatedAt: new Date(2001, 1, 1),
  };

  public btnText = 'Create project';
  public btnClass = 'mini';

  constructor(
    public matDialog: MatDialog,
    public currentUserService: GetCurrentUserService,
  ) { }

  ngOnInit(): void {
    this.currentUserService.currentUser.subscribe((user) => {
      this.currentUser = user as UserModel;
    })
  }

  openDialog(): void {
    const newProjectCredential: NewProjectCredentialsModel = {
      authorId: this.currentUser.id,
      organizationId: this.currentOrganization.id,
    };
    const dialog = this.matDialog.open(CreateProjectDialogComponent, { data: newProjectCredential });
    dialog.afterClosed().subscribe();
  }

}
