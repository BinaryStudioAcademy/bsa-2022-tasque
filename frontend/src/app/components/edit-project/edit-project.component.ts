import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { EditProjectModel } from 'src/core/models/project/edit-project-model';
import { ProjectInfoModel } from 'src/core/models/project/project-info-model';
import { NotificationService } from 'src/core/services/notification.service';
import { ProjectService } from 'src/core/services/project.service';
import { SideBarService } from 'src/core/services/sidebar.service';
import { BoardType, IBoard, IUserCard } from 'src/shared/components/select-users/Models';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.sass']
})
export class EditProjectComponent implements OnInit {

  @Input() project: ProjectInfoModel;
  
  public projectName = '';
  public sidebarName = 'editProject';

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
      return 'Project is required';
    }
    return '';
  }

  changeRoleBoard: IBoard;
  inviteUserBoard: IBoard;
  deleteUserBoard: IBoard;

  invitedUsersList: IUserCard[];

  constructor(private notification: NotificationService,
    private sideBarService: SideBarService, 
    public projectService: ProjectService) {
      this.projectNameControl = new FormControl(this.projectName, [
        Validators.required,
        Validators.minLength(2),
      ]);
  }

  ngOnInit() {
    this.projectName = this.project.name;
    this.sidebarName += this.project.id;

    this.editProjectForm = new FormGroup({
      projectNameControl: this.projectNameControl,
    });

    this.changeRoleBoard = {
      id: 1,
      type: BoardType.Organization,
      users: this.project.users,
      hasRoles: true
    };

    console.log(this.changeRoleBoard);

    this.deleteUserBoard = {
      id: 1,
      type: BoardType.Organization,
      users: this.project.users,
      hasRoles: false
    };

    this.inviteUserBoard = {
      id: 1,
      type: BoardType.Organization,
      users: this.project.users,
      hasRoles: false
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public submitForm(): void {

    //this.project.name = this.projectName;

    this.projectService.editProject({id: this.project.id, name: this.project.name}).subscribe(() => {
      this.notification.success(
        'Project data has been updated successfully',
      );
      this.editProjectForm.reset();
      this.sideBarService.toggle(this.sidebarName);
    });
  }

  public clearForm(): void {
    this.editProjectForm.reset();
    this.sideBarService.toggle(this.sidebarName);
  }

  public titleContent(event: Event): string {
    const input = event.target as HTMLElement;
    return input.innerText;
  }

  
}
