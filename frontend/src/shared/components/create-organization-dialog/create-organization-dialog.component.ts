import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrganizationService } from 'src/core/services/organization.service';
import { UserModel } from 'src/core/models/user/user-model';
import { NewOrganizationModel } from 'src/core/models/organization/new-organization-model';
import { FormControl, Validators } from '@angular/forms';
import { NotificationService } from 'src/core/services/notification.service';
import { Router } from '@angular/router';
import { GetCurrentOrganizationService } from 'src/core/services/get-current-organization.service';

@Component({
  selector: 'app-create-organization-dialog',
  templateUrl: './create-organization-dialog.component.html',
  styleUrls: ['./create-organization-dialog.component.sass']
})
export class CreateOrganizationDialogComponent implements OnInit, OnDestroy {

  public createBtnName = 'Create';
  public createBtnClass = 'fill';
  public cancelBtnName = 'Cancel';
  public cancelBtnClass = 'fill gray';

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
    private router: Router,
    private currOrgService: GetCurrentOrganizationService,
    @Inject(MAT_DIALOG_DATA) public currentUser: UserModel) {
    this.createOrganizationForm = new FormControl(this.organizationName, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]);
  }

  public areLastAndFirstCharactersCorrect(): boolean {
    const regex = new RegExp('^[a-zA-Z0-9]+$');
    const lastChar = this.createOrganizationForm.value.length - 1;
    if(!regex.test(this.createOrganizationForm.value.charAt(0)) ||
      !regex.test(this.createOrganizationForm.value.charAt(lastChar))) {
        return false;
      }
    return true;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
        this.currOrgService.currentOrganizationId = result.body?.id as number;
        this.router.navigate(['projects'], { replaceUrl: true });
        this.dialogRef.close(result.body);
      });
  }
}
