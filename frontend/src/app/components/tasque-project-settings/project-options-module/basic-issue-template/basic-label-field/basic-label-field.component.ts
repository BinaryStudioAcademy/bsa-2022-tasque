import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  }

  public deleteSetting(_setting: TaskType | TaskState | TaskPriority): void {
    throw new Error('Method not implemented.');
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
