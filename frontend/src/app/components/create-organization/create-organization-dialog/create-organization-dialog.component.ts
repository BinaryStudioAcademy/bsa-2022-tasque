import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrganizationService } from 'src/core/services/organization.service';
import { UserModel } from 'src/entity-models/user-model';
import { NewOrganizationModel } from 'src/core/models/organization/new-organization-model';

@Component({
  selector: 'app-create-organization-dialog',
  templateUrl: './create-organization-dialog.component.html',
  styleUrls: ['./create-organization-dialog.component.sass']
})
export class CreateOrganizationDialogComponent implements OnInit {

  public createBtnName = 'Create';
  public btnClass = 'mini';
  public cancelBtnName = 'Cancel';
  public inputClass = 'input';
  public placeholderText = 'Write organization name';
  public inputType = 'text';
  public inputLabel = 'Organization name';

  public unsubscribe$ = new Subject<void>();

  constructor(
    public organizationService: OrganizationService,
    @Inject(MAT_DIALOG_DATA) public currentUser: UserModel) { }

  ngOnInit(): void {
  }

  createOrganization(name: string): void {
    const organization: NewOrganizationModel = {
      name: name,
      authorId: this.currentUser.id
    };
    this.organizationService.createOrganization(organization)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }
}
