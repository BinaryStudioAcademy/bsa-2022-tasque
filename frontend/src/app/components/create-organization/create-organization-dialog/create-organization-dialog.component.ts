import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrganizationService } from 'src/core/services/organization.service';
import { UserModel } from 'src/entity-models/user-model';
import { NewOrganizationModel } from 'src/core/models/organization/new-organization-model';
import { FormControl, Validators } from '@angular/forms';
import { NotificationService } from 'src/core/services/notification.service';

@Component({
  selector: 'app-create-organization-dialog',
  templateUrl: './create-organization-dialog.component.html',
  styleUrls: ['./create-organization-dialog.component.sass']
})
export class CreateOrganizationDialogComponent implements OnInit {

  public createBtnName = 'Create organization';
  public createBtnClass = 'fill';
  public cancelBtnName = 'Cancel';
  public cancelBtnClass = 'fill gray';

  public inputType = 'text';
  public inputNameClass = 'input';
  public inputNameId = 'projectName';
  public inputLabel = 'Organization name';
  public inputNamePlaceholder = 'Write organization name';
  public inputNameLabel = 'Organization name';
  public createOrgErrorMessage = 'Name is required';
  public inputNameRequired = true;

  public isSuccessful: boolean;

  public unsubscribe$ = new Subject<void>();

  public organizationName = '';
  public createOrganizationForm: FormControl;

  constructor(
    public dialogRef: MatDialogRef<CreateOrganizationDialogComponent>,
    public organizationService: OrganizationService,
    public notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public currentUser: UserModel) {
    this.createOrganizationForm = new FormControl(this.organizationName, [
      Validators.required,
    ]);
  }

  ngOnInit(): void {
  }

  createOrganization(): void {
    if (!this.createOrganizationForm.valid) {
      this.createOrganizationForm.markAllAsTouched();
      this.isSuccessful = false;
      this.notificationService.error('Something go wrong');
      return;
    }

    this.isSuccessful = true;

    const organization: NewOrganizationModel = {
      name: this.createOrganizationForm.value
    };
    this.organizationService.createOrganization(organization)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.notificationService.success('Organization has been created successfully');
        this.dialogRef.close(result.body);
      });
  }
}
