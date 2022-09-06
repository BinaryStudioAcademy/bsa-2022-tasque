import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProjectInfoModel } from 'src/core/models/project/project-info-model';
import { NotificationService } from 'src/core/services/notification.service';
import { ProjectService } from 'src/core/services/project.service';
import { SideBarService } from 'src/core/services/sidebar.service';
import { BoardType, IBoard, IUserCard } from 'src/shared/components/select-users/Models';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.sass']
})
export class EditProjectComponent implements OnInit {

  @Input() project: ProjectInfoModel;
  
  public projectName = '';
  public sidebarName = 'editProject';

  public board: IBoard;

  faPenToSquare = faPenToSquare;
  public unsubscribe$ = new Subject<void>();

  public editProjectForm: FormGroup = new FormGroup({});
  public projectNameControl: FormControl;
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

  constructor(private notification: NotificationService,
    private sideBarService: SideBarService,
    public projectService: ProjectService) {
      this.projectNameControl = new FormControl(this.projectName, [
        Validators.required,
        Validators.minLength(2),
      ]);
  }

  ngOnInit(): void {
    this.projectName = this.project.name;
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

    this.projectService.editProject({ id: this.project.id, name: this.project.name })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if(result.status == 200 && result.body !== null) {
          this.notification.success(
            'Project data has been updated successfully',
          );
          this.editProjectForm.reset();
          this.sideBarService.toggle(this.sidebarName);
        }
    });
  }

  public clearForm(): void {
    this.projectName = this.project.name;
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
        const index = this.board.users.findIndex(x => { x.email == email });
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
