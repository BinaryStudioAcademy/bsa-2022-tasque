import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskModel } from 'src/core/models/task/task-model';
import { UserModel } from 'src/core/models/user/user-model';
import { faCheckToSlot, faXmark, faLink, faPaperclip, faShareNodes, faEllipsisVertical, faFaceSmile, faPen } from '@fortawesome/free-solid-svg-icons';
import { BaseComponent } from 'src/core/base/base.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskState } from 'src/core/models/enums/task-state';
import { TaskPriority } from 'src/core/models/enums/task-priority';
import { ProjectModel } from 'src/core/models/project/project-model';
import { SprintModel } from 'src/core/models/sprint/sprint-model';
import { EditorConfig } from 'src/core/settings/angular-editor-setting';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface EditTaskDialogData {
  currentUser: UserModel,
  task: TaskModel
}

@Component({
  selector: 'tasque-task-editing',
  templateUrl: './task-editing.component.html',
  styleUrls: ['./task-editing.component.sass']
})
export class TaskEditingComponent extends BaseComponent implements OnInit {

  public task: TaskModel;
  public currentUser: UserModel;
  public taskProject: ProjectModel;
  public taskUser: UserModel;
  public taskSprint: SprintModel;

  public editTaskForm: FormGroup = {} as FormGroup;

  public closeIcon = faXmark;
  public linkIcon = faLink;
  public checkIcon = faCheckToSlot;
  public shareIcon = faShareNodes;
  public paperClipIcon = faPaperclip;
  public ellipsisIcon = faEllipsisVertical;
  public faceSmileIcon = faFaceSmile;
  public editIcon = faPen;

  public taskDescriptionEditorShow = false;
  public taskSummaryInputShow = false;

  public taskStatusOptions: [color: string, title: string, id: number][] = [
    ['yellow', 'To Do', TaskState.Todo],
    ['orange', 'In Progress', TaskState.InProgress],
    ['green', 'Done', TaskState.Done],
    ['red', 'Canceled', TaskState.Done],
  ];
  public taskPriorityOptions: [color: string, title: string, id: number][] = [
    ['green', 'Low', TaskPriority.Low],
    ['yellow', 'Medium', TaskPriority.Medium],
    ['orange', 'High', TaskPriority.High],
  ];

  public projectOptions: [color: string, title: string, id: number][] = [];
  public sprintOptions: [color: string, title: string, id: number][] = [];

  public projects: ProjectModel[] = [
    {
      id: 1,
      name: 'project 1',
      authorId: 0,
      organizationId: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'project 2',
      authorId: 0,
      organizationId: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'project 3',
      authorId: 0,
      organizationId: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ];

  public sprints: SprintModel[] = [
    {
      id: 1,
      name: 'spr1',
      description: 'sprint desc',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'spr2',
      description: 'sprint desc',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'spr3',
      description: 'sprint desc',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  public users: UserModel[] = [
    {
      id: 1,
      name: 'User1Name',
      email: 'email'
    },
    {
      id: 2,
      name: 'User2Name',
      email: 'email'
    },
    {
      id: 3,
      name: 'User3Name',
      email: 'email'
    }
  ];

  public editorConfig: AngularEditorConfig = EditorConfig;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EditTaskDialogData,
    private sanitizer: DomSanitizer
  ) {
    super();
    this.task = data.task;
    this.currentUser = data.currentUser;
  }

  ngOnInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.taskProject = this.projects.find((x) => x.id === this.task.projectId)!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.taskUser = this.users.find((x) => x.id === this.task.authorId)!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.taskSprint = this.sprints.find((x) => x.id === this.task.sprintId)!;

    this.editTaskForm = new FormGroup({
      taskProject: new FormControl(this.chooseProject(this.taskProject)),
      taskSummary: new FormControl(this.task.summary, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(80)
      ]),
      taskStatus: new FormControl(this.chooseTaskStatus(this.task.taskState)),
      taskPriority: new FormControl(this.chooseTaskPriority(this.task.taskPriority)),
      taskSprint: new FormControl(this.chooseSprint(this.taskSprint)),
      taskDescription: new FormControl<SafeHtml | undefined>(this.task.description, [
        Validators.maxLength(5000)
      ]),
      taskAssignees: new FormControl(),
    });

    this.fillProjectOptions(this.projects);
    this.fillSprintOptions(this.sprints);
  }

  public safeHTML(unsafe: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(unsafe);
  }

  summaryClick(): void {
    this.taskSummaryInputShow = true;
  }

  summaryInputOutsideClick(): void {
    this.taskSummaryInputShow = false;
    if (this.editTaskForm.value.taskSummary !== this.task.summary) {
      this.task.summary = this.editTaskForm.value.taskSummary;
    }
  }

  descriptionClick(): void {
    this.taskDescriptionEditorShow = true;
  }

  descriptionEditorOutsideClick(): void {
    this.taskDescriptionEditorShow = false;
    if (this.editTaskForm.value.taskDescription !== this.task.description) {
      this.task.description = this.editTaskForm.value.taskDescription;
    }
  }

  get summaryErrorMessage(): string {
    const ctrl = this.editTaskForm.controls.taskSummary;

    if (ctrl.errors?.['minlength']) {
      return 'Summary must be at least 2 characters';
    }
    if (ctrl.errors?.['maxlength']) {
      return 'Summary must be at less  80 characters';
    }

    return '';
  }

  get descriptionErrorMessage(): string {
    const ctrl = this.editTaskForm.controls.taskDescription;

    if (ctrl.errors?.['maxlength']) {
      return 'Description must be at less 5000 characters';
    }

    return '';
  }

  private chooseTaskStatus(taskStatus: TaskState): [string, string, number] {
    return this.taskStatusOptions.find((x) => x[2] === taskStatus) ?? ['white', 'To Do', TaskState.Todo];
  }

  private chooseTaskPriority(taskPriority: TaskPriority): [string, string, number] {
    return this.taskStatusOptions.find((x) => x[2] === taskPriority) ?? ['green', 'Low', TaskPriority.Low];
  }

  private chooseProject(project: ProjectModel): [string, string, number] {
    switch (project.id % 4) {
      case 1:
        return ['yellow', project.name, project.id];
      case 2:
        return ['green', project.name, project.id];
      case 3:
        return ['orange', project.name, project.id];
      case 4:
        return ['red', project.name, project.id];
      default:
        return ['white', '-', 0];
    }
  }

  private chooseSprint(sprint: SprintModel): [string, string, number] {
    switch (sprint.id % 4) {
      case 1:
        return ['yellow', sprint.name, sprint.id];
      case 2:
        return ['green', sprint.name, sprint.id];
      case 3:
        return ['orange', sprint.name, sprint.id];
      case 4:
        return ['red', sprint.name, sprint.id];
      default:
        return ['white', '-', 0];
    }
  }

  private fillProjectOptions(projects: ProjectModel[]): void {
    const projectOptions: [color: string, title: string, id: number][] = [];
    projects.forEach((element) => {
      projectOptions.push(this.chooseProject(element));
    });
    this.projectOptions = projectOptions;
  }

  private fillSprintOptions(sprints: SprintModel[]): void {
    const sprintOptions: [color: string, title: string, id: number][] = [['white', '-', 0]];
    sprints.forEach((element) => {
      sprintOptions.push(this.chooseSprint(element));
    });
    this.sprintOptions = sprintOptions;
  }
}
