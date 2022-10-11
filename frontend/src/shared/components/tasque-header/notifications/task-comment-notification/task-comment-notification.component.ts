import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommentInfo } from 'src/core/models/comment/comment-info';
import { Notification } from 'src/core/models/notifications/notification';
import { TaskCommentedNotification } from 'src/core/models/notifications/task-commented-notification';
import { TaskModel } from 'src/core/models/task/task-model';
import { UserModel } from 'src/core/models/user/user-model';
import { CommentService } from 'src/core/services/comment.service';
import { TaskService } from 'src/core/services/task.service';

@Component({
  selector: 'task-comment-notification',
  templateUrl: './task-comment-notification.component.html',
  styleUrls: ['./task-comment-notification.component.sass']
})
export class TaskCommentNotificationComponent implements OnInit {

  @Input() notification: TaskCommentedNotification;
  @Output() deleteNotification = new EventEmitter<Notification>();
  commentBy: UserModel;
  task: TaskModel;
  comment: CommentInfo;
  ref = '';
  display = false;

  constructor(
    private commentService: CommentService,
    private taskService: TaskService,
  ) { }

  ngOnInit(): void {
    this.commentService.getCommentById(this.notification.commentId).subscribe((resp) => {
      this.comment = resp.body as CommentInfo;
      this.commentBy = this.comment.author;

      this.taskService.getTaskById(this.comment.taskId).subscribe((resp) => {
        this.task = resp.body as TaskModel;
        this.getTaskRef();
        this.display = true;
      });
    });
  }

  onDelete(): void {
    this.deleteNotification.emit(this.notification);
  }

  getTaskRef(): void {
    this.ref = `project/${this.task.projectId}/task/${this.task.id}`; //TODO: Implement ability to open task-card by link and redirect to it
  }

}
