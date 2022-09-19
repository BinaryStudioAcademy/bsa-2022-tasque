import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { faCheck, faMinus, faPencil, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ProjectModel } from 'src/core/models/project/project-model';
import { TaskPriority } from 'src/core/models/task/task-priority';
import { TaskState } from 'src/core/models/task/task-state';
import { TaskType } from 'src/core/models/task/task-type';

@Component({
  selector: 'app-basic-label-field',
  templateUrl: './basic-label-field.component.html',
  styleUrls: ['./basic-label-field.component.sass']
})
export class BasicLabelFieldComponent implements OnInit {
  @Input() public settings: TaskType[] | TaskState[] | TaskPriority[];
  @Input() public project: ProjectModel;

  applyIcon = faCheck;
  removeIcon = faMinus;
  addIcon = faPlus;
  editIcon = faPencil;

  formNameControl: FormControl;
  formColorControl: FormControl;

  isChanging = false;

  constructor() { }

  ngOnInit(): void {
    this.formNameControl = new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]);

    this.formColorControl = new FormControl('', [
      Validators.required,
    ]);
  }

  public deleteSetting(setting: TaskType | TaskState | TaskPriority): void {
    for (let index = 0; index < this.settings.length; index++) {
      if (this.settings[index] === setting) {
        this.settings.splice(index, 1);
        return;
      }
    }
  }

  public editSetting(_setting: TaskType | TaskState | TaskPriority): void {
    throw new Error('Method not implemented.');
  }

  public saveSetting(): void {
    throw new Error('Method not implemented.');
  }

  public addSetting(): void {
    throw new Error('Method not implemented.');
  }

  public cancelEdit(): void {
    throw new Error('Method not implemented.');
  }

  public saveEdit(): void {
    throw new Error('Method not implemented.');
  }
}
