import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/core/services/notification.service';
import { NewProjectModel } from 'src/core/models/project/new-project-model';
import { ProjectService } from 'src/core/services/project.service';

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
    return '';
  }

  get projectKeyErrorMessage(): string {
    const ctrl = this.projectKeyControl;

    if (ctrl.errors?.['required'] && (ctrl.dirty || ctrl.touched)) {
      return 'Project key is required';
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
  ) {
    this.projectNameControl = new FormControl(this.newProject.name, [
      Validators.required,
    ]);
    this.projectKeyControl = new FormControl(this.newProject.key, [
      Validators.required,
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

  onSubmit(): void {
    if (!this.createProjectForm.valid) {
      this.createProjectForm.markAllAsTouched();
      this.projectKeyControl.markAllAsTouched();
      return;
    }

    this.newProject = {
      organizationId: this.data,
      name: this.createProjectForm.get('projectNameControl')?.value,
      key: this.createProjectForm.get('projectKeyControl')?.value,
    };

    this.projectService
      .createProject(this.newProject)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        if (resp.status == 200) {
          this.notificationService.success('The project has been created');
          this.dialogRef.close(resp.body);
        }
      });
  }

  onClose(): void {
    this.createProjectForm.reset();
    this.dialogRef.close();
  }
}
