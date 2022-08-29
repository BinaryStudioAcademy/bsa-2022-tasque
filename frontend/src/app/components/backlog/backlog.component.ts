import { Component, OnInit } from '@angular/core';
import {
  faMaximize,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BoardService } from 'src/services/board.service';
import { TasqueDropdownOption } from 'src/shared/components/tasque-dropdown/dropdown.component';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.sass'],
})
export class BacklogComponent implements OnInit {
  faMaximize = faMaximize;
  faMagnifyingGlass = faMagnifyingGlass;
  public unsubscribe$ = new Subject<void>();
  public options: TasqueDropdownOption[] = [
    {
      color: 'red',
      title: 'Development',
      id: 0,
    },
    {
      color: '#F6F7F9',
      title: 'Feature',
      id: 1,
    },
  ];

  constructor(public boardService: BoardService) {}

  ngOnInit(): void {
    this.getUserBoards();
  }

  public getUserBoards(): void {
    this.boardService
      .getUserBoards(1)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.options = result.body.map((item) => ({
            id: item.id,
            title: item.name,
            color: 'white',
          }));
        }
      });
  }
}
