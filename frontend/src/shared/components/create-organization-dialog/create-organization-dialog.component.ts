import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrganizationService } from 'src/core/services/organization.service';
import { UserModel } from 'src/core/models/user/user-model';
import { NewOrganizationModel } from 'src/core/models/organization/new-organization-model';
import { FormControl, Validators } from '@angular/forms';
import { NotificationService } from 'src/core/services/notification.service';
import { ValidationConstants } from 'src/core/models/const-resources/validation-constraints';

@Component({
  selector: 'app-create-organization-dialog',
  templateUrl: './create-organization-dialog.component.html',
  styleUrls: ['./create-organization-dialog.component.sass']
})
export class CreateOrganizationDialogComponent implements OnInit {

  public createBtnName = 'Create';
  public createBtnClass = 'fill';
  public cancelBtnName = 'Cancel';
  public cancelBtnClass = 'fill gray';

  public notAllowedCharacters = ValidationConstants.notAllowedCharacters;

  public inputType = 'text';
  public showError = false;
  public inputNameClass = 'input';
  public inputNameId = 'organizationName';
  public inputNamePlaceholder = 'Write the name of your organization';
  public inputNameLabel = 'Name';

  public get createOrgErrorMessage(): string {
    const ctrl = this.createOrganizationForm;

    if(ctrl.errors?.['required'] && (ctrl.dirty || ctrl.touched)) {
      return 'Organization name is required';
    }
    if(ctrl.errors?.['minlength'] && (ctrl.dirty || ctrl.touched)) {
      return 'Organization name should contain at least 3 characters';
    }
    if(ctrl.errors?.['maxlength'] && (ctrl.dirty || ctrl.touched)) {
      return 'Organization name should be less than 50 characters';
    }
    if(!this.areLastAndFirstCharactersCorrect()) {
      return 'Name should not starts or ends with special characters';
    }
    return '';
  }
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
      Validators.minLength(3),
      Validators.maxLength(50),
    ]);
  }

  public areLastAndFirstCharactersCorrect(): boolean {
    const lastChar = this.createOrganizationForm.value.length - 1;
    if(this.notAllowedCharacters.includes(this.createOrganizationForm.value.charAt(0)) ||
      this.notAllowedCharacters.includes(this.createOrganizationForm.value.charAt(lastChar))){
      return false;
    }
    return true;
  }

  ngOnInit(): void {
  }

  createOrganization(): void {
    if (!this.createOrganizationForm.valid || !this.areLastAndFirstCharactersCorrect()) {
      this.createOrganizationForm.markAllAsTouched();
      this.isSuccessful = false;
      this.notificationService.error('Follow suggestion under input field', 'Something go wrong');
      this.showError = true;
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
