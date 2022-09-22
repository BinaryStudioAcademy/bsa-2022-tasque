import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrganizationModel } from 'src/core/models/organization/organization-model';
import { OrganizationService } from 'src/core/services/organization.service';
import { SideBarService } from 'src/core/services/sidebar.service';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { BoardType, IBoard } from 'src/shared/components/select-users/Models';
import { ProfileChangesDTO } from 'src/app/user/dto/profile-changes-dto';
import { GetCurrentOrganizationService } from 'src/core/services/get-current-organization.service';
import { UserRole } from 'src/core/models/user/user-roles';
import { ToastrNotificationService } from 'src/core/services/toastr-notification.service';

@Component({
  selector: 'app-edit-organization',
  templateUrl: './edit-organization.component.html',
  styleUrls: ['./edit-organization.component.sass'],
})
export class EditOrganizationComponent implements OnInit, OnDestroy {
  faPenToSquare = faPenToSquare;
  @Input() public organization: OrganizationModel;
  public editOrganizationForm: FormGroup = new FormGroup({});
  public organizationNameControl: FormControl;
  public organizationUsersControl: FormControl;
  public btnText = 'Create project';
  public btnClass = 'mini';
  public sidebarName = 'editOrganization';
  public unsubscribe$ = new Subject<void>();
  public organizationName = '';

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
    private notificationService: ToastrNotificationService,
    private sideBarService: SideBarService,
    private organizationService: OrganizationService,
    private getCurrentOrganizationService: GetCurrentOrganizationService,
  ) {
    this.organizationNameControl = new FormControl(this.organizationName, [
      Validators.required,
      Validators.minLength(2),
    ]);
  }

  ngOnInit(): void {
    this.organizationName = this.organization.name;
    this.sidebarName += this.organization.id;

    this.editOrganizationForm = new FormGroup({
      organizationNameControl: this.organizationNameControl,
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  addUserToOrganization(userEmail: string): void {
    this.organizationService
      .iviteUserToOrganization(this.organization.id, userEmail)
      .subscribe((resp) => {
        if(resp.ok) {
          this.notificationService.success(`User ${userEmail} has been invited to organization!`);
        }
      });
  }

  kickUserFromOrganization(email: string): void {
    this.organizationService.deleteUser(this.organization.id, email)
    .subscribe((resp) => {
      if(resp.ok) {
        const name = this.users.find((user) => user.email === email)?.name;
        this.notificationService.success(`User ${name?? email} has been deleted successfully`);
      }
    });
  }

  public submitForm(): void {
    this.organization.name = this.organizationName;

    this.organizationService
      .updateOrganization(this.organization)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.status == 200 && result.body !== null) {
          this.notificationService.success(
            'Organization data has been updated successfully',
          );
          this.getCurrentOrganizationService.updateOrganization(result.body);
          this.editOrganizationForm.reset();
          this.sideBarService.toggle(this.sidebarName);
        }
      });
  }

  public clearForm(): void {
    this.organizationName = this.organization.name;
    this.editOrganizationForm.reset();
    this.sideBarService.toggle(this.sidebarName);
  }

  public titleContent(event: Event): string {
    const input = event.target as HTMLElement;
    return input.innerText;
  }

  // Rework when the BoardService is implemented
  // ================================
  public board: IBoard = {
    id: 1,
    type: BoardType.Organization,
    users: [
      {
        id: 1,
        email: 'test@email.com',
        userName: 'username 1',
        profileURL: 'null',
        avatarURL: 'https://www.w3schools.com/howto/img_avatar.png',
        role: null,
      },
    ],
    hasRoles: true,
  };

  public users: ProfileChangesDTO[] = [
    {
      id: 1,
      name: 'Test user',
      email: 'test@test.test',
      avatarURL: 'null',
      organizationRoles: [
        { organizationId: 1, userId: 2, role: UserRole.organizationMember },
      ],
    },
  ];

  public getUsers(): void {
    this.organizationService
      .getOrganizationUsers(this.organization.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.users = result.body;
        }
      });
  }
  // ================================
}
