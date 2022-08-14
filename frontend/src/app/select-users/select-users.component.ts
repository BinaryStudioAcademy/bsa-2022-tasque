import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BoardService } from 'src/services/board.service';
import { BoardType, IBoard, IUserCard } from './Models';

@Component({
  selector: 'tasque-select-users[board]',
  templateUrl: './select-users.component.html',
  styleUrls: ['./select-users.component.sass']
})
export class SelectUsersComponent implements OnInit {
  users$!: Observable<IUserCard[]>
  users: IUserCard[];
  isLoading = false;

  userEmail: string = ''

  @Input()
  public board: IBoard

  constructor(private service: BoardService, private toastr: ToastrService) { }

  ngOnInit(): void {

    // board to be passed a a parameter
    var boardName = prompt('Please, enter a board name (supported values - "WithRoles", "WithoutRoles")') as string;
    let getBoard = (): IBoard => {
      switch (boardName) {
        case "WithRoles":
          return {
            id: 1,
            type: BoardType.Organization,
            hasRoles: true,
            users: []
          };
        case "WithoutRoles":
          return {
            id: 1,
            type: BoardType.Board,
            hasRoles: false,
            users: []
          }
        default:
          throw TypeError("Unknown name");
      }
    }
    this.board = getBoard();

    if (!this.board) {
      throw new TypeError("Board is required");
    }
    this.refreshList();
  }

  add() {
    this.isLoading = true;
    this.service.addUser(this.userEmail, this.board)
      .subscribe(
        res => {
          this.refreshList();
          this.toastr.success(`${this.users.filter(u => u.email == this.userEmail)[0].username} was added successfully !`)
        },
        err => {
          this.toastr.error(`User with email ${this.userEmail} was not found !`);
        },
        () => this.isLoading = false);
    
    this.userEmail = '';
  }

  delete(email: string) {
    this.isLoading = true;
    this.service.deleteUser(this.board, email).subscribe(res => {
      this.refreshList();
      this.isLoading = false;
    })
  }

  private refreshList(): void {
    this.users$ = this.service.getUsers(this.board);
    this.service.getUsers(this.board).subscribe(data => this.users = data);
  }
}
