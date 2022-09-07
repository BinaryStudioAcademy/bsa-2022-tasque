import { Component, Input, OnInit } from '@angular/core';
import { faAngleDown, faFlag, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TaskModel } from 'src/core/models/task/task-model';
import { TaskType } from 'src/core/models/task/task-type';
import { TasqueDropdownOption } from 'src/shared/components/tasque-dropdown/dropdown.component';
import { TaskState } from 'src/core/models/task/task-state';
import { Observable, Subject } from 'rxjs';
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
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Normal',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: 'High',
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

  // TODO remove when real data is available
  @Input() public sprints: SprintModel[] = [
    {
      id: 1,
      projectId: 3,
      name: 'spr1',
      description: 'sprint desc',
      createdAt: new Date(),
      updatedAt: new Date(),
      tasks: [],
    },
    {
      id: 2,
      projectId: 3,
      name: 'spr2',
      description: 'sprint desc',
      createdAt: new Date(),
      updatedAt: new Date(),
      tasks: [],
    },
    {
      id: 3,
      projectId: 3,
      name: 'spr3',
      description: 'sprint desc',
      createdAt: new Date(),
      updatedAt: new Date(),
      tasks: [],
    },
  ];

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
  constructor(public backlogService: BacklogService) {}

  ngOnInit(): void {
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

  drop(event: CdkDragDrop<TaskModelDto[]>) {
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
}
