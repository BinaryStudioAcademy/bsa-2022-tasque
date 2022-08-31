import { Component, Input, OnInit } from '@angular/core';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SprintModel } from 'src/core/models/sprint/sprint-model';
import { TaskModel } from 'src/core/models/task/task-model';
import { SprintService } from 'src/core/services/sprint.service';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.sass'],
})
export class SprintComponent implements OnInit {
  @Input() public sprint: SprintModel;
  public tasks: TaskModel[];
  public unsubscribe$ = new Subject<void>();
  public createIssueSidebarName = 'createIssue';

  constructor(public sprintService: SprintService) {}

  faEllipsisV = faEllipsisV;
  ngOnInit(): void {
    this.getSprintTasks();
    this.createIssueSidebarName += this.sprint.id;
  }

  public getSprintTasks(): void {
    this.sprintService
      .getSprintTasks(this.sprint.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.tasks = result.body;
        }
      });
  }

  public openCreateIssuesModal() {}
}
