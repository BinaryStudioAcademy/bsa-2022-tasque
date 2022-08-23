import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateOrganizationDialogComponent } from './create-organization-dialog/create-organization-dialog.component';
import { ButtonComponent } from 'src/shared/components/tasque-button/button.component';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';
import { UserModel } from 'src/core/models/user/user-model';

@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.sass']
})
export class CreateOrganizationComponent implements OnInit {

  @Input() public currentUser: UserModel;

  public btnClass = 'mini';
  public btnText = 'Create organization';
  public unsubscribe$ = new Subject<void>();

  constructor(
    public currentUserService: GetCurrentUserService,
    public buttonComponent:ButtonComponent,
    public matDialog: MatDialog) { }

  ngOnInit(): void {
    this.currentUserService.currentUser.subscribe((user) => {
      this.currentUser = user as UserModel;
    })
  }

  openDialog():void {
    const dialog = this.matDialog.open(CreateOrganizationDialogComponent, { data: this.currentUser });
    dialog.afterClosed().subscribe();
  }
}
