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
import { TaskTypeService } from 'src/core/services/task-type.service';
import { TaskStateService } from 'src/core/services/task-state.service';
import { SprintService } from 'src/core/services/sprint.service';
import { NewSprintModel } from 'src/core/models/sprint/new-sprint-model';
import { IssueSort } from '../backlog/models';
import { TaskService } from 'src/core/services/task.service';
import { NotificationService } from 'src/core/services/notification.service';

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
  public isCurrentUserAdmin: boolean;

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

  constructor(
    public backlogService: BacklogService,
    public taskTypeService: TaskTypeService,
    public taskStateService: TaskStateService,
    public sprintService: SprintService,
    public taskService: TaskService,
    public notificationService: NotificationService,
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
    this.role =
      (this.currentUser?.organizationRoles?.find(
        (m) =>
          m.organizationId === this.project.organizationId &&
          m.userId === this.currentUser.id,
      )?.role as UserRole) || 0;

    if (UserRole.OrganizationAdmin <= this.role) {
      this.isCurrentUserAdmin = true;
    }

    this.getTasksState();
    this.getTasksType();
    this.getBacklogTasks();
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
            this.notificationService.success('Task moved to backlog');
          }
        });
    }
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
    this.taskStateService
      .getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.taskStates = result.body;
        }
      });
  }

  public getTasksType(): void {
    this.taskTypeService
      .getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.taskTypes = result.body;
        }
      });
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

    this.sprintService
      .create(newSprint)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.sprints.push(result.body);
        }
      });
  }
}
