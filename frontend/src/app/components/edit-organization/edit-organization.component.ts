import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrganizationModel } from 'src/core/models/organization/organization-model';
import { NotificationService } from 'src/core/services/notification.service';
import { OrganizationService } from 'src/core/services/organization.service';
import { SideBarService } from 'src/core/services/sidebar.service';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import {
  BoardType,
  IBoard,
  IUserCard,
} from 'src/shared/components/select-users/Models';
import { ProfileChangesDTO } from 'src/app/user/dto/profile-changes-dto';

@Component({
  selector: 'app-edit-organization',
  templateUrl: './edit-organization.component.html',
  styleUrls: ['./edit-organization.component.sass'],
})
export class EditOrganizationComponent implements OnInit, OnDestroy {
  faPenToSquare = faPenToSquare;
  @Input() public organization: OrganizationModel;
  public editOrganization: FormGroup = new FormGroup({});
  public organizationNameControl: FormControl;
  public organizationUsersControl: FormControl;
  public btnText = 'Create project';
  public btnClass = 'mini';
  public sidebarName = 'editOrganization';
  public unsubscribe$ = new Subject<void>();
  public organizationName = '';

  public users: ProfileChangesDTO[] = [];

  get organizationNameErrorMessage(): string {
    const ctrl = this.organizationNameControl;

    if (ctrl.errors?.['minlength']) {
      return 'Summary must be at least 2 characters';
    }
    if (ctrl.errors?.['required']) {
      return 'Project is required';
    }
    return '';
  }

  constructor(
    private notification: NotificationService,
    private sideBarService: SideBarService,
    private organizationService: OrganizationService,
  ) {
    this.organizationNameControl = new FormControl(this.organizationName, [
      Validators.required,
      Validators.minLength(2),
    ]);
  }

  public user: IUserCard[] = [
    {
      email: 'test@email.com',
      username: 'username 1',
      profileURL: 'null',
      avatarURL: 'https://www.w3schools.com/howto/img_avatar.png',
      role: null,
    },
  ];

  public board: IBoard = {
    id: 1,
    type: BoardType.Organization,
    users: this.user,
    hasRoles: true,
  };

  ngOnInit(): void {
    this.getUsers();
    this.organizationName = this.organization.name;
    this.sidebarName += this.organization.id;

    this.editOrganization = new FormGroup({
      organizationNameControl: this.organizationNameControl,
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public submitForm(): void {
    this.addUser();

    this.organization.name = this.organizationName;

    this.organizationService
      .editOrganization(this.organization)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
        }
      });
  }

  public clearForm(): void {
    this.editOrganization.reset();
    this.sideBarService.toggle(this.sidebarName);
  }

  public titleContent(event: Event): string {
    const input = event.target as HTMLElement;
    return input.innerText;
  }

  public getUsers(): void {
    this.organizationService
      .getOrganizationUsers(this.organization.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.users = result.body;
          console.log(this.users);
        }
      });
  }

  public addUser(): void {
    this.organizationService
      .addUser(this.organization.id, this.users[1])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          console.log(result.body);
        }
      });
  }

  public delUser(): void {}
}
