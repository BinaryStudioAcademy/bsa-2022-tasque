import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskModel } from 'src/core/models/task/task-model';
import { UserModel } from 'src/core/models/user/user-model';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { BaseComponent } from 'src/core/base/base.component';

export interface EditTaskDialogData {
  currentUser: UserModel,
  task: TaskModel
}

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.sass']
})
export class EditTaskDialogComponent extends BaseComponent implements OnInit {

  public task: TaskModel;
  public currentUser: UserModel;
  public buttonIcon = faXmark;

  constructor(@Inject(MAT_DIALOG_DATA) public data: EditTaskDialogData) {
    super();
    this.task = data.task;
    this.currentUser = data.currentUser;
  }

  ngOnInit(): void { }
}
