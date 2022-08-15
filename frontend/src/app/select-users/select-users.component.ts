import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BoardService } from 'src/services/board.service';
import { BoardType, BusinessRole, EnumToArrayElement, IBoard, IUserCard } from './Models';

@Component({
  selector: 'tasque-select-users',
  templateUrl: './select-users.component.html',
  styleUrls: ['./select-users.component.sass']
})
export class SelectUsersComponent implements OnInit {
  users$!: Observable<IUserCard[]>
  users: IUserCard[];
  roles: EnumToArrayElement[];
  isLoading = false;

  userEmail = '';
  rowspan = 0;

  @Input()
  public board: IBoard

  constructor(private service: BoardService, private toastr: ToastrService) { }

  ngOnInit(): void {

    // board should be passed as a parameter
    // ================================
    // var boardName = prompt('Please, enter a board name (supported values - "WithRoles", "WithoutRoles")') as string;
    var boardName = "WithRoles";
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
    let board = getBoard();
    let key = this.service.createKey(board);

    if (localStorage.getItem(key)) {
      this.board = JSON.parse(localStorage.getItem(key) as string);
    }
    else {
      this.board = board;
    }

    // ================================

    if (!this.board) {
      throw new TypeError("Board is required");
    }

    this.roles = Object.keys(BusinessRole)
    .filter((v) => isNaN(Number(v)))
      .map((name) => {
      return {
        id: BusinessRole[name as keyof typeof BusinessRole],
        name,
      };
      });
    
    console.log(this.roles);

    this.refreshList();
  }

  add() {
    console.log(this.userEmail);
    this.isLoading = true;
    this.service.addUser(this.userEmail, this.board)
      .subscribe(
        res => {
          this.refreshList();
          this.toastr.success(`${this.users.filter(u => u.email == this.userEmail)[0].username} was added successfully !`);
        },
        err => {
          this.isLoading = false
          this.toastr.error(`User with email ${this.userEmail} was not found !`);
        });
    
    this.userEmail = '';
  }

  delete(email: string) {
    this.isLoading = true;
    this.service.deleteUser(this.board, email).subscribe(res => {
      this.refreshList();
    })
  }

  update(user: IUserCard) {
    this.isLoading = true;
    this.service.updateUser(this.board, user).subscribe(res => {
      this.refreshList();
    })
  }

  private refreshList(): void {
    this.users$ = this.service.getUsers(this.board);
    this.service.getUsers(this.board).subscribe(data => {
      console.log(data);
      this.users = data;
      this.rowspan = Math.min(this.users.length, 5);
      this.isLoading = false
    });
  }
}
