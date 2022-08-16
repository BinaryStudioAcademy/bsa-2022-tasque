import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserModel } from 'src/core/models/user/user-model';

export interface EditTaskDialogData {
  currentUser: UserModel,
  task: Task
}

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.sass']
})
export class EditTaskDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public currentUser: UserModel) { }

  ngOnInit(): void { }
}
