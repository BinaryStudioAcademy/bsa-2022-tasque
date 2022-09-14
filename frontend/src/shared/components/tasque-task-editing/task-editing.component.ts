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
import { TaskStorageService } from 'src/core/services/task-storage.service';

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

  public descriptionEditorShow = false;
  public summaryInputShow = false;

  public statusOptions: TasqueDropdownOption[] = [];
  public priorityOptions: TasqueDropdownOption[] = [];
  public typeOptions: TasqueDropdownOption[] = [];
  public projectOptions: TasqueDropdownOption[] = [];
  public sprintOptions: TasqueDropdownOption[] = [];

  public priorities: TaskPriority[] = [];
  public states: TaskState[] = [];
  public types: TaskType[] = [];

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
    private taskStorage: TaskStorageService,
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
      project: [this.convertToOption(this.task.project)],
      summary: [this.task.summary,
      [Validators.minLength(2),
      Validators.maxLength(80)]
      ],
      sprint: [this.convertToOption(this.task.sprint)],
      status: [this.convertToOption(this.task.state)],
      priority: [this.convertToOption(this.task.priority)],
      type: [this.convertToOption(this.task.type)],
      description: [this.task.description, [Validators.maxLength(5000)]],
      assignees: [this.task.users],
    });

    this.editTaskForm.controls.project.valueChanges.subscribe((option: TasqueDropdownOption) => {
      this.getProjectInfo(option.id);
    });
  }

  summaryClick(): void {
    this.summaryInputShow = true;
  }

  summaryInputOutsideClick(): void {
    this.summaryInputShow = false;
  }

  descriptionClick(): void {
    this.descriptionEditorShow = true;
  }

  descriptionEditorOutsideClick(): void {
    this.descriptionEditorShow = false;
  }

  get summaryErrorMessage(): string {
    const ctrl = this.editTaskForm.controls.summary;

    if (ctrl.errors?.['minlength']) {
      return 'Summary must be at least 2 characters';
    }
    if (ctrl.errors?.['maxlength']) {
      return 'Summary must not exceed  80 characters';
    }

    return '';
  }

  get descriptionErrorMessage(): string {
    const ctrl = this.editTaskForm.controls.description;

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

  private fillPriorityOptions(taskPriorities: TaskPriority[]): void {
    this.priorityOptions = [];
    taskPriorities.forEach((element) => {
      this.priorityOptions.push(this.convertToOption(element));
    });
  }

  private fillStateOptions(states: TaskState[]): void {
    this.statusOptions = [];
    states.forEach((element) => {
      this.statusOptions.push(this.convertToOption(element));
    });
  }

  private fillTypeOptions(types: TaskType[]): void {
    this.typeOptions = [];
    types.forEach((element) => {
      this.typeOptions.push(this.convertToOption(element));
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
      .subscribe((types) => {
        if (!types.body) {
          return;
        }
        this.fillTypeOptions(types.body);
      });

    this.projectService.getProjectPriorities(projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((priorities) => {
        if (!priorities.body) {
          return;
        }
        this.fillPriorityOptions(priorities.body);
      });

    this.taskTemplateService.getAllProjectTaskStates(projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((states) => {
        if (!states.body) {
          return;
        }
        this.fillStateOptions(states.body);
      });
  }
}
