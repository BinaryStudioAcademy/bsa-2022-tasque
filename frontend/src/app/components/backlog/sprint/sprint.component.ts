import {
  Component,
  Input,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SprintModel } from 'src/core/models/sprint/sprint-model';
import { TaskModel } from 'src/core/models/task/task-model';
import { SprintService } from 'src/core/services/sprint.service';
import { IssueSort } from '../models';
import { UserModel } from 'src/core/models/user/user-model';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.sass'],
})
export class SprintComponent implements OnInit, OnChanges {
  //Get the sprint to display it in the component
  @Input() public sprint: SprintModel;
  //Get the string by which issue will be searched
  @Input() public inputSearch = '';
  //Get the criteria by which the issue will be sorted
  @Input() public filterIssue: IssueSort;
  //get current user
  @Input() public currentUser: UserModel;
  //Notify parent components of sprint priority change
  @Output() dropSprint = new EventEmitter<number>();

  public sprintUsers: UserModel[];
  public sprintUsersCircle?: UserModel[];

  public tasks: TaskModel[];
  public tasksShow: TaskModel[];

  public unsubscribe$ = new Subject<void>();

  public createIssueSidebarName = 'createIssue';
  public estimate = 0;
  faEllipsisV = faEllipsisV;

  constructor(public sprintService: SprintService) {}

  ngOnInit(): void {
    this.getSprintTasks();
    this.getSprintUsers();
    this.createIssueSidebarName += this.sprint.id;
  }

  public getSprintTasks(): void {
    this.sprintService
      .getSprintTasks(this.sprint.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.tasks = this.tasksShow = result.body;
          this.estimateCount();
        }
      });
  }

  public getSprintUsers(): void {
    this.sprintService
      .getSprintUsers(this.sprint.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.sprintUsers = result.body;

          this.sprintUsersCircle = result.body;
        }
      });
  }

  estimateCount(): void {
    this.estimate = 0;
    this.estimate = this.tasks.reduce((a, b) => a + Number(b.estimate || 0), 0);
  }

  filterItems(): void {
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
      this.tasks.sort((a) => a.priority?.id);
    } else if (this.filterIssue == IssueSort.OnlyMyIssues) {
      this.tasks = this.tasks.filter((item) => {
        return item.author.id == this.currentUser.id;
      });
    } else if (this.filterIssue == IssueSort.RecentlyUpdated) {
      this.tasks.sort(
        (a, b) =>
          new Date(b.deadline).getTime() - new Date(a.deadline).getTime(),
      );
    }
  }

  filterUserTasks(user: UserModel): void {
    this.tasks = this.tasksShow.filter((item) => {
      return item.author.id == user.id;
    });
  }
  //+++++++++++++++++++++++++rewrite after the backend part of sprintі sorting is implemented++++++++++++++++
  ngOnChanges(): void {
    this.filterItems();
  }

  dropSprintClick(value: number): void {
    this.dropSprint.emit(value);
  }
  //++++++++++++++++++++++++++++++++++
}