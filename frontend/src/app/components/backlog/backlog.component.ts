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
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { IssueSort } from './models';

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
  public inputSearch = '';

  public unsubscribe$ = new Subject<void>();
  public boards: TasqueDropdownOption[];
  public sprints: SprintModel[];
  public filterIssue: IssueSort;

  constructor(
    public boardService: BoardService,
    public sprintService: SprintService,
    public currentUserService: GetCurrentUserService,
  ) {}

  ngOnInit(): void {
    this.currentUserService.currentUser.subscribe((user) => {
      this.currentUser = user as UserModel;
      this.getUserBoards();
      this.getSprints();
    });
  }

  public getUserBoards(): void {
    this.boardService
      .getUserBoards(this.currentUser.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.boards = result.body.map((item) => ({
            id: item.id,
            title: item.name,
            color: 'red',
          }));
        }
      });
  }

  public getSprints(): void {
    this.sprintService
      .getProjectSprints(1)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.sprints = result.body;
        }
      });
  }

  dropSprint(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.sprints, event.previousIndex, event.currentIndex);
  }

  dropSprintBtnClick(position: number): void {
    moveItemInArray(this.sprints, position, position + 1);
  }

  taskSort(sort: IssueSort): void {
    this.filterIssue = sort;
  }
}
