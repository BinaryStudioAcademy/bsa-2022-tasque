import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
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
import { ToastrNotificationService } from 'src/core/services/toastr-notification.service';
import { OrganizationModel } from 'src/core/models/organization/organization-model';
import { OrganizationService } from 'src/core/services/organization.service';
import { ProfileChangesDTO } from 'src/app/user/dto/profile-changes-dto';

@Component({
  selector: 'tasque-select-users',
  templateUrl: './select-users.component.html',
  styleUrls: ['./select-users.component.sass'],
})
export class SelectUsersComponent implements OnInit, OnChanges {
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

  @Input() organization?: OrganizationModel;
  @Input() isChanged: Observable<void>;
  @Input()
  public board: IBoard = {
    id: 1,
    type: BoardType.Board,
    hasRoles: true,
    users: [
      {
        id: 1,
        email: 'admin@gmail.com',
        userName: 'Admin',
        profileURL: '',
        avatarURL: '',
        role: BusinessRole.Admin
      } as IUserCard
    ]
  };

  @Output() onAdd = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onUpdate = new EventEmitter<IUserCard>();

  constructor(
    private service: BoardService,
    private organizationService: OrganizationService,
    private nontificationService: ToastrNotificationService) {
    this.roles = getRolesAsArray();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.emailControl = new FormControl(this.userEmail, [
      Validators.required,
      Validators.pattern(this.validationConstants.emailRegex),
    ]);
    this.searchForm = new FormGroup({ emailControl: this.emailControl });

    if(this.organization) {
      this.getOrganizationUsers();
    }

    this.refreshList();
  }

  ngOnChanges(): void {
    this.refreshList();
  }

  private getOrganizationUsers(): void {
    const organizationId = this.organization?.id as number;
    this.organizationService
    .getOrganizationUsers(organizationId).subscribe((resp) => {
      const users = resp.body as ProfileChangesDTO[];
      const arr: IUserCard[] = [];
      users.forEach((user) => arr.push(this.convertToUserCard(user)));
      this.users$ = of(arr);
      this.usersCount = arr.length;
      this.rowspan = Math.max(1, Math.min(this.usersCount, 5));
    });
  } 

  public add(): void {
    if (!this.searchForm.valid) {
      this.nontificationService.error('Invalid email');
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
  }

  update(user: IUserCard, role: BusinessRole): void {
    this.isLoading = true;
    user.role = role;

    this.onUpdate.emit(user);
  }

  roleToString(role: BusinessRole | null): string {
    if (role) {
      return role.toString();
    }

    return '';
  }

  getUserModel(user: IUserCard): UserModel {
    return {
      id: user.id,
      email: user.email,
      name: user.userName,
      avatarURL: user.avatarURL,
      organizationRoles: [
        { organizationId: 1, userId: 2, role: UserRole.organizationMember },
        { organizationId: 2, userId: 2, role: UserRole.organizationMember },
      ],
    };
  }

  private refreshList(): void {
    if(this.organization) {
      this.getOrganizationUsers();
    } else {
      this.users$ = this.service.getUsers(this.board);
      this.service.getUsers(this.board).subscribe((data) => {
        this.usersCount = data.length;
        this.rowspan = Math.max(1, Math.min(this.usersCount, 5));
      });
    }
    this.isLoading = false;
  }

  private convertToUserCard(user: ProfileChangesDTO): IUserCard {
    return {
      id: user.id,
      email: user.email,
      userName: user.name,
      profileURL: '',
      avatarURL: user.avatarURL,
      role: null,
    };
  }
}
