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

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.sass'],
})
export class SprintComponent implements OnInit, OnChanges {
  @Input() public sprint: SprintModel;
  public tasks: TaskModel[];
  public tasksShow: TaskModel[];
  public unsubscribe$ = new Subject<void>();
  public createIssueSidebarName = 'createIssue';
  @Input() public inputSearch = '';
  @Output() dropSprint = new EventEmitter<number>();

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
          this.tasks = this.tasksShow = result.body;
        }
      });
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
  }

  ngOnChanges() {
    this.filterItems();
  }

  dropSprintClick(value: number) {
    this.dropSprint.emit(this.sprint.id);
  }
}
