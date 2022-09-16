import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/core/services/notification.service';
import { NewProjectModel } from 'src/core/models/project/new-project-model';
import { ProjectService } from 'src/core/services/project.service';
import { Router } from '@angular/router';
import { ProjectInfoModel } from 'src/core/models/project/project-info-model';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';
import { UserModel } from 'src/core/models/user/user-model';

@Component({
  selector: 'app-create-project-dialog',
  templateUrl: './create-project-dialog.component.html',
  styleUrls: ['./create-project-dialog.component.sass'],
})
export class CreateProjectDialogComponent implements OnInit, OnDestroy {
  get projectNameErrorMessage(): string {
    const ctrl = this.projectNameControl;

    if (ctrl.errors?.['required'] && (ctrl.dirty || ctrl.touched)) {
      return 'Project name is required';
    }
    if(ctrl.errors?.['minlength'] && (ctrl.dirty || ctrl.touched)) {
      return 'Project name should contain at least 3 characters';
    }
    if(ctrl.errors?.['maxlength'] && (ctrl.dirty || ctrl.touched)) {
      return 'Project name should be less then 50 characters';
    }
    if(!this.checkNameFirstAndLastCharacters()) {
      return 'Name should not starts or ends with special characters';
    }
    return '';
  }

  get projectKeyErrorMessage(): string {
    const ctrl = this.projectKeyControl;

    if (ctrl.errors?.['required'] && (ctrl.dirty || ctrl.touched)) {
      return 'Project key is required';
    }
    if(ctrl.errors?.['minlength'] && (ctrl.dirty || ctrl.touched)) {
      return 'Key should contain at least 2 characters';
    }
    if(ctrl.errors?.['maxlength'] && (ctrl.dirty || ctrl.touched)) {
      return 'Key should contain less then 10 characters';
    }
    if(!this.checkKeyFirstAndLastCharacters()) {
      return 'Key should not starts or ends with special characters';
    }
    return '';
  }

  public createProjectForm: FormGroup = new FormGroup({});
  public projectNameControl: FormControl;
  public projectKeyControl: FormControl;

  public currentUser: UserModel;

  public createBtnName = 'Create';
  public createBtnClass = 'fill';

  public cancelBtnName = 'Cancel';
  public cancelBtnClass = 'fill gray';

  public inputNameClass = 'input';
  public inputNameId = 'projectName';
  public inputNamePlaceholder = 'Write the name of your project';
  public inputNameLabel = 'Name';
  public inputNameRequired = true;

  public inputKeyClass = 'input';
  public inputKeyPlaceholder = 'Choose a prefix for your project issue keys';
  public inputKeyId = 'projectKey';
  public inputKeyLabel = 'Key';

  public isSuccessful: boolean;
  public newProjectKey = '';

  public showErrorName = false;
  public showErrorKey = false;

  public unsubscribe$ = new Subject<void>();
  public newProject: NewProjectModel = {
    name: '',
    key: '',
    organizationId: 0,
    authorId: 0,
  };

  constructor(
    public projectService: ProjectService,
    public notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private dialogRef: MatDialogRef<CreateProjectDialogComponent>,
    private router: Router,
    private currentUserService: GetCurrentUserService,
  ) {
    this.projectNameControl = new FormControl(this.newProject.name, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]);
    this.projectKeyControl = new FormControl(this.newProject.key, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(10),
    ]);
  }

  ngOnInit(): void {
    this.createProjectForm = new FormGroup({
      projectNameControl: this.projectNameControl,
      projectKeyControl: this.projectKeyControl,
    });
    this.currentUserService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  checkNameFirstAndLastCharacters(): boolean {
    const regex = new RegExp('^[a-zA-Z0-9]+$');
    const lastCharName = this.projectNameControl.value?.length - 1;
    if(!regex.test(this.projectNameControl.value?.charAt(0)) ||
    !regex.test(this.projectNameControl.value?.charAt(lastCharName))) {
      return false;
    }
    return true;
  }

  checkKeyFirstAndLastCharacters(): boolean {
    const regex = new RegExp('^[a-zA-Z0-9]+$');
    const lastCharKey = this.projectKeyControl.value?.length - 1;
    if(!regex.test(this.projectKeyControl.value?.charAt(0)) ||
    !regex.test(this.projectKeyControl.value?.charAt(lastCharKey))){
      return false;
    }
    return true;
  }

  onSubmit(): void {
    if (!this.projectNameControl.valid || !this.checkNameFirstAndLastCharacters()) {
      this.projectNameControl.markAllAsTouched();
      this.notificationService.error('Follow suggestion under input field', 'Something go wrong');
      this.showErrorName = true;
      if(!this.projectKeyControl.valid || !this.checkKeyFirstAndLastCharacters()){
        this.projectKeyControl.markAllAsTouched();
        this.showErrorKey = true;
      }
      return;
    }
    if(!this.projectKeyControl.valid || !this.checkKeyFirstAndLastCharacters()){
      this.projectKeyControl.markAllAsTouched();
      this.notificationService.error('Follow suggestion under input field', 'Something go wrong');
      this.showErrorKey = true;
      return;
    }

    this.newProject = {
      organizationId: this.data,
      name: this.createProjectForm.get('projectNameControl')?.value,
      key: this.createProjectForm.get('projectKeyControl')?.value.toUpperCase(),
      authorId: this.currentUser.id,
    };

    this.projectService
      .createProject(this.newProject)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        if (resp.status == 200) {
          this.notificationService.success('The project has been created');
          const project = resp.body as ProjectInfoModel;
          this.dialogRef.close(resp.body);
          this.router.navigate([`/project/${project.id}/board`]);
        }
      });
  }

  onClose(): void {
    this.createProjectForm.reset();
    this.dialogRef.close();
  }
}
