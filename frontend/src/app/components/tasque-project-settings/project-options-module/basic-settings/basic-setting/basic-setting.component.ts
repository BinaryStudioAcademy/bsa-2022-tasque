import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { faCheck, faMinus, faPencil, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { TaskPriority } from 'src/core/models/task/task-priority';
import { TaskState } from 'src/core/models/task/task-state';
import { TaskType } from 'src/core/models/task/task-type';
import { NotificationService } from 'src/core/services/notification.service';

@Component({
  selector: 'app-basic-setting',
  templateUrl: './basic-setting.component.html',
  styleUrls: ['./basic-setting.component.sass']
})
export class BasicSettingComponent implements OnInit {
  @Input() public projectSetting: TaskState | TaskPriority | TaskType;
  public isEditing = false;

  @Output() public settingDeleted = new EventEmitter<number>();
  @Output() public settingChanged = new EventEmitter();

  formNameControl: FormControl;
  formColorControl: FormControl;

  applyIcon = faCheck;
  removeIcon = faMinus;
  editIcon = faPencil;
  resetIcon = faRotateLeft;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.formNameControl = new FormControl(this.projectSetting.name, [
      Validators.required,
      Validators.minLength(2),
    ]);

    this.formColorControl = new FormControl(this.projectSetting.color, [
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

  public deleteSetting(): void {
    this.settingDeleted.emit(this.projectSetting.id);
  }

  public resetSetting(): void {
    this.formColorControl.reset(this.projectSetting.color);
    this.formNameControl.reset(this.projectSetting.name);
  }

  public saveSetting(): void {
    if (!this.formNameControl.valid || !this.formColorControl.valid) {
      this.notificationService.error(this.errorMessage);
      return;
    }

    if (this.formColorControl.pristine && this.formNameControl.pristine) {
      this.isEditing = false;
      return;
    }

    this.projectSetting.color = this.formColorControl.value;
    this.projectSetting.name = this.formNameControl.value;

    this.isEditing = false;
    this.settingChanged.emit();
  }
}
