import { Component, Output, Input, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpService } from 'src/core/services/http.service';
import { ButtonComponent } from '../../button/button.component';
import { TestUserModel } from '../user-test-model';

@Component({
  selector: 'app-create-organization-dialog',
  templateUrl: './create-organization-dialog.component.html',
  styleUrls: ['./create-organization-dialog.component.sass']
})
export class CreateOrganizationDialogComponent implements OnInit {

  public createBtnName = "Create";
  public btnClass = "mini";
  public cancelBtnName = "Cancel";

  public unsubscribe$ = new Subject<void>();

  constructor(
    public buttonComponent:ButtonComponent,
    public httpService: HttpService,
    @Inject(MAT_DIALOG_DATA) public currentUser: TestUserModel ) { }

  ngOnInit(): void {
  }
  
  createOrganization(name:string): void{
    console.log({Name: name, AuthorId: this.currentUser?.Id});
    this.httpService.postFullRequest("/api/organization/createOrganization", {Name: name, AuthorId: this.currentUser?.Id})
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((resp) =>{
      console.log(resp.body);
    },
    (error) =>{
      console.log(error);
    });
  }
}
