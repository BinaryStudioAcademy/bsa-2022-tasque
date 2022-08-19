import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskModel } from 'src/core/models/task/task-model';
import { UserModel } from 'src/core/models/user/user-model';
import { faCheckToSlot, faXmark, faLink, faPaperclip, faShareNodes, faEllipsisVertical, faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { BaseComponent } from 'src/core/base/base.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormControl, FormGroup } from '@angular/forms';
import { TaskState } from 'src/core/models/enums/task-state';
import { TaskPriority } from 'src/core/models/enums/task-priority';

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
  public closeIcon = faXmark;
  public linkIcon = faLink;
  public checkIcon = faCheckToSlot;
  public shareIcon = faShareNodes;
  public paperClipIcon = faPaperclip;
  public ellipsisIcon = faEllipsisVertical;
  public faceSmileIcon = faFaceSmile;
  public taskStatusOptions: [color: string, title: string, id: number][] = [
    ['white', 'To Do', TaskState.Todo],
    ['yellow', 'In Progress', TaskState.InProgress],
    ['green', 'Done', TaskState.Done],
    ['red', 'Canceled', TaskState.Done],
  ];
  public taskPriorityOptions: [color: string, title: string, id: number][] = [
    ['green', 'Low', TaskPriority.Low],
    ['yellow', 'Medium', TaskPriority.Medium],
    ['orange', 'High', TaskPriority.High],
  ];

  public projectOptions: [color: string, title: string, id: number][] = [
    ['white', '-', 0],
    ['red', 'Project 1', 1],
    ['yellow', 'Project 2', 2]
  ];
  public taskSprintOptions: [color: string, title: string, id: number][] = [
    ['white', '-', 0],
    ['red', 'Sprint 1', 1],
    ['yellow', 'Sprint 2', 2]
  ];

  public editTaskForm = new FormGroup({
    taskProject: new FormControl(''),
    taskSummary: new FormControl(''),
    taskStatus: new FormControl(''),
    taskPriority: new FormControl(''),
    taskSprint: new FormControl(''),
    taskDescription: new FormControl(''),
  });

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '0',
    minHeight: '35px',
    maxHeight: '150px',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'subscript',
        'superscript',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'indent',
        'outdent',
        'heading',
        'fontName',
        'backgroundColor',
        'customClasses',
        'insertImage',
        'insertVideo',
        'toggleEditorMode'
      ]
    ]
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: EditTaskDialogData) {
    super();
    this.task = data.task;
    this.currentUser = data.currentUser;
  }

  ngOnInit(): void {
    this.editTaskForm.value.taskProject = this.task.projectId.toString();
    this.editTaskForm.value.taskStatus = this.task.taskState.toString();
    this.editTaskForm.value.taskPriority = this.task.taskPriority.toString();
    this.editTaskForm.value.taskSprint = this.task.sprintId.toString();
    this.editTaskForm.value.taskSummary = this.task.summary;
  }

  spanClick(): void {
    this.editorDescriptionItemClass = 'invisible';
    this.editorDescriptionClass = '';
  }
}
