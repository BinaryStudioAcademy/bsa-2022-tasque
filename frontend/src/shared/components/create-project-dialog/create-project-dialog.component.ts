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
    if(!this.checkFirstAndLastCharacters()) {
      return 'Name should not starts or ends with special characters';
    }
    return '';
  }

  get projectKeyErrorMessage(): string {
    const ctrl = this.projectKeyControl;

    if (ctrl.errors?.['required'] && (ctrl.dirty || ctrl.touched)) {
      return 'Project key is required';
    }
    if(!this.checkFirstAndLastCharacters()) {
      return 'Key should not starts or ends with special characters';
    }
    return '';
  }

  public createProjectForm: FormGroup = new FormGroup({});
  public projectNameControl: FormControl;
  public projectKeyControl: FormControl;

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

  public showError = false;

  public unsubscribe$ = new Subject<void>();
  public newProject: NewProjectModel = {
    name: '',
    key: '',
    organizationId: 0,
  };

  constructor(
    public projectService: ProjectService,
    public notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private dialogRef: MatDialogRef<CreateProjectDialogComponent>,
    private router: Router,
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
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  checkFirstAndLastCharacters(): boolean {
    const regex = new RegExp('^[a-zA-Z0-9]+$');
    const lastCharName = this.projectNameControl.value?.length - 1;
    const lastCharKey = this.projectKeyControl.value?.length - 1;
    if(!regex.test(this.projectNameControl.value?.charAt(0)) ||
    !regex.test(this.projectNameControl.value?.charAt(lastCharName)) ||
    !regex.test(this.projectKeyControl.value?.charAt(0)) ||
    !regex.test(this.projectKeyControl.value?.charAt(lastCharKey))) {
      return false;
    }
    return true;
  }

  onSubmit(): void {
    if (!this.createProjectForm.valid || !this.checkFirstAndLastCharacters()) {
      this.createProjectForm.markAllAsTouched();
      this.projectKeyControl.markAllAsTouched();
      this.notificationService.error('Follow suggestion under input field', 'Something go wrong');
      this.showError = true;
      return;
    }

    this.newProject = {
      organizationId: this.data,
      name: this.createProjectForm.get('projectNameControl')?.value,
      key: this.createProjectForm.get('projectKeyControl')?.value.toUpper(),
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
