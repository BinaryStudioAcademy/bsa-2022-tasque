import { Component, Input, OnInit } from '@angular/core';
import { faAngleDown, faFlag, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TaskModel } from 'src/core/models/task/task-model';
import { TaskType } from 'src/core/models/task/task-type';
import { TasqueDropdownOption } from 'src/shared/components/tasque-dropdown/dropdown.component';
import { TaskState } from 'src/core/models/task/task-state';
import { Observable } from 'rxjs';
import { UserModel } from 'src/core/models/user/user-model';
import { SprintModel } from 'src/core/models/sprint/sprint-model';
import { ProjectModel } from 'src/core/models/project/project-model';
import { TaskPriority } from 'src/core/models/task/task-priority';
import { UserRole } from 'src/core/models/user/user-roles';

@Component({
  selector: 'app-backlog-content',
  templateUrl: './backlog-content.component.html',
  styleUrls: ['./backlog-content.component.sass']
})
export class BacklogContentComponent implements OnInit {

  iconDown = faAngleDown;
  iconPlus = faPlus;
  flagIcon = faFlag;
  btnClass = 'bold';

  // TODO remove when real data is available
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

  // TODO remove when real data is available
  @Input() public taskPriorities: TaskPriority[] = [
    {
      id: 1,
      name: 'Low',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Normal',
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

  // TODO remove when real data is available
  @Input() public taskTypes: TaskType[] = [
    {
      id: 1,
      name: 'Bug',
      createdAt: new Date(),
      updatedAt: new Date(),
      icon: this.flagIcon
    },
    {
      id: 2,
      name: 'Feature',
      createdAt: new Date(),
      updatedAt: new Date(),
      icon: this.flagIcon
    },
    {
      id: 3,
      name: 'Enhancement',
      createdAt: new Date(),
      updatedAt: new Date(),
      icon: this.flagIcon
    },
  ];

  // TODO remove when real data is available
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

  public sprints$: Observable<SprintModel[]>;

  // TODO remove when real data is available
  public sprints: SprintModel[] = [
    {
      id: 1,
      projectId: 3,
      name: 'spr1',
      description: 'sprint desc',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      projectId: 3,
      name: 'spr2',
      description: 'sprint desc',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      projectId: 3,
      name: 'spr3',
      description: 'sprint desc',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // TODO remove when real data is available
  @Input() public users: UserModel[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'email',
      organizationRoles: [ { organizationId: 1, userId: 2, role: UserRole.organizationMember }, { organizationId: 2, userId: 2, role: UserRole.organizationMember } ]
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'email',
      organizationRoles: [ { organizationId: 1, userId: 2, role: UserRole.organizationMember }, { organizationId: 2, userId: 2, role: UserRole.organizationMember } ]
    },
    {
      id: 3,
      name: 'James McGuill',
      email: 'email',
      organizationRoles: [ { organizationId: 1, userId: 2, role: UserRole.organizationMember }, { organizationId: 2, userId: 2, role: UserRole.organizationMember } ]
    }
  ];

  public tasks$: Observable<TaskModel[]>;

  // TODO remove when real data is available
  public tasks: TaskModel[] = 
  // []
  [
    {
      id: 1,
      summary: 'Create Backlog',
      description: 'Lorem ipsum',
      state: this.taskStates.filter((s) => s.name == 'In Progress')[0],
      type: this.taskTypes.filter((t) => t.name == 'Feature')[0],
      priority: this.taskPriorities.filter((p) => p.name == 'High')[0],
      author: this.users.filter((u) => u.id == 1)[0],
      project: this.projects.filter((p) => p.key == 'PR-1')[0],
      sprint: this.sprints.filter((s) => s.id == 1)[0],
      lastUpdatedBy: this.users.filter((u) => u.id == 1)[0],
      parentTaskId: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      deadline: new Date()
    },
    {
      id: 2,
      summary: 'Merge Backlog',
      description: 'Lorem ipsum',
      state: this.taskStates.filter((s) => s.name == 'To Do')[0],
      type: this.taskTypes.filter((t) => t.name == 'Feature')[0],
      priority: this.taskPriorities.filter((p) => p.name == 'High')[0],
      author: this.users.filter((u) => u.id == 1)[0],
      project: this.projects.filter((p) => p.key == 'PR-2')[0],
      sprint: this.sprints.filter((s) => s.id == 1)[0],
      lastUpdatedBy: this.users.filter((u) => u.id == 1)[0],
      parentTaskId: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      deadline: new Date()
    }
  ];

  constructor() { }

  ngOnInit(): void {
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
        color: ''
      };
    });
  }

}
