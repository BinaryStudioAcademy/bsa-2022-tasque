import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { faCheck, faMinus, faPlus, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/core/base/base.component';
import { ProjectModel } from 'src/core/models/project/project-model';
import { TaskPriority } from 'src/core/models/task/task-priority';
import { TaskState } from 'src/core/models/task/task-state';
import { TaskType } from 'src/core/models/task/task-type';
import { NotificationService } from 'src/core/services/notification.service';
import { ProjectService } from 'src/core/services/project.service';
import { SettingType } from '../setting-type-model';

@Component({
  selector: 'app-basic-setting-field',
  templateUrl: './basic-setting-field.component.html',
  styleUrls: ['./basic-setting-field.component.sass']
})
export class BasicSettingFieldComponent extends BaseComponent implements OnInit {
  @Input()
  public set projectSettings(settings: TaskType[] | TaskState[] | TaskPriority[]) {
    if (!settings) {
      this.settingsShow = [];
      this.defaultSettings = [];
      return;
    }

    this.settingsShow = Array.from(settings);
    this.defaultSettings = Array.from(settings);
  }

  @Input() public project: ProjectModel;
  @Input() public type: SettingType;

  public settingsShow: TaskType[] | TaskState[] | TaskPriority[];

  applyIcon = faCheck;
  addIcon = faPlus;
  removeIcon = faMinus;
  resetIcon = faRotateLeft;

  defaultSettings: TaskType[] | TaskState[] | TaskPriority[];
  formNameControl: FormControl;
  formColorControl: FormControl;

  isAdding = false;
  isUpdated = false;

  constructor(
    private notificationService: NotificationService,
    private projectService: ProjectService
  ) {
    super();
  }

  ngOnInit(): void {
    this.formNameControl = new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]);

    this.formColorControl = new FormControl('', [
      Validators.required,
    ]);
  }

  get errorMessage(): string {
    if (this.formNameControl.errors?.['required']) {
      return 'All fields are required';
    }
    if (this.formNameControl.errors?.['minlength']) {
      return 'Minimum label name should contain 2 characters';
    }
    if (this.formColorControl.errors?.['required']) {
      return 'Choose color';
    }
    return 'Unexpected error. Try again.';
  }

  public deleteSetting($event: number): void {
    const id = $event;
    const index = this.settingsShow.findIndex((setting) => setting.id === id);

    if (index === -1) {
      return;
    }

    this.settingsShow.splice(index, 1);
    this.isUpdated = true;
  }

  public saveSetting(): void {
    if (!this.formNameControl.valid || !this.formColorControl.valid) {
      this.notificationService.error(this.errorMessage);
      return;
    }

    this.settingsShow.push({
      id: 0,
      name: this.formNameControl.value,
      color: this.formColorControl.value,
      projectId: this.project.id,
    });
    this.isAdding = false;

    this.formColorControl.setValue('');
    this.formNameControl.setValue('');
    this.isUpdated = true;
  }

  public addSetting(): void {
    this.isAdding = !this.isAdding;
  }

  public clearSetting(): void {
    this.formColorControl.setValue('');
    this.formNameControl.setValue('');
  }

  public removeSetting(): void {
    this.isAdding = false;
    this.clearSetting();
  }

  public cancelEdit(): void {
    this.settingsShow = Array.from(this.defaultSettings);
    this.isUpdated = false;
    this.isAdding = false;
    this.formColorControl.setValue('');
    this.formNameControl.setValue('');
  }

  public saveEdit(): void {
    if (!this.isUpdated) {
      this.notificationService.info('There are no changes. Update values');
      return;
    }

    switch (this.type) {
      case 'Priority':
        this.projectService.updateProjectTaskPriorities(this.project.id, this.settingsShow as TaskPriority[])
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((resp) => {
            if (!resp.body) {
              return;
            }
            this.settingsShow = Array.from(resp.body);
            this.defaultSettings = Array.from(resp.body);
            this.notificationService.success('Task Priorities were successfully updated');
            this.isUpdated = false;
          });
        return;
      case 'State':
        this.projectService.updateProjectTaskStates(this.project.id, this.settingsShow as TaskState[])
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((resp) => {
            if (!resp.body) {
              return;
            }
            this.settingsShow = Array.from(resp.body);
            this.defaultSettings = Array.from(resp.body);
            this.notificationService.success('Task States were successfully updated');
            this.isUpdated = false;
          });
        return;
      case 'Type':
        this.projectService.updateProjectTaskTypes(this.project.id, this.settingsShow as TaskType[])
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((resp) => {
            if (!resp.body) {
              return;
            }
            this.settingsShow = Array.from(resp.body);
            this.defaultSettings = Array.from(resp.body);
            this.notificationService.success('Task Types were successfully updated');
            this.isUpdated = false;
          });
        return;
    }
  }
}
