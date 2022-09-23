import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrNotificationService } from 'src/core/services/toastr-notification.service';
import { Subject } from 'rxjs';
import { EditorConfig } from 'src/core/settings/angular-editor-setting';
import { TaskCreateViewModel } from 'src/core/models/task/task-create-view-model';
import { TasqueDropdownOption } from '../tasque-dropdown/dropdown.component';
import { TaskTemplateService } from 'src/core/services/task-template.service';
import { TaskTemplate } from 'src/core/models/task/task-template';
import { TaskType } from 'src/core/models/task/task-type';
import { ProjectService } from 'src/core/services/project.service';
import { ProjectModel } from 'src/core/models/project/project-model';
import { TaskCustomField } from 'src/core/models/task/task-template-models/task-custom-field';
import { UserModel } from 'src/core/models/user/user-model';
import { TaskCustomFieldModel } from 'src/core/models/task/task-creation-models/task-custom-field-model';
import { TaskPriority } from 'src/core/models/task/task-priority';
import { TaskService } from 'src/core/services/task.service';
import { TaskState } from 'src/core/models/task/task-state';
import { BacklogService } from 'src/core/services/backlog.service';
import { TaskModel } from 'src/core/models/task/task-model';
import { UserProjectRole } from 'src/core/models/user/user-project-roles';
import { BusinessRole } from '../select-users/Models';
import { OrganizationModel } from 'src/core/models/organization/organization-model';
import { ScopeGetCurrentEntityService } from 'src/core/services/scope/scopre-get-current-entity.service';
import { UserRole } from 'src/core/models/user/user-roles';
import { OrganizationService } from 'src/core/services/organization.service';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: 'tasque-task-creation',
  templateUrl: './task-creation.component.html',
  styleUrls: ['./task-creation.component.sass'],
})
export class TaskCreationComponent implements OnInit, OnDestroy {
  faExpeditedssl = faEllipsisVertical;

  public task: TaskCreateViewModel = {};

  public taskCreateForm: FormGroup = new FormGroup({});
  public projectControl: FormControl;
  public issueTypeControl: FormControl;
  public summaryControl: FormControl;
  public descriptionControl: FormControl;
  public priorityControl: FormControl;
  public stateControl: FormControl;

  public unsubscribe$ = new Subject<void>();

  public editorConfig = EditorConfig;
  public editorContent = '';

  public selectedProjectId: number;
  public selectedTaskTypeId: number;
  public selectedPriorityId: number | undefined;
  public selectedStateId: number | undefined;

  public template: TaskTemplate;
  public taskType: TaskType;
  public showError = false;

  public customFields: TaskCustomField[];
  public issueTemplates: TaskTemplate[];
  public taskStates: TaskState[];
  public projectUsers: UserModel[];
  public currentUser: UserModel;

  public taskCustomFields: TaskCustomFieldModel[] = [];
  public projects: TasqueDropdownOption[] = [];
  public issueTypes: TasqueDropdownOption[] = [];
  public projectPriorities: TasqueDropdownOption[] = [];
  public taskStateOptions: TasqueDropdownOption[] = [];

  @Input() public buttonText = '';
  @Input() public organizationId: number;

  @Input() public btnText = 'Task creation';
  @Input() public btnClass = 'btn stroke';
  @Input() public sidebarName = 'taskCreation';

  private _currentProject: ProjectModel;
  @Input() public set currentProject(project: ProjectModel) {
    if (!project) {
      this.projectControl.reset();
      return;
    }

    this.setSelectedProjectId(project.id, false);

    const options: TasqueDropdownOption = {
      title: project.name,
      id: project.id,
    };

    this.projectControl.setValue(options);
  }
  public get currentProject(): ProjectModel {
    return this._currentProject;
  }

  @Input() public currentTasks: TaskModel[];
  @Input() public sprintId: number;

  public isCurrentUserAdmin = false;
  public isCurrentUserProjectAdmin = false;

  public isOpen = false;

  get projectErrorMessage(): string {
    const ctrl = this.projectControl;

    if (ctrl.errors?.['required'] && (ctrl.touched || ctrl.dirty)) {
      return 'Project is required';
    }
    return '';
  }

  get issueTypeErrorMessage(): string {
    const ctrl = this.issueTypeControl;
    if (ctrl.errors?.['required'] && (ctrl.touched || ctrl.dirty)) {
      return 'Issue type is required';
    }
    return '';
  }

  get summaryErrorMessage(): string {
    const ctrl = this.summaryControl;

    if (ctrl.errors?.['minlength'] && (ctrl.touched || ctrl.dirty)) {
      return 'Title must be at least 2 characters';
    }
    if (ctrl.errors?.['maxlength'] && (ctrl.touched || ctrl.dirty)) {
      return 'Title must be less than 80 characters';
    }
    if (ctrl.errors?.['required'] && (ctrl.touched || ctrl.dirty)) {
      return 'Title is required';
    }
    return '';
  }

  get descriptionErrorMessage(): string {
    const ctrl = this.descriptionControl;

    if (ctrl.errors?.['maxlength']) {
      return 'Description must be less than 80 characters';
    }
    return '';
  }

  get editorErrorMessage(): string {
    const ctrl = this.descriptionControl;

    if (ctrl.errors?.['maxlength']) {
      return 'Description must be less than 5000 characters';
    }
    return '';
  }

  constructor(
    private notificationService: ToastrNotificationService,
    private taskTemplateService: TaskTemplateService,
    private projectService: ProjectService,
    private taskService: TaskService,
    private backlogService: BacklogService,
    private getCurrentEntityService: ScopeGetCurrentEntityService,
    private organizationService: OrganizationService,
  ) {
    this.projectControl = new FormControl(this.task.projectId, [
      Validators.required,
    ]);
    this.issueTypeControl = new FormControl(this.task.typeId, [
      Validators.required,
    ]);
    this.summaryControl = new FormControl(this.task.summary, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(80),
    ]);
    this.descriptionControl = new FormControl(this.task.description, [
      Validators.maxLength(5000),
    ]);
    this.priorityControl = new FormControl(this.task.priorityId);
    this.stateControl = new FormControl(this.task.stateId);
  }

  ngOnInit(): void {
    this.taskCreateForm = new FormGroup({
      projectControl: this.projectControl,
      issueTypeControl: this.issueTypeControl,
      summaryControl: this.summaryControl,
      descriptionControl: this.descriptionControl,
      priorityControl: this.priorityControl,
      stateControl: this.stateControl,
    });

    this.projectService
      .getProjectsByOrganizationId(this.organizationId)
      .subscribe((resp) => {
        const projects = resp.body as ProjectModel[];
        if (projects === null) {
          return;
        }
        projects.forEach((p) =>
          this.projects.push({
            title: p.name,
            id: p.id,
          }),
        );
      });

    this.getCurrentEntityService.getCurrentUserService.currentUser$.subscribe(
      (user) => {
        this.currentUser = user;
        this.permissionToEdit();
      },
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  setSelectedProjectId(id: number, clean: boolean): void {
    this.selectedProjectId = id;
    this.issueTemplates = [];
    this.projectUsers = [];
    this.issueTypes = [];
    this.customFields = [];
    this.taskCustomFields = [];

    this.taskTemplateService
      .getAllProjectTaskTypes(this.selectedProjectId)
      .pipe(
        concatMap((resp) => {
          const types = resp.body as TaskType[];
          this.issueTypes = [];
          types.forEach((t) =>
            this.issueTypes.push({
              title: t.name,
              id: t.id,
              color: t.color ?? '',
            }),
          );

          if (!clean) {
            this.issueTypeControl.setValue(this.issueTypes[0]);
          }
          return this.taskTemplateService.getAllProjectTemplates(
            this.selectedProjectId,
          );
        }),
      )
      .subscribe((resp) => {
        this.issueTemplates = resp.body as TaskTemplate[];
        if (!clean) {
          if (this.issueTypes[0]) {
            this.setSelectedTaskType(this.issueTypes[0].id);
          }
        }
      });

    this.projectService
      .getProjectParticipants(this.selectedProjectId)
      .subscribe((resp) => {
        if (resp.ok) {
          this.projectUsers = resp.body as UserModel[];
        } else {
          //TODO
          console.warn('Something went wrong, try again later');
          //  this.notificationService.error(
          //   'Something went wrong, try again later',
          //  );
        }
      });

    this.projectService
      .getProjectPriorities(this.selectedProjectId)
      .subscribe((resp) => {
        if (resp.ok) {
          const priorities = resp.body as TaskPriority[];
          this.projectPriorities = [];
          priorities.forEach((p) =>
            this.projectPriorities.push({
              title: p.name,
              id: p.id,
              color: p.color,
            }),
          );
          if (!clean) {
            this.priorityControl.setValue(this.projectPriorities[0]);
          }
        } else {
          //TODO
          console.warn('Something went wrong, try again later');
          //   this.notificationService.error(
          //     'Something went wrong, try again later',
          //   );
        }
      });

    this.projectService
      .getProjectStates(this.selectedProjectId)
      .subscribe((resp) => {
        if (resp.ok) {
          this.taskStates = resp.body as TaskState[];
          this.taskStateOptions = [];
          this.taskStates.forEach((ts) => {
            this.taskStateOptions.push({
              id: ts.id,
              title: ts.name,
              color: ts.color,
            });
          });
          if (!clean) {
            this.stateControl.setValue(this.taskStateOptions[0]);
          }
        } else {
          //TODO
          console.warn('Something went wrong, try again later');

          // this.notificationService.error(
          //  'Something went wrong, try again later',
          // );
        }
      });
  }

  setSelectedTaskType(id: number): void {
    this.selectedTaskTypeId = id;
    this.customFields = [];
    this.taskCustomFields = [];

    if (this.selectedProjectId === undefined) {
      return;
    }
    this.template = this.issueTemplates.find(
      (t) =>
        t.projectId === this.selectedProjectId &&
        t.typeId === this.selectedTaskTypeId,
    ) as TaskTemplate;

    this.customFields = this.template?.customFields ?? [];
    this.customFields.forEach((cf) =>
      this.taskCustomFields.push({
        fieldId: cf.fieldId as string,
        type: cf.type,
      }),
    );
  }

  setSelectedTaskState(id: number): void {
    this.selectedStateId = id;
  }

  public submitForm(): void {
    if (
      !this.taskCreateForm.valid ||
      !this.taskCreateForm.dirty ||
      !this.taskCreateForm.touched
    ) {
      this.taskCreateForm.markAllAsTouched();
      this.showError = true;
      this.notificationService.error(
        'Some values are incorrect. Follow error messages to solve this problem',
        'Invalid values',
      );
      return;
    }

    this.task = {
      authorId: this.currentUser.id,
      projectId: this.taskCreateForm.get('projectControl')?.value.id,

      typeId: this.taskCreateForm.get('issueTypeControl')?.value.id,
      stateId: this.taskCreateForm.get('stateControl')?.value.id,
      priorityId: this.taskCreateForm.get('priorityControl')?.value.id,

      summary: this.taskCreateForm.get('summaryControl')?.value,
      description: this.taskCreateForm.get('descriptionControl')?.value,

      customFields: this.taskCustomFields,
      sprintId: this.sprintId,
    };

    this.taskService.createTask(this.task).subscribe(
      (result) => {
        if (result.body) {
          if (this.currentTasks) {
            this.currentTasks.push(result.body);
          } else {
            this.backlogService.changeBacklog();
          }
          this.notificationService.success(
            'Task has been created successfully',
          );
          this.clearForm();
        }
      },
      () => {
        //TODO
        console.warn('Something went wrong, try again later');
        // this.notificationService.error('Something go wrong. Try again later');
        this.clearForm();
      },
    );
  }

  setPriority(id: number): void {
    this.selectedPriorityId = id;
  }

  public clearForm(): void {
    const lastProject = this.projectControl.value;
    this.taskCreateForm.reset();
    this.setSelectedProjectId(lastProject.id, true);
    this.projectControl.setValue(lastProject);
    this.selectedPriorityId = undefined;
    this.selectedStateId = undefined;
    this.projectPriorities = [];
    this.issueTypes = [];
    this.taskStateOptions = [];
    this.customFields = [];
  }

  getCustomField(field: TaskCustomFieldModel): void {
    const isExist = this.taskCustomFields.find(
      (f) => f.fieldId === field.fieldId,
    );
    if (isExist === undefined) {
      this.taskCustomFields.push(field);
    }
    this.taskCustomFields.forEach((val) => {
      if (val.fieldId === field.fieldId) {
        val.fieldValue = field.fieldValue;
      }
    });
  }

  toogleModal(event: boolean): void {
    this.isOpen = event;
  }

  public permissionToEdit(): void {
    const organizationId =
      this.getCurrentEntityService.getCurrentOrganizationService
        .currentOrganizationId;
    this.organizationService
      .getOrganization(organizationId)
      .subscribe((resp) => {
        const currentOrganization = resp.body as OrganizationModel;
        const role = this.currentUser.organizationRoles.find(
          (r) =>
            r.organizationId === organizationId &&
            r.userId === this.currentUser.id,
        )?.role as UserRole;
        if (
          role >= UserRole.projectAdmin ||
          currentOrganization.authorId === this.currentUser.id
        ) {
          this.isCurrentUserAdmin = true;
        } else {
          this.isCurrentUserAdmin = false;
        }

        const projectId =
          this.getCurrentEntityService.getCurrentProjectService
            .currentProjectId;

        const projectRole = this.currentUser.roles?.find(
          (r) => r.projectId === projectId && r.userId === this.currentUser.id,
        ) as UserProjectRole;

        if (
          projectRole.roleId == BusinessRole.Admin ||
          this.isCurrentUserAdmin
        ) {
          this.isCurrentUserProjectAdmin = true;
        } else {
          this.isCurrentUserProjectAdmin = false;
        }
      });
  }
}
