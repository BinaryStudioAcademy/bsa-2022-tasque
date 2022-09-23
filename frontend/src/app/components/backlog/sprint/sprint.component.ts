import {
  Component,
  Input,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  faEllipsisV,
  faAngleDown,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SprintModel } from 'src/core/models/sprint/sprint-model';
import { SprintService } from 'src/core/services/sprint.service';
import { IssueSort } from '../models';
import { UserModel } from 'src/core/models/user/user-model';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TaskService } from 'src/core/services/task.service';
import { TaskState } from 'src/core/models/task/task-state';
import { TaskType } from 'src/core/models/task/task-type';
import { TaskTypeService } from 'src/core/services/task-type.service';
import { TaskStateService } from 'src/core/services/task-state.service';
import { ProjectModel } from 'src/core/models/project/project-model';
import { UserRole } from 'src/core/models/user/user-roles';
import { ToastrNotificationService } from 'src/core/services/toastr-notification.service';
import { OpenDialogService } from 'src/core/services/open-dialog.service';
import { TaskModel } from 'src/core/models/task/task-model';
import * as moment from 'moment';
import { EditSprintModel } from 'src/core/models/sprint/edit-sprint-model';
import { GetCurrentOrganizationService } from 'src/core/services/get-current-organization.service';
import { OrganizationService } from 'src/core/services/organization.service';
import { OrganizationModel } from 'src/core/models/organization/organization-model';
import { BusinessRole } from 'src/shared/components/select-users/Models';
import { UserProjectRole } from 'src/core/models/user/user-project-roles';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.sass'],
})
export class SprintComponent implements OnInit, OnChanges {
  //Get the sprint to display it in the component
  @Input() public sprints: SprintModel[];
  //Get the sprint to display it in the component
  @Input() public currentSprint: SprintModel;
  //Get the string by which issue will be searched
  @Input() public inputSearch = '';
  //Get the criteria by which the issue will be sorted
  @Input() public filterIssue: IssueSort;
  //get current user
  @Input() public currentUser: UserModel;
  @Input() public currentProject: ProjectModel;

  @Input() public sprintIndex: number;

  public taskState: TaskState[];
  public taskType: TaskType[];

  //Notify parent components of sprint priority change
  @Output() sprintUp = new EventEmitter<SprintModel>();
  //Notify parent components of sprint priority change
  @Output() sprintDown = new EventEmitter<SprintModel>();

  public sprintUsers: UserModel[];
  public sprintUsersCircle?: UserModel[];
  public filterTaskByUser?: UserModel;

  public tasks: TaskModel[];
  public tasksShow: TaskModel[];
  public tasksDto: TaskModel;
  public role: UserRole;
  public isCurrentUserAdmin = false;
  public isCurrentUserProjectAdmin = false;

  public isShow = false;
  public isDraggable = true;

  public unsubscribe$ = new Subject<void>();

  public createIssueSidebarName = 'createIssue';
  public estimate = 0;
  faEllipsisV = faEllipsisV;
  faAngleDown = faAngleDown;
  faChevronRight = faChevronRight;

  dropdownState: 'opened' | 'closed' = 'closed';

  constructor(
    public sprintService: SprintService,
    public taskService: TaskService,
    public notificationService: ToastrNotificationService,
    public taskTypeService: TaskTypeService,
    public taskStateService: TaskStateService,
    public openDialogService: OpenDialogService,
    private currentOrganizationService: GetCurrentOrganizationService,
    private organizationService: OrganizationService,
  ) { }

  ngOnInit(): void {
    if (this.currentUser === undefined) {
      this.role = 0;
    } else {
      this.permissionToEdit();
    }

    this.getTasksState();
    this.getTasksType();
    this.getSprintTasks();
    this.getSprintUsers();

    this.createIssueSidebarName += this.currentSprint.id;
  }

  //Get all tasks for the sprint
  public getSprintTasks(): void {
    this.taskService
      .getAllSprintTasks(this.currentSprint.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.currentSprint.tasks = this.tasks = this.tasksShow = result.body;
          this.estimateCount();
        }
        this.isShow = true;
      });
  }

  //Get all sprint members
  public getSprintUsers(): void {
    this.sprintService
      .getSprintUsers(this.currentSprint.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.sprintUsers = this.sprintUsersCircle = result.body;
        }
      });
  }

  //Display total estimate in sprint header
  estimateCount(): void {
    this.estimate = 0;
    this.estimate = this.tasks.reduce((a, b) => a + Number(b.estimate || 0), 0);
  }

  //Sort tasks in a sprint (by keyword or IssueSort)
  filterItems(): void {
    if (this.tasksShow) {
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
        this.tasks.sort((a) => a.id);
      } else if (this.filterIssue == IssueSort.OnlyMyIssues) {
        this.tasks = this.tasks.filter((item) => {
          return item.authorId == this.currentUser.id;
        });
      } else if (this.filterIssue == IssueSort.RecentlyUpdated) {
        this.tasks.sort(
          (a, b) =>
            new Date(b.deadline).getTime() - new Date(a.deadline).getTime(),
        );
      }
    }
  }

  //Move the task from the backlog to the sprint, update the task in the database
  drop(event: CdkDragDrop<TaskModel[]>): void {
    const _task = event.previousContainer.data[event.previousIndex];

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

      if (this.currentSprint.id) {
        _task.sprintId = this.currentSprint.id;
      } else {
        _task.sprintId = undefined;
      }

      this.taskService
        .updateTask(_task)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((result) => {
          if (result.body) {
            this.notificationService.success(
              `Task ${_task.key} moved to sprint ${this.currentSprint.name}`,
            );
          }
        });
    }
  }

  //Show only the tasks of the selected user
  filterUserTasks(user: UserModel): void {
    if (this.filterTaskByUser == user) {
      this.tasks = this.tasksShow;
      this.filterTaskByUser = undefined;
    } else {
      this.filterTaskByUser = user;

      this.tasks = this.tasksShow.filter((item) => {
        return item.users?.find((u) => u.id === user.id);
      });
    }
  }

  ngOnChanges(): void {
    this.filterItems();
  }

  $sprintUp(sprint: SprintModel): void {
    this.sprintUp.emit(sprint);
  }

  $sprintDown(sprint: SprintModel): void {
    this.sprintDown.emit(sprint);
  }

  public getTasksState(): void {
    this.taskState = this.currentProject.projectTaskStates;
  }

  public getTasksType(): void {
    this.taskTypeService
      .getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.taskType = result.body;
        }
      });
  }

  public deleteSprint(sprint: SprintModel): void {
    this.openDialogService.openDeleteSprintDialog(sprint);
  }

  public toogleIsDragable(val: boolean): void {
    this.isDraggable = !val;
  }

  public switchDropdown(): void {
    if (this.dropdownState === 'opened') {
      this.dropdownState = 'closed';
    } else {
      this.dropdownState = 'opened';
    }
  }

  public editSprint(): void {
    this.openDialogService
      .openEditSprintDialog(this.getEditSprintModel(false))
      .subscribe((result) => {
        if (result) {
          this.currentSprint.name = result.name;
          this.currentSprint.description = result.description;
        }
      });
  }

  public startSprint(): void {
    this.openDialogService
      .openEditSprintDialog(this.getEditSprintModel(true))
      .subscribe((result) => {
        if (result) {
          this.currentSprint.name = result.name;
          this.currentSprint.description = result.description;
          this.currentSprint.startAt = result.startAt;
          this.currentSprint.endAt = result.endAt;
        }
      });
  }

  private getEditSprintModel(isStarting: boolean): EditSprintModel {
    return {
      ...this.currentSprint,
      startAt: this.currentSprint.startAt
        ? moment(this.currentSprint.startAt).format('YYYY-MM-DDTHH:mm')
        : undefined,
      endAt: this.currentSprint.endAt
        ? moment(this.currentSprint.endAt).format('YYYY-MM-DDTHH:mm')
        : undefined,
      isStarting: isStarting,
      tasks: this.tasks.map((task) => task.id),
    };
  }

  public permissionToEdit(): void {
    const organizationId =
      this.currentOrganizationService.currentOrganizationId;
    this.organizationService
      .getOrganization(organizationId)
      .subscribe((resp) => {
        const currentOrganization = resp.body as OrganizationModel;
        const role = this.currentUser.organizationRoles.find(
          (r) =>
            r.organizationId === organizationId &&
            r.userId === this.currentUser.id,
        )?.role as UserRole;
        if (
          role >= UserRole.projectAdmin ||
          currentOrganization.authorId === this.currentUser.id
        ) {
          this.isCurrentUserAdmin = true;
        } else {
          this.isCurrentUserAdmin = false;
        }

        const projectRole = this.currentUser.roles?.find(
          (r) =>
            r.projectId === this.currentProject.id &&
            r.userId === this.currentUser.id,
        ) as UserProjectRole;

        if (
          projectRole.roleId == BusinessRole.Admin ||
          this.isCurrentUserAdmin
        ) {
          this.isCurrentUserProjectAdmin = true;
        } else {
          this.isCurrentUserProjectAdmin = false;
        }
      });
  }

  public deleteIssue(id: number): void {
    const index = this.tasks.findIndex((x) => x.id == id);
    this.tasks.splice(index, 1);
  }
}
