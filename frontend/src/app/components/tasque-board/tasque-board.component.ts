import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import { BoardColumnModel } from '../../../core/models/board/board-column-model';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TaskInfoModel } from 'src/core/models/board/task-Info-model';
import { UserModel } from 'src/core/models/user/user-model';
import { NotificationService } from 'src/core/services/notification.service';
import { ActivatedRoute } from '@angular/router';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';
import { Subject } from 'rxjs';
import { InputComponent } from 'src/shared/components/tasque-input/input.component';
import { TasqueDropdownOption } from 'src/shared/components/tasque-dropdown/dropdown.component';
import { TaskType } from 'src/core/models/task/task-type';
import { TaskModel } from 'src/core/models/task/task-model';
import { ProjectModel } from 'src/core/models/project/project-model';
import { ScopeBoardService } from 'src/core/services/scope/scope-board-service';
import { TaskState } from 'src/core/models/task/task-state';
import { TaskStorageService } from 'src/core/services/task-storage.service';

@Component({
  selector: 'tasque-board',
  templateUrl: './tasque-board.component.html',
  styleUrls: ['./tasque-board.component.sass'],
})
export class TasqueBoardComponent implements OnInit, OnDestroy {
  public searchIcon = faMagnifyingGlass;
  public plusIcon = faPlus;

  public isOpenColumnAddDialog: boolean;
  public createColumnForm: FormGroup;
  @ViewChild('searchInput') public searchInput: InputComponent;

  private selectedUserId?: number;
  private newColumn: TaskState;
  private projectId: number;

  public unsubscribe$ = new Subject<void>();

  public project: ProjectModel;
  user: UserModel;
  public hasTasks = false;
  public isShow = false;
  public searchParameter = '';
  colors = ['#D47500', '#00AA55', '#E3BC01', '#009FD4', '#B281B3', '#D47500', '#DC2929'];

  public columns: BoardColumnModel[] = [];
  public projectTasks: TaskModel[] = [];

  public projectOptions: TasqueDropdownOption[] = [];
  public projectTaskTypes: TaskType[] = [];

  constructor(
    formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private boardService: ScopeBoardService,
    private notificationService: NotificationService,
    private currentUserService: GetCurrentUserService,
    private taskStorageService: TaskStorageService
  ) {
    this.currentUserService.currentUser$.subscribe((res) => {
      this.user = res as UserModel;
    });

    this.createColumnForm = formBuilder.group({
      'columnName': ['', [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    const id = this.route.parent?.snapshot.paramMap.get('id');
    if (id == null) {
      this.notificationService.error('Path id is null');
      return;
    }
    this.projectId = parseInt(id);

    this.boardService.projectService.getProjectById(this.projectId)
      .subscribe(
        (resp) => {
          if (resp.ok) {
            this.project = resp.body as ProjectModel;
            this.setColumns();
          } else {
            this.notificationService.error('Something went wrong');
          }
        },
      );

    this.boardService.projectService.getAllProjectTasks(this.projectId)
      .subscribe((resp) => {
        if (resp.ok) {
          this.projectTasks = resp.body as TaskModel[];
          this.hasTasks = this.checkIfHasTasks();
          this.sortTasksByColumns();
        } else {
          this.notificationService.error('Something went wrong');
        }
      });

    this.taskStorageService.taskUpdated$.subscribe((task) => {
      let isTaskFound = false;

      for (const col of this.columns) {
        if (isTaskFound) {
          return;
        }

        const index = col.tasks.findIndex((t) => task.id === t.id);

        if (index !== -1) {
          isTaskFound = true;

          col.tasks[index] = {
            id: task.id,
            typeId: task.typeId,
            type: task.type,
            priority: task.priority,
            attachmentUrl: task.attachments[0]?.uri,
            summary: task.summary,
            customLabels: [],
            key: task.key as string,
            isHidden: false,
          };
        }
      }
    });

    this.taskStorageService.taskUpdated$.subscribe((task) => {
      let isTaskFound = false;

      for (const col of this.columns) {
        if (isTaskFound) {
          return;
        }

        const index = col.tasks.findIndex((t) => task.id === t.id);

        if (index !== -1) {
          isTaskFound = true;

          col.tasks[index] = {
            id: task.id,
            typeId: task.typeId,
            type: task.type,
            priority: task.priority,
            attachmentUrl: task.attachments[0]?.uri,
            summary: task.summary,
            customLabels: [],
            key: task.key as string,
            isHidden: false,
          };
        }
      }
    });
  }

  sortTasksByColumns(): void {
    this.columns.forEach((c) => {

      const tasks = this.projectTasks.filter((t) => t.stateId === c.id);
      const taskInfo: TaskInfoModel[] = [];

      tasks.forEach((t) => {
        taskInfo.push({
          id: t.id,
          typeId: t.typeId,
          type: t.type,
          stateId: t.stateId,
          priority: t.priority,
          attachmentUrl: t.attachments[0]?.uri,
          summary: t.summary,
          customLabels: [],
          assignees: t.users,
          key: t.key as string,
          isHidden: false,
        });
      });
      c.tasks = taskInfo;
    });
    this.isShow = true;
  }

  setColumns(): void {
    const states = this.project.projectTaskStates;
    states.forEach((s) => this.columns.push({
      id: s.id,
      name: s.name,
      tasks: [],
    }));
  }

  openAddColumn(): void {
    this.isOpenColumnAddDialog = true;
  }

  addColumn(): void {
    if (this.createColumnForm.valid) {
      this.newColumn = {
        id: 0,
        name: this.createColumnForm.get('columnName')?.value,
        projectId: this.projectId,
        color: this.colors[this.projectId % this.colors.length],
      };
      this.columns.push({
        id: this.newColumn.id,
        name: this.newColumn.name,
        tasks: [],
      });
      this.createColumnForm.reset();
      this.isOpenColumnAddDialog = false;
      this.updateColumns();
    }
  }

  onClickedOutside(): void {
    this.isOpenColumnAddDialog = false;
    this.createColumnForm.reset();
  }

  dragDrop(event: CdkDragDrop<TaskInfoModel[]>): void {
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
      this.updateTasks(event);
    }
  }

  updateColumns(): void {
    this.boardService.taskStateService
      .createTaskState(this.newColumn)
      .subscribe(() => {
        this.notificationService.success('Column has been created successfully');
        this.filterTasks();
      }, () => {
        this.notificationService.error('Something went wrong, try again later');
      });
  }

  updateTasks(event: CdkDragDrop<TaskInfoModel[]>): void {
    const model = event.container.data[event.currentIndex];
    this.columns.forEach((c) => {
      if (c.tasks === event.container.data) {
        const task = this.projectTasks.find((t) => t.id === model.id) as TaskModel;
        task.stateId = c.id;
        this.boardService.taskService
          .updateTask(task)
          .subscribe((resp) => {
            if (!resp.ok) {
              this.notificationService.error('Something went wrong, try again later');
            }
          });
      }
    });
  }

  checkIfHasTasks(): boolean {
    if (this.projectTasks.length > 0) {
      return true;
    }
    return false;
  }

  filterTasks(): void {
    const phrase = this.searchInput.inputValue;
    for (const column of this.columns) {
      if (column.tasks) {
        for (const task of column.tasks) {
          task.isHidden = !task.summary.toLowerCase().includes(phrase.toLowerCase());
          if (this.selectedUserId) {
            task.isHidden = task.isHidden || task.user?.id != this.selectedUserId;
          }
        }
      }
    }
  }

  userSelected(event: UserModel): void {
    if (this.selectedUserId && event.id === this.selectedUserId) {
      this.selectedUserId = undefined;
    } else {
      this.selectedUserId = event.id;
    }
    this.filterTasks();
  }
}
