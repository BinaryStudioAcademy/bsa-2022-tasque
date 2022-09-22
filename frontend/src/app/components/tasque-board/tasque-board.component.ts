import {
  Component,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import { BoardColumnModel } from '../../../core/models/board/board-column-model';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TaskInfoModel } from 'src/core/models/board/task-Info-model';
import { UserModel } from 'src/core/models/user/user-model';
import { NotificationService } from 'src/core/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { InputComponent } from 'src/shared/components/tasque-input/input.component';
import { TasqueDropdownOption } from 'src/shared/components/tasque-dropdown/dropdown.component';
import { TaskType } from 'src/core/models/task/task-type';
import { TaskModel } from 'src/core/models/task/task-model';
import { ProjectModel } from 'src/core/models/project/project-model';
import { ScopeBoardService } from 'src/core/services/scope/scope-board-service';
import { TaskState } from 'src/core/models/task/task-state';
import { TaskStorageService } from 'src/core/services/task-storage.service';
import { SprintModel } from 'src/core/models/sprint/sprint-model';
import { take } from 'rxjs/operators';
import { ValidationConstants } from 'src/core/models/const-resources/validation-constraints';
import { ScopeGetCurrentEntityService } from 'src/core/services/scope/scopre-get-current-entity.service';
import { UserRole } from 'src/core/models/user/user-roles';
import { OrganizationService } from 'src/core/services/organization.service';
import { OrganizationModel } from 'src/core/models/organization/organization-model';

@Component({
  selector: 'tasque-board',
  templateUrl: './tasque-board.component.html',
  styleUrls: ['./tasque-board.component.sass'],
})
export class TasqueBoardComponent implements OnInit, OnDestroy {
  public searchIcon = faMagnifyingGlass;
  public plusIcon = faPlus;

  public isOpenColumnAddDialog: boolean;
  public createColumnForm: FormGroup;
  @ViewChild('searchInput') public searchInput: InputComponent;
  @Output() urlChanged = new EventEmitter<Observable<void>>();

  public selectedUserId?: number;
  private newColumn: TaskState;
  private projectId: number;

  public currentUser: UserModel;
  public role: UserRole;
  public isCurrentUserAdmin = false;

  public unsubscribe$ = new Subject<void>();

  public project: ProjectModel;
  public projectUsers: UserModel[] = [];
  user: UserModel;
  public hasTasks = false;
  public isShow = false;
  public isDraggable = true;
  public searchParameter = '';
  colors = [
    '#D47500',
    '#00AA55',
    '#E3BC01',
    '#009FD4',
    '#B281B3',
    '#D47500',
    '#DC2929',
  ];

  public columns: BoardColumnModel[] = [];
  public projectTasks: TaskModel[] = [];
  public currentSprint: SprintModel;

  public projectOptions: TasqueDropdownOption[] = [];
  public projectTaskTypes: TaskType[] = [];

  public statusColumn = false;

  constructor(
    formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private boardService: ScopeBoardService,
    private notificationService: NotificationService,
    private getCurrentEntityService: ScopeGetCurrentEntityService,
    private taskStorageService: TaskStorageService,
    private router: Router,
    private organizationService: OrganizationService,
  ) {
    this.getCurrentEntityService.getCurrentUserService.currentUser$.subscribe(
      (res) => {
        this.user = res as UserModel;
      },
    );

    this.createColumnForm = formBuilder.group({
      'columnName': [
        '',
        [
          Validators.required,
          Validators.minLength(ValidationConstants.minLengthName),
          Validators.maxLength(ValidationConstants.maxLengthName),
          Validators.pattern(/[a-zA-Z0-9]/),
        ],
      ],
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    const id = this.route.parent?.snapshot.paramMap.get('id');
    if (id == null) {
      this.notificationService.error('Path id is null');
      return;
    }
    this.projectId = parseInt(id);
    this.getSelectedUserFromQuery();

    this.boardService.projectService
      .getProjectById(this.projectId)
      .subscribe((resp) => {
        if (resp.ok) {
          this.project = resp.body as ProjectModel;
          this.projectUsers = this.project.users;
          this.updateHeader();
          this.setColumns();

          this.permissionToEdit();
        } else {
          this.notificationService.error('Something went wrong');
        }
      });

    this.subscribeToTasksUpdate();
  }

  getCurrentSprintAndTasks(): void {
    this.boardService.sprintService
      .getCurrentSprintByProjectId(this.projectId)
      .subscribe(
        (resp) => {
          if (resp.ok) {
            this.currentSprint = resp.body as SprintModel;
            this.projectTasks = this.currentSprint.tasks;
            this.hasTasks = this.checkIfHasTasks();
            this.sortTasksByColumns();
          } else {
            this.notificationService.error('Something went wrong');
          }
        },
        () => {
          this.isShow = true;
        },
      );
  }

  sortTasksByColumns(): void {
    this.columns.forEach((c) => {
      const tasks = this.projectTasks
        .filter((t) => t.stateId === c.id)
        .sort((x) => x.order);
      const taskInfo: TaskInfoModel[] = [];

      tasks.forEach((t) => {
        taskInfo.push({
          ...t,
          customLabels: [],
          assignees: t.users,
          key: t.key as string,
          isHidden: false,
        } as TaskInfoModel);
      });
      c.tasks = taskInfo;
    });
    this.filterTasks();
  }

  setColumns(): void {
    const states = this.project?.projectTaskStates as TaskState[];
    states.forEach((s) =>
      this.columns.push({
        id: s.id,
        name: s.name,
        tasks: [],
      }),
    );
    this.getCurrentSprintAndTasks();
  }

  openAddColumn(): void {
    this.isOpenColumnAddDialog = true;
  }

  addColumn(): void {
    if (this.createColumnForm.valid) {
      this.newColumn = {
        id: 0,
        name: this.createColumnForm.get('columnName')?.value,
        projectId: this.projectId,
        status: this.statusColumn,
        color: this.colors[this.projectId % this.colors.length],
      };
      this.columns.push({
        id: this.newColumn.id,
        name: this.newColumn.name,
        tasks: [],
      });
      this.createColumnForm.reset();
      this.isOpenColumnAddDialog = false;
      this.updateColumns();
    }
  }

  onClickedOutside(): void {
    this.isOpenColumnAddDialog = false;
    this.createColumnForm.reset();
  }

  dragDrop(event: CdkDragDrop<TaskInfoModel[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.orderTasks(event);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.updateTasks(event);
    }
  }

  orderTasks(event: CdkDragDrop<TaskInfoModel[]>): void {
    const tasks = event.container.data.map((x) => x.id);
    this.boardService.taskService
      .setOrder(tasks)
      .pipe(take(1))
      .subscribe((resp) => {
        event.container.data = resp.body as TaskInfoModel[];
      });
  }

  updateColumns(): void {
    this.boardService.taskStateService
      .createTaskState(this.newColumn)
      .subscribe(
        () => {
          this.notificationService.success(
            'Column has been created successfully',
          );
          this.filterTasks();
        },
        () => {
          this.notificationService.error(
            'Something went wrong, try again later',
          );
        },
      );
  }

  updateTasks(event: CdkDragDrop<TaskInfoModel[]>): void {
    const model = event.container.data[event.currentIndex];
    this.columns.forEach((c) => {
      if (c.tasks === event.container.data) {
        const task = this.projectTasks.find(
          (t) => t.id === model.id,
        );

        if (!task) {
          return;
        }

        task.stateId = c.id;
        task.state = this.project?.projectTaskStates.find((state) => state.id === c.id);

        for (const col of this.columns) {
          const index = col.tasks.findIndex((t) => task.id === t.id);

          if (index === -1) {
            continue;
          }

          col.tasks[index].state = task.state;
          col.tasks[index].stateId = task.stateId;
          return;
        }

        this.boardService.taskService.updateTask(task).subscribe((resp) => {
          if (!resp.ok) {
            this.notificationService.error(
              'Something went wrong, try again later',
            );
          }
        });
      }
    });
  }

  checkIfHasTasks(): boolean {
    if (this.projectTasks.length > 0) {
      return true;
    }
    return false;
  }

  filterTasks(): void {
    let phrase = '';
    if (this.searchInput) {
      phrase = this.searchInput.inputValue;
    }
    for (const column of this.columns) {
      if (column.tasks) {
        for (const task of column.tasks) {
          task.isHidden = !task.summary
            .toLowerCase()
            .includes(phrase.toLowerCase());
          if (this.selectedUserId && task.assignees) {
            task.isHidden =
              task.isHidden ||
              !task.assignees.some((user) => user.id == this.selectedUserId);
          }
        }
      }
    }
    this.isShow = true;
  }

  userSelected(event: UserModel): void {
    if (this.selectedUserId && event.id === this.selectedUserId) {
      this.selectedUserId = undefined;
      this.router.navigate([], { queryParams: {} });
    } else {
      this.selectedUserId = event.id;
      this.router.navigate([], { queryParams: { user: this.selectedUserId } });
    }
    this.filterTasks();
  }

  getSelectedUserFromQuery(): void {
    const userId = this.route.snapshot.queryParamMap.get('user');
    if (userId) {
      this.selectedUserId = Number(userId);
    }
  }

  toogleIsDraggable(val: boolean): void {
    this.isDraggable = !val;
  }

  moveToBackLog(): void {
    this.router.navigateByUrl(`/project/${this.projectId}/backlog`, {
      replaceUrl: true,
    });
    this.urlChanged.emit();
  }

  moveToSettings(): void {
    this.router.navigateByUrl(
      `/project/${this.projectId}/settings/issue-template`,
      {
        replaceUrl: true,
      },
    );
    this.urlChanged.emit();
  }

  updateHeader(): void {
    this.getCurrentEntityService.getCurrentOrganizationService.currentOrganizationId =
      this.project.organizationId;
    this.getCurrentEntityService.getCurrentProjectService.currentProjectId =
      this.project.id;
  }

  statusChanged(val: boolean): void {
    this.statusColumn = val;
  }

  public subscribeToTasksUpdate(): void {
    this.taskStorageService.taskUpdated$.subscribe((task) => {
      for (const col of this.columns) {
        const index = col.tasks.findIndex((t) => task.id === t.id);

        if (index === -1) {
          continue;
        }

        if (this.currentSprint.projectId !== task.projectId) {
          col.tasks.splice(index, 1);
          return;
        }

        if (this.currentSprint.id !== task.sprintId) {
          col.tasks.splice(index, 1);
          return;
        }

        const currentTask = {
          ...task,
          customLabels: [],
          stateId: task.state?.id,
          key: task.key as string,
          isHidden: false,
        } as TaskInfoModel;

        if (task.state?.id !== col.id) {
          const rightColumn = this.columns.find((column) => column.id === task.state?.id);
          rightColumn?.tasks.push(currentTask);
          col.tasks.splice(index, 1);
          return;
        }

        if (task.state?.id === col.id) {
          col.tasks[index] = currentTask;
          return;
        }

        return;
      }
    });
  }

  public permissionToEdit(): void {
    this.getCurrentEntityService.getCurrentUserService.currentUser$.subscribe(
      (user) => {
        this.currentUser = user;
        if (this.currentUser === undefined) {
          this.role = 0;
        } else {
          const organizationId =
            this.getCurrentEntityService.getCurrentOrganizationService
              .currentOrganizationId;
          this.organizationService
            .getOrganization(organizationId)
            .subscribe((resp) => {
              const currentOrganization = resp.body as OrganizationModel;
              const role = this.currentUser.organizationRoles.find(
                (r) =>
                  r.organizationId === organizationId &&
                  r.userId === this.currentUser.id,
              )?.role as UserRole;
              if (
                role >= UserRole.projectAdmin ||
                currentOrganization.authorId === this.currentUser.id
              ) {
                this.isCurrentUserAdmin = true;
              } else {
                this.isCurrentUserAdmin = false;
              }
            });
        }
      },
    );
  }
}
