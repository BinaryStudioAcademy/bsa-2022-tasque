import { Component, Input, OnInit } from '@angular/core';
import { TaskModel } from 'src/core/models/task/task-model';
import { UserModel } from 'src/core/models/user/user-model';
import { faCheckToSlot, faXmark, faLink, faPaperclip, faShareNodes, faEllipsisVertical, faFaceSmile, faPen } from '@fortawesome/free-solid-svg-icons';
import { BaseComponent } from 'src/core/base/base.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectModel } from 'src/core/models/project/project-model';
import { SprintModel } from 'src/core/models/sprint/sprint-model';
import { EditorConfig } from 'src/core/settings/angular-editor-setting';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TaskState } from 'src/core/models/task/task-state';
import { TaskPriority } from 'src/core/models/task/task-priority';
import { TaskType } from 'src/core/models/task/task-type';

@Component({
  selector: 'tasque-task-editing',
  templateUrl: './task-editing.component.html',
  styleUrls: ['./task-editing.component.sass']
})
export class TaskEditingComponent extends BaseComponent implements OnInit {

  @Input() public task: TaskModel;
  @Input() public currentUser: UserModel;
  public taskProject: ProjectModel;
  public taskUser: UserModel;
  public taskReporter: UserModel;
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

  public taskStatusOptions: [color: string, title: string, id: number][] = [];
  public taskPriorityOptions: [color: string, title: string, id: number][] = [];
  public taskTypeOptions: [color: string, title: string, id: number][] = [];
  public projectOptions: [color: string, title: string, id: number][] = [];
  public sprintOptions: [color: string, title: string, id: number][] = [];

  @Input() public taskPriorities: TaskPriority[] = [
    {
      id: 1,
      name: 'Low',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Middle',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'High',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ];
  @Input() public taskStates: TaskState[] = [
    {
      id: 1,
      name: 'To Do',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'In Progress',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'Done',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      name: 'Canceled',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ];
  @Input() public taskTypes: TaskType[] = [
    {
      id: 1,
      name: 'Bug',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Feature',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'Enhancement',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ];

  @Input() public projects: ProjectModel[] = [
    {
      id: 1,
      name: 'project 1',
      key: 'PR-1',
      authorId: 0,
      organizationId: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'project 2',
      key: 'PR-2',
      authorId: 0,
      organizationId: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'project 3',
      key: 'PR-3',
      authorId: 0,
      organizationId: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ];

  @Input() public sprints: SprintModel[] = [
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
  @Input() public users: UserModel[] = [
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

  constructor(private sanitizer: DomSanitizer) {
    super();

    this.task = {
      id: 1,
      summary: 'Summary',
      description: 'Description',
      state: {
        id: 1,
        name: 'Hi',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      type: {
        id: 1,
        name: 'Hi',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      priority: {
        id: 1,
        name: 'Hi',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      authorId: 1,
      projectId: 2,
      sprintId: 3,
      lastUpdatedById: 4,
      parentTaskId: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      deadline: new Date()
    };
    this.currentUser = this.users[1];
    this.taskReporter = this.users[2];
  }

  ngOnInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.taskProject = this.projects.find((x) => x.id === this.task.projectId)!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.taskUser = this.users.find((x) => x.id === this.task.authorId)!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.taskSprint = this.sprints.find((x) => x.id === this.task.sprintId)!;

    this.editTaskForm = new FormGroup({
      taskProject: new FormControl(this.convertToOption(this.taskProject)),
      taskSummary: new FormControl(this.task.summary, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(80)
      ]),
      taskStatus: new FormControl(this.convertToOption(this.task.state)),
      taskPriority: new FormControl(this.convertToOption(this.task.priority)),
      taskType: new FormControl(this.convertToOption(this.task.type)),
      taskSprint: new FormControl(this.convertToOption(this.taskSprint)),
      taskDescription: new FormControl<SafeHtml | undefined>(this.task.description, [
        Validators.maxLength(5000)
      ]),
      taskAssignees: new FormControl(),
    });

    this.fillProjectOptions(this.projects);
    this.fillSprintOptions(this.sprints);
    this.fillTaskStatesOptions(this.taskStates);
    this.fillTaskPrioritiesOptions(this.taskPriorities);
    this.fillTaskTypesOptions(this.taskTypes);
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

  private convertToOption(item: SprintModel | ProjectModel | TaskState | TaskPriority): [string, string, number] {
    switch (item.id % 5) {
      case 1:
        return ['green', item.name, item.id];
      case 2:
        return ['yellow', item.name, item.id];
      case 3:
        return ['orange', item.name, item.id];
      case 4:
        return ['red', item.name, item.id];
      default:
        return ['lightgray', '-', 0];
    }
  }

  private fillProjectOptions(projects: ProjectModel[]): void {
    this.projectOptions = [];
    projects.forEach((element) => {
      this.projectOptions.push(this.convertToOption(element));
    });
  }

  private fillSprintOptions(sprints: SprintModel[]): void {
    this.sprintOptions = [];
    this.sprintOptions.push(['lightgray', '-', 0]);
    sprints.forEach((element) => {
      this.sprintOptions.push(this.convertToOption(element));
    });
  }

  private fillTaskPrioritiesOptions(taskPriorities: TaskPriority[]): void {
    this.taskPriorityOptions = [];
    taskPriorities.forEach((element) => {
      this.taskPriorityOptions.push(this.convertToOption(element));
    });
  }

  private fillTaskStatesOptions(taskStates: TaskState[]): void {
    this.taskStatusOptions = [];
    taskStates.forEach((element) => {
      this.taskStatusOptions.push(this.convertToOption(element));
    });
  }

  private fillTaskTypesOptions(taskTypes: TaskType[]): void {
    this.taskTypeOptions = [];
    taskTypes.forEach((element) => {
      this.taskTypeOptions.push(this.convertToOption(element));
    });
  }
}
