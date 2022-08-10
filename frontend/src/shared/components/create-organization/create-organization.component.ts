import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateOrganizationDialogComponent } from './create-organization-dialog/create-organization-dialog.component';
import { UserModel } from 'src/entity-models/user-model';
import { ButtonComponent } from '../tasque-button/button.component';

@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.sass']
})
export class CreateOrganizationComponent implements OnInit {

  @Input() public currentUser: UserModel = {
    name: 'Login1',
    email: 'testlogin@gmail.com',
    id: 1,
    salt: 'Salt',
    password: 'Password'
  };

  public btnClass = 'mini';
  public btnText = 'Create organization';
  public unsubscribe$ = new Subject<void>();

  constructor(
    public buttonComponent:ButtonComponent,
    public matDialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog():void {
    const dialog = this.matDialog.open(CreateOrganizationDialogComponent, { data: this.currentUser });
    dialog.afterClosed().subscribe();
  }
}
