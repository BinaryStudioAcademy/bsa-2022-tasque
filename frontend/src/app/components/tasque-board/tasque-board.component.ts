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
import { BoardModel } from 'src/core/models/board/board-model';
import { ActivatedRoute } from '@angular/router';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';
import { Subject } from 'rxjs';
import { InputComponent } from 'src/shared/components/tasque-input/input.component';
import { TasqueDropdownOption } from 'src/shared/components/tasque-dropdown/dropdown.component';
import { ProjectService } from 'src/core/services/project.service';
import { filter } from 'rxjs/operators';
import { TaskType } from 'src/core/models/task/task-type';
import { TaskPriorityType } from 'src/core/models/task/enums/task-priority-types';

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

  private newColumn: BoardColumnModel;
  private projectId: number;

  public unsubscribe$ = new Subject<void>();

  public board: BoardModel = { projectId: 0, id: 0, name: '', projectName: '', users: [], columns: [] };
  user: UserModel;
  public hasTasks = false;
  public searchParameter = '';

  public tasks: TaskInfoModel[] = [  //TODO: Remove
  {
    id: 1,
    type: {
      id: 1,
      name: 'type1',
      color: 'black',
    },
    priority: {
      id: 1,
      name: 'priority1',
      type: TaskPriorityType.Heghest,
      color: 'red',
      projectId: 1,

    },
    summary: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    key: 'TP-1',
    attachmentUrl: 'https://media.istockphoto.com/photos/-picture-id1143678440?k=20&m=1143678440&s=612x612&w=0&h=sUtNPqEaCNVSHyCDwxjj8Yy2qY6siPPQ5AWTfu2_GeA=',
    isHidden: false,
    customLabels: [{
      name: 'CusLab1',
      color: 'orange',
    }, {
      name: 'CusLab1-2',
      color: 'blue',
    }],
    user: {
      id: 1,
      name: 'Daniil Poyarkov',
      email: '',
      organizationRoles: [],
    },
    assignees: [{
      id: 1,
      name: 'Loren Ipsum',
      email: '',
      organizationRoles: [],
    }, {
      id: 1,
      name: 'Loren Ipsum',
      email: '',
      organizationRoles: [],
    }]
  },
  {
    id: 2,
    type: {
      id: 1,
      name: 'type2',
      color: 'black',
    },
    priority: {
      id: 1,
      name: 'priority2',
      type: TaskPriorityType.Heghest,
      color: 'red',
      projectId: 1,

    },
    summary: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    key: 'TP-2',
    attachmentUrl: 'http://englishbookgeorgia.com/blogebg/wp-content/uploads/2018/02/outsourcing-product-development.jpg',
    isHidden: false,
    customLabels: [{
      name: 'CusLab2',
      color: 'orange',
    }, {
      name: 'CusLab2-2',
      color: 'blue',
    }],
    user: {
      id: 1,
      name: 'Daniil Poyarkov',
      email: '',
      organizationRoles: [],
    },
    assignees: [{
      id: 1,
      name: 'Loren Ipsum',
      email: '',
      organizationRoles: [],
    }, {
      id: 1,
      name: 'Loren Ipsum',
      email: '',
      organizationRoles: [],
    }]
  },
  ];

  public columns: BoardColumnModel[] = [
    {
      id: 1,
      name: 'To Do',
      tasks: this.tasks,
    }
  ];

  public projectOptions: TasqueDropdownOption[] = [];
  public projectTaskTypes: TaskType[] = [];

  constructor(
    formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private boardService: ProjectService,
    private notificationService: NotificationService,
    private currentUserService: GetCurrentUserService,
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
    const id = this.route.snapshot.paramMap.get('id');
    if (id == null) {
      this.notificationService.error('Path id is null');
      return;
    }
    this.projectId = parseInt(id);

    this.boardService.getBoard(this.projectId).subscribe(
      (resp) => {
        if (resp.ok && resp.body != null) {
          this.board = resp.body;
          this.hasTasks = this.checkIfHasTasks();
          this.fillOptions();
        } else {
          this.notificationService.error('Something went wrong');
        }
      },
    );
  }

  openAddColumn(): void {
    this.isOpenColumnAddDialog = true;
  }

  addColumn(): void {
    if (this.createColumnForm.valid) {
      this.newColumn = {
        id: 0,
        name: this.createColumnForm.get('columnName')?.value,
        tasks: [],
      };
      this.board.columns.push(this.newColumn);
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
      this.updateTasks();
    }
  }

  updateColumns(): void {
    this.boardService
      .updateBoardColumns(this.board)
      .pipe(filter((resp) => resp.body != null))
      .subscribe((resp) => {
        this.board = resp.body as BoardModel;
        this.filterTasks();
      });
  }

  updateTasks(): void {
    this.boardService
      .updateBoardTasks(this.board)
      .pipe(filter((resp) => resp.body != null))
      .subscribe((resp) => {
        this.board = resp.body as BoardModel;
        this.filterTasks();
      });
  }

  checkIfHasTasks(): boolean {
    for (const column of this.board.columns) {
      if (column.tasks.length > 0) {
        return true;
      }
    }
    return false;
  }

  filterTasks(): void {
    const phrase = this.searchInput.inputValue;
    for(const column of this.board.columns) {
      for(const task of column.tasks) {
        task.isHidden = !task.summary.toLowerCase().includes(phrase.toLowerCase());
        if(this.selectedUserId) {
          task.isHidden = task.isHidden || task.user?.id != this.selectedUserId;
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

  fillOptions(): void {
    this.projectOptions.push({
      title: this.board.name,
      id: this.projectId,
    } as TasqueDropdownOption);
  }
}
