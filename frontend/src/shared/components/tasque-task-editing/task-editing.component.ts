import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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
  IconDefinition,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
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
import { ToastrNotificationService } from 'src/core/services/toastr-notification.service';
import { TaskUpdateModel } from 'src/core/models/task/task-update-model';
import { BoardType, IBoard, IUserCard } from '../select-users/Models';
import { UserService } from 'src/app/user/services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'tasque-task-editing',
  templateUrl: './task-editing.component.html',
  styleUrls: ['./task-editing.component.sass'],
})
export class TaskEditingComponent extends BaseComponent implements OnInit {
  @Input() public task: TaskModel;
  @Input() public currentUser: UserModel;
  @Input() public currentSprint: SprintModel;

  @Input() public btnText = 'Edit task';
  @Input() public btnClass = 'btn stroke';
  @Input() public btnIcon: IconDefinition | undefined;

  @Input() public isCurrentUserAdmin = false;
  @Input() public isCurrentUserProjectAdmin = false;

  @Output() public isChanging = new EventEmitter<boolean>();

  public organizationId: number;

  public editTaskForm = {} as FormGroup;
  public editTaskFormDefaultValues: unknown;

  public board: IBoard;

  public closeIcon = faXmark;
  public linkIcon = faLink;
  public checkIcon = faCheckToSlot;
  public shareIcon = faShareNodes;
  public paperClipIcon = faPaperclip;
  public ellipsisIcon = faEllipsisVertical;
  public faceSmileIcon = faFaceSmile;
  public editIcon = faPen;
  public editSquareIcon = faPenToSquare;
  public flagIcon = faFlag;
  public isChanged = new Observable<void>();

  public descriptionEditorShow = false;

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

  public isOpen = false;

  // eslint-disable-next-line max-params
  constructor(
    private fb: FormBuilder,
    private currentUserService: GetCurrentUserService,
    private taskTemplateService: TaskTemplateService,
    private projectService: ProjectService,
    private currentOrganizationService: GetCurrentOrganizationService,
    private taskService: TaskService,
    private taskStorageService: TaskStorageService,
    private sprintService: SprintService,
    private notificationService: ToastrNotificationService,
    private userService: UserService,
  ) {
    super();
  }

  public isShow = false;

  ngOnInit(): void {
    this.currentUserService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    this.currentOrganizationService.currentOrganizationId$.subscribe(
      (orgId) => {
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
      },
    );

    this.editTaskForm = this.fb.group({
      project: [this.convertToOption(this.task.project)],
      summary: [
        this.task.summary,
        [Validators.minLength(2), Validators.maxLength(80)],
      ],
      sprint: [this.convertToOption(this.currentSprint)],
      status: [this.convertToOption(this.task.state)],
      priority: [this.convertToOption(this.task.priority)],
      type: [this.convertToOption(this.task.type)],
      description: [this.task.description, [Validators.maxLength(5000)]],
      assignees: [this.task.users],
    });

    this.editTaskFormDefaultValues = this.editTaskForm.value;

    this.editTaskForm.controls.project.valueChanges.subscribe(
      (option: TasqueDropdownOption) => {
        this.getProjectInfo(option.id);
      },
    );
    // this.isShow = true;

    this.board = {
      id: 1,
      type: BoardType.Board,
      users: this.task.users?.map((user) => this.convertToUserCard(user)) ?? [],
      hasRoles: true,
    };
  }

  public titleContent(event: Event): string {
    const input = event.target as HTMLElement;
    return input.innerText;
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
    item:
      | TaskState
      | TaskPriority
      | TaskType
      | SprintModel
      | ProjectModel
      | undefined,
  ): TasqueDropdownOption {
    if (!item) {
      return {
        id: 0,
        title: '-',
        color: this.getColorById(0),
      };
    }

    if ('color' in item) {
      return {
        id: item.id,
        title: item.name,
        color: item.color,
      };
    }

    return {
      id: item.id,
      title: item.name,
      color: this.getColorById(item.id),
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

    this.sprintService
      .getProjectSprints(projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((sprints) => {
        if (!sprints.body) {
          return;
        }
        this.fillSprintOptions(sprints.body);
      });

    this.taskTemplateService
      .getAllProjectTaskTypes(projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((types) => {
        if (!types.body) {
          return;
        }
        this.fillTypeOptions(types.body);
      });

    this.projectService
      .getProjectPriorities(projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((priorities) => {
        if (!priorities.body) {
          return;
        }
        this.fillPriorityOptions(priorities.body);
      });

    this.taskTemplateService
      .getAllProjectTaskStates(projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((states) => {
        if (!states.body) {
          return;
        }
        this.fillStateOptions(states.body);
      });
  }

  public clearForm(): void {
    this.editTaskForm.reset(this.editTaskFormDefaultValues, {
      emitEvent: false,
    });
  }

  public submitForm(addUser?: boolean): void {
    if (this.editTaskForm.invalid) {
      this.notificationService.error(
        'Some values are incorrect. Follow error messages to solve this problem',
        'Invalid values',
      );
      return;
    }

    if (this.editTaskForm.pristine) {
      this.notificationService.error('Data hasn`t been changed');
      return;
    }

    const updatedTask = {
      ...this.task,
      users: this.editTaskForm.controls.assignees.value,
      description: this.editTaskForm.controls.description.value,
      summary: this.editTaskForm.controls.summary.value,
      priorityId: this.editTaskForm.controls.priority.value.id,
      stateId: this.editTaskForm.controls.status.value.id,
      typeId: this.editTaskForm.controls.type.value.id,
      projectId: this.editTaskForm.controls.project.value.id,
      sprintId:
        this.editTaskForm.controls.sprint.value.id !== 0
          ? this.editTaskForm.controls.sprint.value.id
          : undefined,
    } as TaskUpdateModel;

    this.taskService
      .updateTask(updatedTask)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((task) => {
        if (!addUser) {
          this.notificationService.success(
            'Task has been updated successfully',
          );
        }
        this.isChanged = new Observable<void>();
        if (task.body) {
          this.taskStorageService.updateTask(task.body);
          this.editTaskFormDefaultValues = this.editTaskForm.value;
          this.task = task.body;
        }
      })
      .add(() => {
        this.clearForm();
      });
    this.isChanging.emit(false);
  }

  toogleModal(event: boolean): void {
    this.isOpen = event;
    this.isChanging.emit(event);
  }

  addUser(email: string): void {
    const isUserAdded = this.board.users.find((user) => user.email == email)
      ? true
      : false;

    if (isUserAdded) {
      this.notificationService.error(
        'User with given email has already been added',
      );
      return;
    }

    this.userService
      .getUserByEmail(email)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user) => {
        if (!user.body) {
          return;
        }
        this.editTaskForm.controls.assignees.value.push(user.body);
        this.board.users.push(this.convertToUserCard(user.body));
        this.editTaskForm.markAsDirty();
        this.submitForm(true);
        this.isChanged = new Observable<void>();
      });
  }

  deleteUser(email: string): void {
    const boardIndex = this.board.users.findIndex((x) => x.email === email);
    this.board.users.splice(boardIndex, 1);
    const index = this.editTaskForm.controls.assignees.value.findIndex(
      (x: UserModel) => x.email === email,
    );
    this.editTaskForm.controls.assignees.value.splice(index, 1);
    this.editTaskForm.markAsDirty();
    this.isChanged = new Observable<void>();
  }

  // TODO: Remove it when tasque-select-users is redesigned
  private convertToUserCard(user: UserModel): IUserCard {
    return {
      id: user.id,
      email: user.email,
      userName: user.name,
      profileURL: '',
      role: null,
    };
  }
}
