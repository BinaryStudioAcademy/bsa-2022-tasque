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

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.sass'],
})
export class BacklogComponent implements OnInit {
  faMaximize = faMaximize;
  faMagnifyingGlass = faMagnifyingGlass;

  @Input() public currentUser: UserModel;

  public unsubscribe$ = new Subject<void>();
  public boards: TasqueDropdownOption[];

  constructor(
    public boardService: BoardService,
    public currentUserService: GetCurrentUserService,
  ) { }

  ngOnInit(): void {
    this.currentUserService.currentUser.subscribe((user) => {
      this.currentUser = user as UserModel;
      this.getUserBoards();
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
}
