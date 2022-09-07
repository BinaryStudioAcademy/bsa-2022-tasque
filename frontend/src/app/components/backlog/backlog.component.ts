import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';
import { UserModel } from 'src/core/models/user/user-model';
import { BoardService } from 'src/core/services/board.service';
import { TasqueDropdownOption } from 'src/shared/components/tasque-dropdown/dropdown.component';
import {
  faMaximize,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { SprintService } from 'src/core/services/sprint.service';
import { SprintModel } from 'src/core/models/sprint/sprint-model';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { IssueSort } from './models';
import { TaskModel } from 'src/core/models/task/task-model';
import { TaskState } from 'src/core/models/task/task-state';
import { TaskService } from 'src/core/services/task.service';
import { TaskType } from 'src/core/models/task/task-type';
import { ToastrService } from 'ngx-toastr';
import { ProjectModel } from 'src/core/models/project/project-model';
import { TaskTypeService } from 'src/core/services/task-type.service';
import { TaskStateService } from 'src/core/services/task-state.service';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.sass'],
})
export class BacklogComponent implements OnInit {
  faMaximize = faMaximize;
  faMagnifyingGlass = faMagnifyingGlass;

  //get current user
  @Input() public currentUser: UserModel;

  // TODO remove when real data is available
  //get current project
  @Input() public currentProject: ProjectModel = {
    id: 1,
    name: 'Test project',
    authorId: 1,
    organizationId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    key: 'TIS-1',
  };

  public inputSearch = '';

  public unsubscribe$ = new Subject<void>();
  public boards: TasqueDropdownOption[];
  public sprints: SprintModel[];
  public filterIssue: IssueSort;

  public tasks: TaskModel[] = [];

  constructor(
    public boardService: BoardService,
    public sprintService: SprintService,
    public taskService: TaskService,
    public currentUserService: GetCurrentUserService,
    private toastrService: ToastrService,
  ) {}

  ngOnInit(): void {
    this.currentUserService.currentUser$.subscribe((user) => {
      this.currentUser = user as UserModel;
      this.getUserBoards();
      this.getSprints();
    });
  }

  //get all user's boards
  public getUserBoards(): void {
    this.boardService
      .getUserBoards(this.currentUser.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.boards = result.body.map((item) => ({
            id: item.id,
            title: item.name,
            color: '',
          }));
        }
      });
  }

  //get sprints for the current project
  //and sort them by priority (order)
  public getSprints(): void {
    this.sprintService
      .getProjectSprints(this.currentProject.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.sprints = result.body.sort(
            (a, b) => (a.order ?? 0) - (b.order ?? 0),
          );
        }
      });
  }

  dropSprint(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.sprints, event.previousIndex, event.currentIndex);
  }

  //Change sprint priority,
  //show user updated sprint order and update DB
  updateSprintPosition(sprint: SprintModel, isUp: boolean): void {
    const currentSprintPosition = sprint.order || 0;

    let sprintsSort: SprintModel[];

    if (isUp) {
      sprintsSort = this.sprints
        .filter((el) => (el.order || 0) < currentSprintPosition)
        .sort((a, b) => (b.order ?? 0) - (a.order ?? 0));
    } else {
      sprintsSort = this.sprints
        .filter((el) => (el.order || 0) > currentSprintPosition)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    const nextSprint = sprintsSort.length > 0 ? sprintsSort[0] : sprint;

    sprint.order = nextSprint.order ?? 0;
    nextSprint.order = currentSprintPosition;

    this.updateSprint(sprint.id, sprint);
    this.updateSprint(nextSprint.id, nextSprint);
    this.sprints.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    this.toastrService.success('Priority updated');
  }

  updateSprint(sprintId: number, sprint: SprintModel): void {
    this.sprintService
      .updareSprint(sprintId, sprint)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  //Sort tasks by criteria (All\Only my issues\Recently updated)
  taskSort(sort: IssueSort): void {
    this.filterIssue = sort;
  }

  //Drag a task from the backlog to a sprint
  drop(event: CdkDragDrop<TaskModel[]>): void {
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
}
