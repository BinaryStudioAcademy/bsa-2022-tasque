import { Component, Input, OnInit } from '@angular/core';
import { TaskModel } from 'src/core/models/task/task-model';
import { UserModel } from 'src/core/models/user/user-model';
import {
  faCheckToSlot,
  faXmark,
  faLink,
  faPaperclip,
  faShareNodes,
  faEllipsisVertical,
  faFaceSmile,
  faPen,
  faFlag,
} from '@fortawesome/free-solid-svg-icons';
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
import { TasqueDropdownOption } from '../tasque-dropdown/dropdown.component';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';
import { ProjectService } from 'src/core/services/project.service';
import { TaskTemplateService } from 'src/core/services/task-template.service';
import { GetCurrentOrganizationService } from 'src/core/services/get-current-organization.service';
import { SprintService } from 'src/core/services/sprint.service';

@Component({
  selector: 'tasque-task-editing',
  templateUrl: './task-editing.component.html',
  styleUrls: ['./task-editing.component.sass'],
})
export class TaskEditingComponent extends BaseComponent implements OnInit {
  @Input() public task: TaskModel;
  @Input() public currentUser: UserModel;
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
  public flagIcon = faFlag;

  public taskDescriptionEditorShow = false;
  public taskSummaryInputShow = false;

  public taskStatusOptions: TasqueDropdownOption[] = [];
  public taskPriorityOptions: TasqueDropdownOption[] = [];
  public taskTypeOptions: TasqueDropdownOption[] = [];
  public projectOptions: TasqueDropdownOption[] = [];
  public sprintOptions: TasqueDropdownOption[] = [];

  @Input() public taskPriorities: TaskPriority[] = [];
  @Input() public taskStates: TaskState[] = [];
  @Input() public taskTypes: TaskType[] = [];

  @Input() public projects: ProjectModel[] = [];

  @Input() public sprints: SprintModel[] = [];
  @Input() public users: UserModel[] = [];

  public editorConfig: AngularEditorConfig = EditorConfig;

  constructor(private sanitizer: DomSanitizer) {
    super();

    this.task = {
      id: 1,
      summary: 'Summary',
      description: 'Description',
      stateId: 1,
      attachments: [],
      state: {
        id: 1,
        name: 'To Do',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      type: {
        id: 1,
        name: 'Bug',
        createdAt: new Date(),
        updatedAt: new Date(),
        icon: this.flagIcon,
      },
      priority: {
        id: 1,
        name: 'Low',
        type: 0,
        projectId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      author: this.users.filter((u) => u.id == 1)[0],
      project: this.projects.filter((p) => p.id == 2)[0],
      sprint: this.sprints.filter((s) => s.id == 3)[0],
      lastUpdatedBy: this.users.filter((u) => u.id == 4)[0],
      parentTaskId: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      deadline: new Date(),
      custmFields: [],
    };
    this.currentUser = this.users[1];
    this.taskReporter = this.users[2];
  }

  ngOnInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.taskSprint = this.sprints.find((x) => x.id === this.task.sprint?.id)!;

    this.editTaskForm = new FormGroup({
      taskProject: new FormControl(this.convertToOption(this.task.project as ProjectModel)),
      taskSummary: new FormControl(this.task.summary, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(80),
      ]),
      taskStatus: new FormControl(this.convertToOption(this.task.state)),
      taskPriority: new FormControl(this.convertToOption(this.task.priority)),
      taskType: new FormControl(this.convertToOption(this.task.type)),
      taskSprint: new FormControl(this.convertToOption(this.taskSprint)),
      taskDescription: new FormControl<SafeHtml | undefined>(
        this.task.description,
        [Validators.maxLength(5000)],
      ),
      taskAssignees: new FormControl(),
    });

    this.fillProjectOptions(this.projects);
    this.fillSprintOptions(this.sprints);
    this.fillTaskStateOptions(this.taskStates);
    this.fillTaskPriorityOptions(this.taskPriorities);
    this.fillTaskTypeOptions(this.taskTypes);
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
      return 'Summary must not exceed  80 characters';
    }

    return '';
  }

  get descriptionErrorMessage(): string {
    const ctrl = this.editTaskForm.controls.taskDescription;

    if (ctrl.errors?.['maxlength']) {
      return 'Description must not exceed 5000 characters';
    }

    return '';
  }

  private convertToOption(
    item: SprintModel | ProjectModel | TaskState | TaskPriority | TaskType,
  ): TasqueDropdownOption {
    if (item.id === 0) {
      return {
        color: 'lightgray',
        title: '-',
        id: 0,
      };
    }

    switch (item.id % 4) {
      case 1:
      return {
          color: 'green',
          title: item.name,
        id: item.id,
        };
      case 2:
        return {
          color: 'yellow',
        title: item.name,
          id: item.id,
      };
      case 3:
    return {
          color: 'orange',
          title: item.name,
      id: item.id,
    };
      case 0:
        return {
          color: 'red',
          title: item.name,
          id: item.id,
        };
    }

    return {
      color: 'pink',
      title: 'error',
      id: -1,
    };
  }

  private fillProjectOptions(projects: ProjectModel[]): void {
    this.projectOptions = [];
    projects.forEach((element) => {
      this.projectOptions.push(this.convertToOption(element));
    });
  }

  private fillSprintOptions(sprints: SprintModel[]): void {
    this.sprintOptions = [
      {
        color: 'lightgray',
        title: '-',
        id: 0,
      },
    ];

    sprints.forEach((element) => {
      this.sprintOptions.push(this.convertToOption(element));
    });
  }

  private fillTaskPriorityOptions(taskPriorities: TaskPriority[]): void {
    this.taskPriorityOptions = [];
    taskPriorities.forEach((element) => {
      this.taskPriorityOptions.push(this.convertToOption(element));
    });
  }

  private fillTaskStateOptions(taskStates: TaskState[]): void {
    this.taskStatusOptions = [];
    taskStates.forEach((element) => {
      this.taskStatusOptions.push(this.convertToOption(element));
    });
  }

  private fillTaskTypeOptions(taskTypes: TaskType[]): void {
    this.taskTypeOptions = [];
    taskTypes.forEach((element) => {
      this.taskTypeOptions.push(this.convertToOption(element));
    });
  }
}
