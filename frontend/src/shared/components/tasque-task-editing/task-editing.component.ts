import { Component, Input, OnInit } from '@angular/core';
import { TaskModel } from 'src/core/models/task/task-model';
import { UserModel } from 'src/core/models/user/user-model';
import { faCheckToSlot, faXmark, faLink, faPaperclip, faShareNodes, faEllipsisVertical, faFaceSmile, faPen, faFlag } from '@fortawesome/free-solid-svg-icons';
import { BaseComponent } from 'src/core/base/base.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectModel } from 'src/core/models/project/project-model';
import { SprintModel } from 'src/core/models/sprint/sprint-model';
import { EditorConfig } from 'src/core/settings/angular-editor-setting';
import { TaskState } from 'src/core/models/task/task-state';
import { TaskPriority } from 'src/core/models/task/task-priority';
import { TaskType } from 'src/core/models/task/task-type';
import { TasqueDropdownOption } from '../tasque-dropdown/dropdown.component';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';
import { ProjectService } from 'src/core/services/project.service';
import { TaskTemplateService } from 'src/core/services/task-template.service';
import { GetCurrentOrganizationService } from 'src/core/services/get-current-organization.service';
import { SprintService } from 'src/core/services/sprint.service';
import { TaskService } from 'src/core/services/task.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tasque-task-editing',
  templateUrl: './task-editing.component.html',
  styleUrls: ['./task-editing.component.sass'],
})
export class TaskEditingComponent extends BaseComponent implements OnInit {
  @Input() public task: TaskModel;
  @Input() public currentUser: UserModel;

  public organizationId: number;

  public editTaskForm = {} as FormGroup;

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

  public taskPriorities: TaskPriority[] = [];
  public taskStates: TaskState[] = [];
  public taskTypes: TaskType[] = [];

  public users: UserModel[] = [];

  public editorConfig: AngularEditorConfig = EditorConfig;

  // eslint-disable-next-line max-params
  constructor(
    private fb: FormBuilder,
    private currentUserService: GetCurrentUserService,
    private taskTemplateService: TaskTemplateService,
    private projectService: ProjectService,
    private currentOrganizationService: GetCurrentOrganizationService,
    private taskService: TaskService,
    private sprintService: SprintService) {
    super();
  }

  ngOnInit(): void {
    this.currentUserService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    this.currentOrganizationService.currentOrganizationId$.subscribe((orgId) => {
      this.organizationId = orgId;

      this.projectService
        .getProjectsByOrganizationId(this.organizationId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((resp) => {
          if (!resp.body) {
            return;
          }
          this.fillProjectOptions(resp.body);
          this.getProjectInfo(this.task.projectId);
        });
    });

    this.editTaskForm = this.fb.group({
      taskProject: [this.convertToOption(this.task.project)],
      taskSummary: [this.task.summary,
      [Validators.minLength(2),
      Validators.maxLength(80)]
      ],
      taskSprint: [this.convertToOption(this.task.sprint)],
      taskStatus: [this.convertToOption(this.task.state)],
      taskPriority: [this.convertToOption(this.task.priority)],
      taskType: [this.convertToOption(this.task.type)],
      taskDescription: [this.task.description, [Validators.maxLength(5000)]],
      taskAssignees: [this.task.users],
    });

    this.editTaskForm.controls.taskProject.valueChanges.subscribe((option: TasqueDropdownOption) => {
      this.getProjectInfo(option.id);
    });
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
    item: TaskState | TaskPriority | TaskType | SprintModel | ProjectModel | undefined): TasqueDropdownOption {
    if (!item) {
      return {
        id: 0,
        title: '-',
        color: this.getColorById(0)
      };
    }

    if ('color' in item) {
      return {
        id: item.id,
        title: item.name,
        color: item.color
      };
    }

    return {
      id: item.id,
      title: item.name,
      color: this.getColorById(item.id)
    };
  }

  private getColorById(id: number): string {
    if (id === 0) {
      return 'lightgray';
    }

    switch (id % 4) {
      case 1:
        return 'green';
      case 2:
        return 'yellow';
      case 3:
        return 'orange';
      case 0:
        return 'red';
    }

    return 'lightgray';
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
        title: '-',
        id: 0,
        color: this.getColorById(0),
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

  private getProjectInfo(projectId: number | undefined): void {
    if (!projectId) {
      return;
    }

    this.sprintService.getProjectSprints(projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((sprints) => {
        if (!sprints.body) {
          return;
        }
        this.fillSprintOptions(sprints.body);
      });

    this.taskTemplateService.getAllProjectTaskTypes(projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((taskTypes) => {
        if (!taskTypes.body) {
          return;
        }
        this.fillTaskTypeOptions(taskTypes.body);
      });

    this.projectService.getProjectPriorities(projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((taskPriorities) => {
        if (!taskPriorities.body) {
          return;
        }
        this.fillTaskPriorityOptions(taskPriorities.body);
      });

    this.taskTemplateService.getAllProjectTaskStates(projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((taskStates) => {
        if (!taskStates.body) {
          return;
        }
        this.fillTaskStateOptions(taskStates.body);
      });
  }
}
