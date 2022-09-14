import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProjectInfoModel } from 'src/core/models/project/project-info-model';
import { GetCurrentProjectService } from 'src/core/services/get-current-project.service';
import { NotificationService } from 'src/core/services/notification.service';
import { ProjectService } from 'src/core/services/project.service';
import { SideBarService } from 'src/core/services/sidebar.service';
import { BoardType, IBoard, IUserCard } from 'src/shared/components/select-users/Models';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.sass']
})
export class EditProjectComponent implements OnInit, OnDestroy {

  @Input() project: ProjectInfoModel;
  
  public projectName = '';
  public projectKey = '';
  public sidebarName = 'editProject';

  public board: IBoard;

  faPenToSquare = faPenToSquare;
  public unsubscribe$ = new Subject<void>();

  public editProjectForm: FormGroup = new FormGroup({});
  public projectNameControl: FormControl;
  public projectKeyControl: FormControl;
  public projectUsersControl: FormControl;

  get projectNameErrorMessage(): string {
    const ctrl = this.projectNameControl;
    if (ctrl.errors?.['minlength']) {
      return 'Summary must be at least 2 characters';
    }
    if (ctrl.errors?.['required']) {
      return 'Project name is required';
    }
    return '';
  }

  get projectKeyErrorMessage(): string {
    const ctrl = this.projectNameControl;
    if (ctrl.errors?.['minlength']) {
      return 'Summary must be at least 2 characters';
    }
    if (ctrl.errors?.['required']) {
      return 'Project name is required';
    }
    if (ctrl.errors?.['maxLength']) {
      return 'The value cannot be greater than 5';
    }
    return '';
  }

  constructor(private notification: NotificationService,
    private sideBarService: SideBarService,
    public projectService: ProjectService,
    public currentProjectService: GetCurrentProjectService) {
      this.projectNameControl = new FormControl(this.projectName, [
        Validators.required,
        Validators.minLength(2),
      ]);
      this.projectKeyControl = new FormControl(this.projectKey, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(5)
      ]);
  }

  ngOnInit(): void {
    this.projectName = this.project.name;
    this.projectKey = this.project.key;
    this.sidebarName += this.project.id;

    this.editProjectForm = new FormGroup({
      projectNameControl: this.projectNameControl,
    });

    this.board = {
      id: 1,
      type: BoardType.Organization,
      users: this.project.users,
      hasRoles: true
    };
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public submitForm(): void {
    this.project.name = this.projectName;
    this.project.key = this.projectKey;

    this.projectService.editProject({ id: this.project.id, name: this.project.name, key: this.project.key })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if(result.status == 200 && result.body !== null) {
          this.notification.success(
            'Project data has been updated successfully',
          );
          this.currentProjectService.updateProject(result.body);
          this.editProjectForm.reset();
          this.sideBarService.toggle(this.sidebarName);
        }
    });
  }

  public clearForm(): void {
    this.projectName = this.project.name;
    this.projectKey = this.project.key;
    this.editProjectForm.reset();
    this.sideBarService.toggle(this.sidebarName);
  }

  public titleContent(event: Event): string {
    const input = event.target as HTMLElement;
    return input.innerText;
  }
  
  inviteUser(email: string): void {
    this.projectService.inviteUser({ projectId: this.project.id, email: email })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  deleteUser(email: string): void {
    this.projectService.kickUser({ projectId: this.project.id, email: email })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        const index = this.board.users.findIndex((x) => { x.email == email; });
        this.board.users = this.board.users.splice(index, 1);
      });
  }

  changeUserRole(user: IUserCard): void {
    if(user && user.role) {
      this.projectService.changeUserRole({ projectId: this.project.id, userId: user.id, roleId: user.role })
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe();
    }
  }
}
