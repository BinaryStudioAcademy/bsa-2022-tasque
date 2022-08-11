import { Component, Inject, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ProjectService } from '../../../../core/services/project.service';
import { NewProjectModel } from '../../../../core/models/project/new-project-model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { takeUntil } from 'rxjs/operators';
import { NewProjectCredentialsModel } from '../../../../core/models/project/new-project-credentials.model';

@Component({
  selector: 'app-create-project-dialog',
  templateUrl: './create-project-dialog.component.html',
  styleUrls: ['./create-project-dialog.component.sass']
})
export class CreateProjectDialogComponent implements OnInit {

  public createBtnName = 'Create project';
  public createBtnClass = 'fill';

  public cancelBtnName = 'Cancel';
  public cancelBtnClass = 'fill gray';

  public inputNameClass = 'input';
  public inputNameType = 'text';
  public inputNameId = 'projectName';
  public inputNamePlaceholder = 'Try a team name, project goal, milestone...';
  public inputNameLabel = 'Name';
  public inputNameRequired = true;

  public inputKeyClass = 'input';
  public inputKeyType = 'text';
  public inputKeyId = 'projectKey';
  public inputKeyLabel = 'Key';

  public newProjectName = '';

  public unsubscribe$ = new Subject<void>();

  constructor(
    public projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public data: NewProjectCredentialsModel,
  ) { }

  ngOnInit(): void {

  }

  onSubmit(): void{

    const newProject: NewProjectModel = {
      name: this.newProjectName,
      authorId: this.data.authorId,
      organizationId: this.data.organizationId,
    };
    this.projectService.createProject(newProject)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

}
