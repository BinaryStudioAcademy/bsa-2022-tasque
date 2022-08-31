import { Component, Input, OnInit } from '@angular/core';
import { TaskModel } from 'src/core/models/task/task-model';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.sass'],
})
export class IssueComponent implements OnInit {
  @Input() public issue: TaskModel;

  constructor() {}

  ngOnInit(): void {}
}
