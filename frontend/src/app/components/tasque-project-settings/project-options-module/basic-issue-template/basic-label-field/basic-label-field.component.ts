import { Component, Input, OnInit } from '@angular/core';
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

  constructor() { }

  ngOnInit(): void {
  }

}
