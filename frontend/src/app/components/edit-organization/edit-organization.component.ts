import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrganizationModel } from 'src/core/models/organization/organization-model';
import { NotificationService } from 'src/core/services/notification.service';
import { OrganizationService } from 'src/core/services/organization.service';
import { SideBarService } from 'src/core/services/sidebar.service';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { BoardType, IBoard } from 'src/shared/components/select-users/Models';
import { ProfileChangesDTO } from 'src/app/user/dto/profile-changes-dto';
import { GetCurrentOrganizationService } from 'src/core/services/get-current-organization.service';

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
    private notification: NotificationService,
    private sideBarService: SideBarService,
    private organizationService: OrganizationService,
    private getCurrentOrganizationService: GetCurrentOrganizationService
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

  public submitForm(): void {
    this.organization.name = this.organizationName;

    this.organizationService
      .updateOrganization(this.organization)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.status == 200 && result.body !== null) {
          this.notification.success(
            'Organization data has been updated successfully',
          );
          this.getCurrentOrganizationService.updateOrganizations(result.body);
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
    { id: 1, name: 'Test user', email: 'test@test.test', avatarURL: 'null' },
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

  public addUser(): void {
    this.organizationService
      .addUser(this.organization.id, this.users[0])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.status == 200) {
          this.notification.success('The user is added to the organization');
        }
      });
  }

  public delUser(): void {
    this.organizationService
      .deleteUser(this.organization.id, this.users[0])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.status == 200) {
          this.notification.success(
            'The user has been removed from the organization',
          );
        }
      });
  }
  // ================================
}
