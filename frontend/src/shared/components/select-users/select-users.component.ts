import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BoardService } from 'src/core/services/board.service';
import {
  BoardType,
  BusinessRole,
  getRolesAsArray,
  IBoard,
  IUserCard,
} from './Models';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationConstants } from 'src/core/models/const-resources/validation-constraints';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { TasqueDropdownOption } from '../tasque-dropdown/dropdown.component';
import { UserModel } from 'src/core/models/user/user-model';
import { UserRole } from 'src/core/models/user/user-roles';

@Component({
  selector: 'tasque-select-users',
  templateUrl: './select-users.component.html',
  styleUrls: ['./select-users.component.sass'],
})
export class SelectUsersComponent implements OnInit {
  users$!: Observable<IUserCard[]>;
  roles: TasqueDropdownOption[];
  isLoading = true;
  public userEmail = '';
  public validationConstants = ValidationConstants;
  public emailControl: FormControl;
  public searchForm: FormGroup = new FormGroup({});

  addIcon = faSquarePlus;
  public rowspan = 1;
  usersCount = 0;
  public defaultRowHeight_px = 80;

  @Input()
  public board: IBoard = {
    id: 1,
    type: BoardType.Board,
    hasRoles: true,
    users: [
      {
        email: 'admin@gmail.com',
        username: 'Admin',
        profileURL: '',
        avatarURL: '',
        role: BusinessRole.Administrator
      } as IUserCard
    ]
  };

  @Output() onAdd = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onUpdate = new EventEmitter<IUserCard>();

  constructor(private service: BoardService, private toastr: ToastrService) {
    this.roles = getRolesAsArray();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.emailControl = new FormControl(this.userEmail, [
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
    this.onAdd.emit(username);

    this.emailControl = new FormControl(this.userEmail, [
      Validators.email,
      Validators.required,
      Validators.pattern(this.validationConstants.emailRegex),
    ]);
    this.searchForm = new FormGroup({ emailControl: this.emailControl });
    this.userEmail = '';

    this.refreshList();
  }

  delete(email: string): void {
    this.isLoading = true;

    this.onDelete.emit(email);

    this.refreshList();
  }

  update(user: IUserCard, role: BusinessRole): void {
    this.isLoading = true;
    user.role = role;

    this.onUpdate.emit(user);

    this.refreshList();
  }

  roleToString(role: BusinessRole | null): string {
    return role ? BusinessRole[role] : '';
  }

  getUserModel(user: IUserCard): UserModel {
    return {
      id: user.id,
      email: user.email,
      name: user.username,
      avatarURL: user.avatarURL,
      organizationRoles: [ { organizationId: 1, userId: 2, role: UserRole.organizationMember }, { organizationId: 2, userId: 2, role: UserRole.organizationMember } ]
    };
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
