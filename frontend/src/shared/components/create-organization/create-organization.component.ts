import { Component, OnInit, Input } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateOrganizationDialogComponent } from './create-organization-dialog/create-organization-dialog.component';
import { UserModel } from 'src/entity-models/user-model';

@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.sass']
})
export class CreateOrganizationComponent implements OnInit {

  @Input() public currentUser: UserModel = {
    Name: "Login1",
    Email: "testlogin@gmail.com",
    Id: 1,
    Salt: "Salt",
    Password: "Password"
  };

  public btnClass:string = "mini";
  public btnText:string = 'Create organization';
  public unsubscribe$ = new Subject<void>();

  constructor(
    public buttonComponent:ButtonComponent,
    public matDialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(){
    const dialog = this.matDialog.open(CreateOrganizationDialogComponent, {data: this.currentUser});
    dialog.afterClosed().subscribe((resp) => {console.log(resp)});
  }
}
