import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SideBarService } from 'src/core/services/sidebar.service';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/core/services/notification.service';
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
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';
import { TaskCustomFieldModel } from 'src/core/models/task/task-creation-models/task-custom-field-model';

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

  public unsubscribe$ = new Subject<void>();

  public editorConfig = EditorConfig;
  public editorContent = '';

  public selectedProjectId: number;
  public selectedTaskTypeId: number;

  public template: TaskTemplate;
  public taskType: TaskType;

  public customFields: TaskCustomField[];
  public issueTemplates: TaskTemplate[];
  public projectUsers: UserModel[];
  public currentUser: UserModel;

  public taskCustomFields: TaskCustomFieldModel[] = [];

  @Input() public buttonText = '';
  @Input() public organizationId = 1;
  @Input() public projects: TasqueDropdownOption[] = [];
  @Input() public issueTypes: TasqueDropdownOption[] = [];
  @Input() public btnText = 'Task creation';
  @Input() public btnClass = 'btn stroke';
  @Input() public sidebarName = 'taskCreation';

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
      return 'Summary must be at least 2 characters';
    }
    if (ctrl.errors?.['maxlength'] && (ctrl.touched || ctrl.dirty)) {
      return 'Summary must be at less  80 characters';
    }
    if (ctrl.errors?.['required'] && (ctrl.touched || ctrl.dirty)) {
      return 'Summary is required';
    }
    return '';
  }

  get descriptionErrorMessage(): string {
    const ctrl = this.descriptionControl;

    if (ctrl.errors?.['maxlength']) {
      return 'Description must be at less  80 characters';
    }
    return '';
  }

  get editorErrorMessage(): string {
    const ctrl = this.descriptionControl;

    if (ctrl.errors?.['maxlength']) {
      return 'Description must be at less 5000 characters';
    }
    return '';
  }

  constructor(
    private sideBarService: SideBarService,
    private notificationService: NotificationService,
    private taskTemplateService: TaskTemplateService,
    private projectService: ProjectService,
    private currentUserService: GetCurrentUserService
  ) {
    this.projectControl = new FormControl(this.task.project, [
      Validators.required,
    ]);
    this.issueTypeControl = new FormControl(this.task.issueType, [
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
  }

  ngOnInit(): void {
    this.taskCreateForm = new FormGroup({
      projectControl: this.projectControl,
      issueTypeControl: this.issueTypeControl,
      summaryControl: this.summaryControl,
      descriptionControl: this.descriptionControl,
    });
    
    this.projectService.getProjectsByOrganizationId(this.organizationId)
    .subscribe((resp) => {
      const projects = resp.body as ProjectModel[];
      if(projects === null) {
        return;
      }
      projects.forEach((p) => this.projects.push({
        title: p.name,
        id: p.id
      }));
    });

    this.currentUserService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  setSelectedProjectId(id: number): void {
    this.selectedProjectId = id;
    this.issueTemplates = [];
    this.projectUsers = [];
    this.issueTypes = [];
    this.customFields = [];
    this.taskCustomFields = [];

    this.taskTemplateService.getAllProjectTemplates(this.selectedProjectId).subscribe((resp) => {
      this.issueTemplates = resp.body as TaskTemplate[];
    });

    this.taskTemplateService.getAllProjectTaskTypes(this.selectedProjectId).subscribe((resp) => {
      const types = resp.body as TaskType[];
      types.forEach((t) => this.issueTypes.push({
        title: t.name,
        id: t.id,
      }));
    });

    this.projectService.getProjectParticipants(this.selectedProjectId).subscribe((resp) => {
      if(resp.ok) {
        this.projectUsers = resp.body as UserModel[];
      } else {
        this.notificationService.error('Something went wrong, try again later');
      }
    });
  }

  setSelectedTaskType(id: number): void {
    this.selectedTaskTypeId = id;
    this.customFields = [];
    this.taskCustomFields = [];
    
    if(this.selectedProjectId === undefined) {
      return;
    }
    this.template = this.issueTemplates
      .find((t) => t.projectId === this.selectedProjectId && t.typeId === this.selectedTaskTypeId) as TaskTemplate;
      this.customFields = this.template.customFields?? [];
      this.customFields.forEach((cf) => this.taskCustomFields.push({
        fieldId: cf.fieldId as string,
        type: cf.type,
      }));
  }

  openSidebar(): void {
    this.sideBarService.toggle('');
  }

  public submitForm(): void {
    if (!this.taskCreateForm.valid || !this.taskCreateForm.dirty) {
      this.taskCreateForm.markAllAsTouched();
      this.notificationService
        .error('Some values are incorrect. Follow error messages to solve this problem', 'Invalid values');
      return;
    }

    this.task = {
      currentUserId: this.currentUser.id,
      project: this.taskCreateForm.get('projectControl')?.value,
      issueType: this.taskCreateForm.get('issueTypeControl')?.value,
      summary: this.taskCreateForm.get('summaryControl')?.value,
      description: this.taskCreateForm.get('descriptionControl')?.value,
    };
    console.log(this.task);
    console.log(this.taskCustomFields);
  }

  public clearForm(): void {
    this.taskCreateForm.reset();
    this.sideBarService.toggle('');
    this.customFields = [];
  }

  getCustomField(field: TaskCustomFieldModel): void {
    //console.log('get field');
    //console.log(field);
    const isExist = this.taskCustomFields.find((f) => f.fieldId === field.fieldId);
    if(isExist === undefined){
      this.taskCustomFields.push(field);
    }
    this.taskCustomFields.forEach((val) => {
      if(val.fieldId === field.fieldId) {
        val.fieldValue = field.fieldValue;
      }
    });
  }
}
