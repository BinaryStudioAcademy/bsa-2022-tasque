import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ProjectService } from '../../../../core/services/project.service';
import { NewProjectModel } from '../../../../core/models/project/new-project-model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { takeUntil } from 'rxjs/operators';
import { NewProjectCredentialsModel } from '../../../../core/models/project/new-project-credentials.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputComponent } from 'src/shared/components/tasque-input/input.component';

@Component({
  selector: 'app-create-project-dialog',
  templateUrl: './create-project-dialog.component.html',
  styleUrls: ['./create-project-dialog.component.sass'],
})
export class CreateProjectDialogComponent implements OnInit, OnDestroy {
  get projectNameErrorMessage(): string {
    const ctrl = this.projectNameControl;

    if (ctrl.errors?.['required']) {
      return 'Project name is required';
    }
    return '';
  }

  get projectKeyErrorMessage(): string {
    const ctrl = this.projectKeyControl;

    if (ctrl.errors?.['required']) {
      return 'Project key is required';
    }
    return '';
  }

  public createProjectForm: FormGroup = new FormGroup({});
  public projectNameControl: FormControl;
  public projectKeyControl: FormControl;

  @ViewChild('projectNameInput') projectNameInput: InputComponent;
  @ViewChild('projectKeyInput') projectKeyInput: InputComponent;

  public createBtnName = 'Create project';
  public createBtnClass = 'fill';

  public cancelBtnName = 'Cancel';
  public cancelBtnClass = 'fill gray';

  public inputNameClass = 'input';
  public inputNameId = 'projectName';
  public inputNamePlaceholder = 'Try a team name, project goal, milestone...';
  public inputNameLabel = 'Name';
  public inputNameRequired = true;

  public inputKeyClass = 'input';
  public inputKeyId = 'projectKey';
  public inputKeyLabel = 'Key';

  public newProjectName = '';
  public newProjectKey = '';

  public unsubscribe$ = new Subject<void>();

  public newProject: NewProjectModel;

  constructor(
    public projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public data: NewProjectCredentialsModel,
  ) {
    this.projectNameControl = new FormControl(this.newProjectName, [
      Validators.required,
    ]);
    this.projectKeyControl = new FormControl(this.newProjectKey, [
      Validators.required,
    ]);
  }

  public showError(input: InputComponent): void {
    let isError = false;
    let errMsg = '';
    switch (input.inputLabel) {
      case 'Key':
        isError = this.projectKeyControl.invalid;
        errMsg = this.projectKeyErrorMessage;
        break;
      case 'Name':
        isError = this.projectNameControl.invalid;
        errMsg = this.projectNameErrorMessage;
        break;
    }

    input.invalid = isError;
    input.errorMessage = errMsg;
  }

  public hideError(input: InputComponent): void {
    input.invalid = false;
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
      return;
    }

    if (this.createProjectForm.invalid) {
      this.showError(this.projectKeyInput);
      this.showError(this.projectNameInput);

      return;
    }
    const newProject: NewProjectModel = {
      name: this.newProjectName,
      authorId: this.data.authorId,
      organizationId: this.data.organizationId,
    };
    this.projectService
      .createProject(newProject)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }
}
