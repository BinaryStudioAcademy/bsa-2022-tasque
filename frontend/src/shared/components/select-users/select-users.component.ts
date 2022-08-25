import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BoardService } from 'src/services/board.service';
import {
  getRolesAsArray,
  IBoard,
  IUserCard,
} from './Models';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationConstants } from 'src/entity-models/const-resources/validation-constraints';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'tasque-select-users',
  templateUrl: './select-users.component.html',
  styleUrls: ['./select-users.component.sass'],
})
export class SelectUsersComponent implements OnInit {
  users$!: Observable<IUserCard[]>;
  roles: [color: string, title: string, id: number][];
  isLoading = true;
  public userEmail = '';
  public validationConstants = ValidationConstants;
  public emailControl: FormControl;
  public searchForm: FormGroup = new FormGroup({});

  addIcon = faSquarePlus;
  public rowspan = 1;
  usersCount = 0;
  public defaultRowHeight_px = 84;

  @Input()
  public board: IBoard;

  constructor(private service: BoardService, private toastr: ToastrService) {
    this.roles = getRolesAsArray();
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
      }
    );
  }

  delete(email: string): void {
    this.isLoading = true;
    this.service.deleteUser(this.board, email).subscribe(() => {
      this.toastr.success(`${email} was deleted successfully !`);
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
      this.rowspan = Math.max(1, Math.min(this.usersCount, 5));
      this.isLoading = false;
    });
  }
}
