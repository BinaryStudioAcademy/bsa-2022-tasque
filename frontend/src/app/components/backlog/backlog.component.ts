import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';
import { UserModel } from 'src/core/models/user/user-model';
import { TasqueDropdownOption } from 'src/shared/components/tasque-dropdown/dropdown.component';
import {
  faMaximize,
  faMagnifyingGlass,
  faUnlockKeyhole,
  faLock,
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
import { ProjectModel } from 'src/core/models/project/project-model';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/core/services/project.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { NotificationService } from 'src/core/services/notification.service';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.sass'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(600, style({ opacity: 1 })),
      ]),
      transition(':leave', [
        // :leave is alias to '* => void'
        animate(0, style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class BacklogComponent implements OnInit, AfterContentChecked {
  faMaximize = faMaximize;
  faMagnifyingGlass = faMagnifyingGlass;
  faUnlockKeyhole = faUnlockKeyhole;
  faLock = faLock;
  //get current user
  @Input() public currentUser: UserModel;
  //Get the criteria by which the issue will be sorted
  @Input() public filterIssue: IssueSort;

  public currentProject: ProjectModel;
  public currentProjectId: number;

  public inputSearch = '';

  public unsubscribe$ = new Subject<void>();
  public boards: TasqueDropdownOption[];
  public sprints: SprintModel[];
  public archiveSprints: SprintModel[];
  public isShowArchive: boolean;
  public tasks: TaskModel[] = [];

  constructor(
    public projectService: ProjectService,
    public sprintService: SprintService,
    public currentUserService: GetCurrentUserService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private cdref: ChangeDetectorRef,
  ) {
    sprintService.deleteSprint$.subscribe((sprintId) => {
      this.deleteSprint(sprintId);
    });
  }
  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.url[0].path;

    if (id) {
      this.currentProjectId = parseInt(id);
      this.projectService
        .getProjectById(this.currentProjectId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((resp) => {
          this.currentProject = resp.body as ProjectModel;
        });
    }
    this.currentUserService.currentUser$.subscribe((user) => {
      this.currentUser = user as UserModel;

      if (this.currentUser === undefined) {
        return;
      }
      // this.getUserBoards();
      this.getSprints(this.currentProjectId);
    });
  }

  //get all user's boards
  /*
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
  */

  //get sprints for the current project
  //and sort them by priority (order)
  public getSprints(projectId: number): void {
    this.sprintService
      .getProjectSprints(projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.sprints = result.body.sort(
            (a, b) => (a.order ?? 0) - (b.order ?? 0),
          );
        }
      });
  }

  public getArchiveSprints(projectId: number): void {
    this.isShowArchive = !this.isShowArchive;

    this.sprintService
      .getArchiveProjectSprints(projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.archiveSprints = result.body;
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
    this.notificationService.success('Priority updated');
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

  deleteSprint(sprintId: number): void {
    this.sprints = this.sprints.filter((task) => task.id !== sprintId);
  }
}
