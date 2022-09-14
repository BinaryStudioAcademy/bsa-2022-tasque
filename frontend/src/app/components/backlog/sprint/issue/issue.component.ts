import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/user/services/user.service';
import { TaskEstimateUpdate } from 'src/core/models/task/task-estimate-update';
import { UserModel } from 'src/core/models/user/user-model';
import { SprintService } from 'src/core/services/sprint.service';
import { TasqueDropdownOption } from 'src/shared/components/tasque-dropdown/dropdown.component';
import { TaskType } from 'src/core/models/task/task-type';
import { TaskState } from 'src/core/models/task/task-state';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import { TaskModel } from 'src/core/models/task/task-model';
import { TaskService } from 'src/core/services/task.service';
import { NotificationService } from 'src/core/services/notification.service';
import { ProjectModel } from 'src/core/models/project/project-model';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.sass'],
})
export class IssueComponent implements OnInit {
  //Get the issue to display it in the component
  @Input() public issue: TaskModel;
  //get current user
  @Input() public currentUser: UserModel;
  //get current project
  @Input() public currentProject: ProjectModel;
  //notifying the parent components about the change in the value of estimate
  @Output() estimate = new EventEmitter<void>();
  flagIcon = faFlag;
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
  @Input() public taskStates: TaskState[] = [
<<<<<<< HEAD
    {
      id: 1,
      name: 'To Do',
      projectId: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'In Progress',
      projectId: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: 'Done',
      projectId: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 4,
      name: 'Canceled',
      projectId: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
=======
    // {
    //   id: 1,
    //   name: 'To Do',
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // },
    // {
    //   id: 2,
    //   name: 'In Progress',
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // },
    // {
    //   id: 3,
    //   name: 'Done',
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // },
    // {
    //   id: 4,
    //   name: 'Canceled',
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // },
>>>>>>> 5099a8a217cc1316f9c9ff96e25a368125750e29
  ];

  public taskEstimate: TaskEstimateUpdate;
  public unsubscribe$ = new Subject<void>();

  constructor(
    public userServise: UserService,
    public taskServise: TaskService,
    public sprintService: SprintService,
    public notificationService: NotificationService,
<<<<<<< HEAD
  ) { }

  ngOnInit(): void {
=======
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getIssueAuthor();
    this.estimateUpdate();
    this.cdRef.detectChanges();
  }

  //Get the author of the sprint, and display his avatar,
  //if the author does not have an avatar, display a stub
  public getIssueAuthor(): void {
    this.userServise
      .getUserById(this.issue.authorId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.issueAuthor = result.body;
          if (this.issueAuthor.avatarURL == undefined) {
            this.issueAuthor.avatarURL = '\\assets\\avatar.png';
          }
        }
      });
>>>>>>> 5099a8a217cc1316f9c9ff96e25a368125750e29
  }

  public deadline(): Date {
    return new Date(this.issue.deadline);
  }
  estimateUpdate(): void {
    this.estimate.emit();
  }

  //When updating an estimate for a task - update the total estimate for the sprint
  //and update the estimate value for the task in the database
  estimateChange(): void {
    this.estimate.emit();
    this.taskEstimate = {
      taskId: this.issue.id,
      sprintId: this.issue.sprint?.id,
      estimate: this.issue.estimate ?? 0,
    };

    this.sprintService
      .updateTaskEstimate(this.taskEstimate)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  taskStateToDropdownArray(types: TaskState[]): TasqueDropdownOption[] {
    return types?.map((type) => {
      return {
        id: type.id,
        title: type.name,
        color: '',
      };
    });
  }

  currentTaskState(): string {
    return (
      this.taskStates?.find((el) => el.id == this.issue.state.id)?.name ??
      'Task state'
    );
  }

  currentTaskType(): string {
    return (
      this.taskTypes?.find((el) => el.id == this.issue.type.id)?.name ?? 'issue'
    );
  }
  currentTaskTypeColor(): string {
    return (
      this.taskTypes?.find((el) => el.id == this.issue.typeId)?.color ?? 'red'
    );
  }
  updateTaskState(stateId: number): void {
    this.issue.state.id = stateId;

    this.taskServise
      .updateTask(this.issue)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.notificationService.success('Task status updated');
        }
      });
  }
}
