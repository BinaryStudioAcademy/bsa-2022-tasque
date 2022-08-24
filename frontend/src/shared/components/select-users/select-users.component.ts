import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BoardService } from 'src/services/board.service';
import {
  BoardType,
  BusinessRole,
  EnumToArrayElement,
  IBoard,
  IUserCard,
} from './Models';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationConstants } from 'src/entity-models/const-resources/validation-constraints';

@Component({
  selector: 'tasque-select-users',
  templateUrl: './select-users.component.html',
  styleUrls: ['./select-users.component.sass'],
})
export class SelectUsersComponent implements OnInit {
  users$!: Observable<IUserCard[]>;
  usersCount = 0;
  roles: EnumToArrayElement[];
  isLoading = true;
  public userEmail = '';
  public rowspan = 0;
  public validationConstants = ValidationConstants;
  public emailControl: FormControl;
  public searchForm: FormGroup = new FormGroup({});

  @Input()
  public board: IBoard;

  constructor(private service: BoardService, private toastr: ToastrService) {
    this.roles = Object.keys(BusinessRole)
      .filter((v) => isNaN(Number(v)))
      .map((name) => {
        return {
          id: BusinessRole[name as keyof typeof BusinessRole],
          name,
        };
      });

    // board should be passed as a parameter
    // ================================
    const boardName = prompt(
      'Please, enter a board name (supported values - "WithRoles", "WithoutRoles")',
    ) as string;
    const getBoard = (): IBoard => {
      switch (boardName) {
        case 'WithRoles':
          return {
            id: 1,
            type: BoardType.Organization,
            hasRoles: true,
            users: [],
          };
        case 'WithoutRoles':
          return {
            id: 1,
            type: BoardType.Board,
            hasRoles: false,
            users: [],
          };
        default:
          throw TypeError('Unknown name');
      }
    };
    const board = getBoard();
    const key = this.service.createKey(board);

    if (localStorage.getItem(key)) {
      this.board = JSON.parse(localStorage.getItem(key) as string);
    } else {
      this.board = board;
    }
    // ================================

    if (!this.board) {
      throw new TypeError('Board is required');
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.emailControl = new FormControl(this.userEmail, [
      Validators.email,
      Validators.required,
      Validators.pattern(this.validationConstants.emailRegex),
    ]);
    this.searchForm = new FormGroup({ emailControl: this.emailControl });
    this.refreshList();
  }

  public add(): void {
    if (!this.searchForm.valid) {
      this.toastr.error('Invalid email');
      return;
    }

    this.isLoading = true;
    const username = this.userEmail;
    this.service.addUser(username, this.board).subscribe(
      () => {
        this.refreshList();
        this.emailControl = new FormControl(this.userEmail, [
          Validators.email,
          Validators.required,
          Validators.pattern(this.validationConstants.emailRegex),
        ]);
        this.searchForm = new FormGroup({ emailControl: this.emailControl });
        this.userEmail = '';
        this.toastr.success(`${username} was added successfully !`);
      },
      () => {
        this.isLoading = false;
        this.toastr.error(`User with email ${username} was not found !`);
      },
    );
  }

  delete(email: string): void {
    this.isLoading = true;
    this.service.deleteUser(this.board, email).subscribe(() => {
      this.toastr.success(`${this.userEmail} was deleted successfully !`);
      this.refreshList();
    });
  }

  update(user: IUserCard): void {
    this.isLoading = true;
    this.service.updateUser(this.board, user).subscribe(() => {
      this.toastr.success(`${user.username} was updated successfully !`);
      this.refreshList();
    });
  }

  private refreshList(): void {
    this.users$ = this.service.getUsers(this.board);
    this.service.getUsers(this.board).subscribe((data) => {
      this.usersCount = data.length;
      this.rowspan = Math.min(this.usersCount, 5);
      this.isLoading = false;
    });
  }
}
