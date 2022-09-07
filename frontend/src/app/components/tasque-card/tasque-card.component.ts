import { Component, Input, OnInit } from '@angular/core';
import { TaskInfoModel } from 'src/core/models/board/task-Info-model';
import { UserModel } from 'src/core/models/user/user-model';

@Component({
  selector: 'tasque-card',
  templateUrl: './tasque-card.component.html',
  styleUrls: ['./tasque-card.component.sass']
})
export class TasqueCardComponent implements OnInit {

  //Gets information about the task
  @Input() taskInfo: TaskInfoModel; 
  user: UserModel;

  constructor() { }

  ngOnInit(): void {
    this.user = this.taskInfo.user as UserModel;
  }

}
