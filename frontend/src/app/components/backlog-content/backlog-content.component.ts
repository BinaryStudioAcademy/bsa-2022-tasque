import { Component, Input, OnInit } from '@angular/core';
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
import { TaskModelDto } from 'src/core/models/task/task-model-dto';
import { UserRole } from 'src/core/models/user/user-roles';
import { TaskTypeService } from 'src/core/services/task-type.service';
import { TaskStateService } from 'src/core/services/task-state.service';

@Component({
  selector: 'app-backlog-content',
  templateUrl: './backlog-content.component.html',
  styleUrls: ['./backlog-content.component.sass'],
})
export class BacklogContentComponent implements OnInit {
  iconDown = faAngleDown;
  iconPlus = faPlus;
  flagIcon = faFlag;
  btnClass = 'bold';

  public unsubscribe$ = new Subject<void>();
  subscription: Subscription;

  // TODO remove when real data is available
  @Input() public taskStates: TaskState[] = [
    {
      id: 1,
      name: 'To Do',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'In Progress',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: 'Done',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 4,
      name: 'Canceled',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // TODO remove when real data is available
  @Input() public taskPriorities: TaskPriority[] = [
    {
      id: 1,
      name: 'Low',
      projectId: 5,
      type: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Normal',
      projectId: 5,
      type: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: 'High',
      projectId: 5,
      type: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // TODO remove when real data is available
  @Input() public taskTypes: TaskType[] = [
    {
      id: 1,
      name: 'Bug',
      createdAt: new Date(),
      updatedAt: new Date(),
      icon: this.flagIcon,
    },
    {
      id: 2,
      name: 'Feature',
      createdAt: new Date(),
      updatedAt: new Date(),
      icon: this.flagIcon,
    },
    {
      id: 3,
      name: 'Enhancement',
      createdAt: new Date(),
      updatedAt: new Date(),
      icon: this.flagIcon,
    },
  ];

  // TODO remove when real data is available
  @Input() public project: ProjectModel = {
    id: 1,
    name: 'project 1',
    key: 'PR-1',
    authorId: 0,
    organizationId: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  public sprints$: Observable<SprintModel[]>;

  @Input() public sprints: SprintModel[];

  // TODO remove when real data is available
  @Input() public users: UserModel[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'email',
      organizationRoles: [
        { organizationId: 1, userId: 2, role: UserRole.organizationMember },
        { organizationId: 2, userId: 2, role: UserRole.organizationMember },
      ],
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'email',
      organizationRoles: [
        { organizationId: 1, userId: 2, role: UserRole.organizationMember },
        { organizationId: 2, userId: 2, role: UserRole.organizationMember },
      ],
    },
    {
      id: 3,
      name: 'James McGuill',
      email: 'email',
      organizationRoles: [
        { organizationId: 1, userId: 2, role: UserRole.organizationMember },
        { organizationId: 2, userId: 2, role: UserRole.organizationMember },
      ],
    },
  ];

  public tasks$: Observable<TaskModel[]>;

  // TODO remove when real data is available
  @Input() public tasks: TaskModelDto[] = [];
  constructor(
    public backlogService: BacklogService,
    public taskTypeService: TaskTypeService,
    public taskStateService: TaskStateService,
  ) {
    this.subscription = backlogService.changeBacklog$.subscribe(() => {
      this.getBacklogTasks();
    });
  }

  ngOnInit(): void {
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

  drop(event: CdkDragDrop<TaskModelDto[]>): void {
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
    }
  }

  getBacklogTasks(): void {
    this.backlogService
      .getBacklogTasks(this.project.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.tasks = result.body;
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

  test() {
    let sprint: SprintModel;
    sprint = {
      id: 31,
      projectId: 1,
      name: `${this.project.key} Sprint ${this.sprints.length + 1}`,
      description: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      endAt: new Date(),
      tasks: [],
    };
    this.sprints.push(sprint);
  }
}
