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
import { ToastrNotificationService } from 'src/core/services/toastr-notification.service';
import { ProjectModel } from 'src/core/models/project/project-model';
import { TaskStorageService } from 'src/core/services/task-storage.service';
import { SprintModel } from 'src/core/models/sprint/sprint-model';

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

  //get current sprint
  @Input() public currentSprint: SprintModel;

  //notifying the parent components about the change in the value of estimate
  @Output() estimate = new EventEmitter<void>();
  @Output() isChanging = new EventEmitter<boolean>();

  flagIcon = faFlag;

  @Input() public taskTypes: TaskType[] = [];

  @Input() public taskStates: TaskState[] = [];

  public taskEstimate: TaskEstimateUpdate;
  public unsubscribe$ = new Subject<void>();

  constructor(
    public userServise: UserService,
    public taskServise: TaskService,
    public sprintService: SprintService,
    public notificationService: ToastrNotificationService,
    private cdRef: ChangeDetectorRef,
    private taskStorageService: TaskStorageService,
  ) {}

  ngOnInit(): void {
    this.estimateUpdate();
    this.cdRef.detectChanges();

    this.taskStorageService.taskUpdated$.subscribe((task) => {
      if (task.id === this.issue.id) {
        this.issue = task;
      }
    });
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

  updateTaskState(stateId: number): void {
    this.issue.stateId = stateId;
    if (this.issue.state) {
      this.issue.stateId = stateId;
    }

    this.taskServise
      .updateTask(this.issue)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.notificationService.success('Task status updated');
        }
      });
  }

  test(val: boolean): void {
    this.isChanging.emit(val);
  }
}
