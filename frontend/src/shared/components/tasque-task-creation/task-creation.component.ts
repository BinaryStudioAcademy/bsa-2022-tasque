import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SideBarService } from 'src/core/services/sidebar.service';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/core/services/notification.service';
import { Subject } from 'rxjs';
import { EditorConfig } from 'src/core/settings/angular-editor-setting';
import { TaskCreateViewModel } from 'src/core/models/task/task-create-view-model';
import { TasqueDropdownOption } from '../tasque-dropdown/dropdown.component';

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

  @Input() public buttonText = '';
  @Input() public currentUser: number;
  @Input() public projects: TasqueDropdownOption[];
  @Input() public issueTypes: TasqueDropdownOption[];
  @Input() public btnText = 'Task creation';
  @Input() public btnClass = 'btn stroke';
  @Input() public sidebarName = 'taskCreation';

  get projectErrorMessage(): string {
    const ctrl = this.projectControl;

    if (ctrl.errors?.['required']) {
      return 'Project is required';
    }
    return '';
  }

  get issueTypeErrorMessage(): string {
    const ctrl = this.issueTypeControl;

    if (ctrl.errors?.['required']) {
      return 'Issue type is required';
    }
    return '';
  }

  get summaryErrorMessage(): string {
    const ctrl = this.summaryControl;

    if (ctrl.errors?.['minlength']) {
      return 'Summary must be at least 2 characters';
    }
    if (ctrl.errors?.['maxlength']) {
      return 'Summary must be at less  80 characters';
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
    private notification: NotificationService,
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
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  openSidebar(): void {
    this.sideBarService.toggle('');
  }

  public submitForm(): void {
    if (!this.taskCreateForm.valid || !this.taskCreateForm.dirty) {
      if (!this.summaryControl.valid)
        this.notification.error('Issue name is required');
      else this.notification.error('Invalid values');
      return;
    }

    this.task = {
      currentUser: this.currentUser,
      project: this.taskCreateForm.get('projectControl')?.value,
      issueType: this.taskCreateForm.get('issueTypeControl')?.value,
      summary: this.taskCreateForm.get('summaryControl')?.value,
      description: this.taskCreateForm.get('descriptionControl')?.value,
    };
  }

  public clearForm(): void {
    this.taskCreateForm.reset();
    this.sideBarService.toggle('');
  }
}
