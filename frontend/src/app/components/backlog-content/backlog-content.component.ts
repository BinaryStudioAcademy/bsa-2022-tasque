import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { faAngleDown, faFlag, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TaskModel } from 'src/core/models/task/task-model';
import { TaskType } from 'src/core/models/task/task-type';
import { TasqueDropdownOption } from 'src/shared/components/tasque-dropdown/dropdown.component';
import { TaskState } from 'src/core/models/task/task-state';
import { Observable, Subject, Subscription } from 'rxjs';
import { UserModel } from 'src/core/models/user/user-model';
import { SprintModel } from 'src/core/models/sprint/sprint-model';
import { ProjectModel } from 'src/core/models/project/project-model';
import { TaskPriority } from 'src/core/models/task/task-priority';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { BacklogService } from 'src/core/services/backlog.service';
import { takeUntil } from 'rxjs/operators';
import { UserRole } from 'src/core/models/user/user-roles';
import { NewSprintModel } from 'src/core/models/sprint/new-sprint-model';
import { IssueSort } from '../backlog/models';
import { TaskService } from 'src/core/services/task.service';
import { ToastrNotificationService } from 'src/core/services/toastr-notification.service';
import { GetCurrentOrganizationService } from 'src/core/services/get-current-organization.service';
import { OrganizationService } from 'src/core/services/organization.service';
import { OrganizationModel } from 'src/core/models/organization/organization-model';
import { ScopeBoardService } from 'src/core/services/scope/scope-board-service';
import { UserProjectRole } from 'src/core/models/user/user-project-roles';
import { BusinessRole } from 'src/shared/components/select-users/Models';
import { TaskStorageService } from 'src/core/services/task-storage.service';

@Component({
  selector: 'app-backlog-content',
  templateUrl: './backlog-content.component.html',
  styleUrls: ['./backlog-content.component.sass'],
})
export class BacklogContentComponent implements OnInit, OnChanges {
  iconDown = faAngleDown;
  iconPlus = faPlus;
  flagIcon = faFlag;
  btnClass = 'btn mini voilet full';

  public role: UserRole;
  public isCurrentUserAdmin = false;
  public isCurrentUserProjectAdmin = false;

  public unsubscribe$ = new Subject<void>();
  subscription: Subscription;
  public tasksShow: TaskModel[];

  @Input() public currentUser: UserModel;
  @Input() public project: ProjectModel;
  //Get the criteria by which the issue will be sorted
  @Input() public filterIssue: IssueSort;
  //Get the string by which issue will be searched
  @Input() public inputSearch = '';

  @Input() public taskStates: TaskState[] = [];
  @Input() public taskPriorities: TaskPriority[] = [];
  @Input() public taskTypes: TaskType[] = [];

  public sprints$: Observable<SprintModel[]>;

  @Input() public sprints: SprintModel[];
  @Input() public users: UserModel[] = [];
  @Input() public tasks: TaskModel[] = [];

  public tasks$: Observable<TaskModel[]>;
  public isDragable = true;

  constructor(
    public backlogService: BacklogService,
    public taskService: TaskService,
    public notificationService: ToastrNotificationService,
    private currentOrganizationService: GetCurrentOrganizationService,
    private organizationService: OrganizationService,
    public scopeBoardService: ScopeBoardService,
    private taskStorageService: TaskStorageService
  ) {
    this.subscription = backlogService.changeBacklog$.subscribe(() => {
      this.getBacklogTasks();
    });
  }

  ngOnChanges(): void {
    this.filterItems();
  }

  ngOnInit(): void {
    if (this.currentUser === undefined) {
      return;
    }

    this.permissionToEdit();
    this.getTasksState();
    this.getTasksType();
    this.getBacklogTasks();

    this.taskStorageService.taskUpdated$.subscribe((task) => {
      if (task.sprintId || this.tasks.some((t) => t.id === task.id)) {
        return;
      }

      this.tasks.push(task);
      this.tasks.sort((task1, task2) => task1.id - task2.id);
    });
  }

  toggleDropdown(): void {
    const dropdown = document.getElementById('backlog-issues');
    dropdown?.classList.toggle('show');

    const icon = document.getElementById('dropdown-arrow-icon');
    icon?.classList.toggle('down');
  }

  generateBtnClasses(): string {
    return 'btn toggle-backlog-dropdown';
  }

  taskStateToDropdownArray(types: TaskState[]): TasqueDropdownOption[] {
    return types.map((type) => {
      return {
        id: type.id,
        title: type.name,
        color: '',
      };
    });
  }

  dropSprint(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.sprints, event.previousIndex, event.currentIndex);
  }

  drop(event: CdkDragDrop<TaskModel[]>): void {
    const _task = event.previousContainer.data[event.previousIndex];

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      _task.sprintId = undefined;

      this.taskService
        .updateTask(_task)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((result) => {
          if (result.body) {
            this.notificationService.success(
              `Task ${_task.key} moved to backlog`,
            );
          }
        });
    }
  }

  toogleIsDragable(val: boolean): void {
    this.isDragable = !val;
  }

  getBacklogTasks(): void {
    this.backlogService
      .getBacklogTasks(this.project.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.tasksShow = this.tasks = result.body;
        }
      });
  }

  public getTasksState(): void {
    this.taskStates = this.project.projectTaskStates;
  }

  public getTasksType(): void {
    this.taskTypes = this.project.projectTaskTypes;
  }

  //Sort tasks in a sprint (by keyword or IssueSort)
  filterItems(): void {
    if (this.tasksShow) {
      if (this.inputSearch) {
        this.tasks = this.tasksShow.filter((item) => {
          return item.summary
            .toLowerCase()
            .includes(this.inputSearch.toLowerCase());
        });
      } else {
        this.tasks = this.tasksShow;
      }

      if (this.filterIssue == IssueSort.All) {
        this.tasks.sort((a) => a.id);
      } else if (this.filterIssue == IssueSort.OnlyMyIssues) {
        this.tasks = this.tasks.filter((item) => {
          return item.authorId == this.currentUser.id;
        });
      } else if (this.filterIssue == IssueSort.RecentlyUpdated) {
        this.tasks.sort(
          (a, b) =>
            new Date(b.deadline).getTime() - new Date(a.deadline).getTime(),
        );
      }
    }
  }

  createSprint(): void {
    const newSprint: NewSprintModel = {
      projectId: this.project.id,
      name: `${this.project.key} Sprint ${this.sprints.length + 1}`,
      authorId: this.currentUser.id,
    };

    this.scopeBoardService.sprintService
      .create(newSprint)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.sprints.push(result.body);
        }
      });
  }

  permissionToEdit(): void {
    const organizationId =
      this.currentOrganizationService.currentOrganizationId;
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

        const projectRole = this.currentUser.roles?.find(
          (r) =>
            r.projectId === this.project.id && r.userId === this.currentUser.id,
        ) as UserProjectRole;

        if (
          projectRole.roleId == BusinessRole.Admin ||
          this.isCurrentUserAdmin
        ) {
          this.isCurrentUserProjectAdmin = true;
        } else {
          this.isCurrentUserProjectAdmin = false;
        }
      });
  }

  public deleteIssue(id: number): void {
    const index = this.tasks.findIndex((x) => x.id == id);
    this.tasks.splice(index, 1);
  }
}
