import { Component, Input, OnInit } from '@angular/core';
import { TaskInfoModel } from 'src/core/models/board/task-Info-model';

@Component({
  selector: 'tasque-card',
  templateUrl: './tasque-card.component.html',
  styleUrls: ['./tasque-card.component.sass']
})
export class TasqueCardComponent implements OnInit {

  //Gets information about the task
  @Input() taskInfo: TaskInfoModel; 

  constructor() { }

  ngOnInit() {
  }

}
