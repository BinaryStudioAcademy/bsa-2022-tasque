import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/user/services/user.service';
import { TaskEstimateUpdate } from 'src/core/models/task/task-estimate-update';
import { TaskModel } from 'src/core/models/task/task-model';
import { UserModel } from 'src/core/models/user/user-model';
import { SprintService } from 'src/core/services/sprint.service';

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
  //notifying the parent components about the change in the value of estimate
  @Output() estimate = new EventEmitter<void>();
  public issueAuthor: UserModel;
  public taskEstimate: TaskEstimateUpdate;
  public unsubscribe$ = new Subject<void>();

  constructor(
    public userServise: UserService,
    public sprintService: SprintService,
  ) {
    //this.issueAuthor.avatar
  }

  ngOnInit(): void {
    this.getIssueAuthor();
  }

  public getIssueAuthor(): void {
    this.userServise
      .getUserById(this.issue.author.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.issueAuthor = result.body;

          if (this.issueAuthor.avatarURL == undefined) {
            this.issueAuthor.avatarURL = '\\assets\\avatar.png';
          }
        }
      });
  }

  public deadline(): Date {
    return new Date(this.issue.deadline);
  }

  estimateChange(): void {
    this.estimate.emit();

    this.taskEstimate = {
      taskId: this.issue.id,
      sprintId: this.issue.sprint.id,
      estimate: this.issue.estimate ?? 0,
    };

    this.sprintService
      .updateTaskEstimate(this.taskEstimate)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }
}
