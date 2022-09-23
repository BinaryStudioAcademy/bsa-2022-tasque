import { Component, Input, OnInit } from '@angular/core';
import { faLocationArrow as faSend }  from '@fortawesome/free-solid-svg-icons';
import { CommentInfo } from 'src/core/models/comment/comment-info';
import { CreateComment } from 'src/core/models/comment/create-comment';
import { UserModel } from 'src/core/models/user/user-model';
import { CommentService } from 'src/core/services/comment.service';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';
import { ToastrNotificationService } from 'src/core/services/toastr-notification.service';
import { InputComponent } from '../tasque-input/input.component';

@Component({
  selector: 'tasque-comments',
  templateUrl: './tasque-comments.component.html',
  styleUrls: ['./tasque-comments.component.sass']
})
export class TasqueCommentsComponent implements OnInit {

  @Input() public currentUser: UserModel;
  @Input() public taskId: number;
  public sendIcon = faSend;

  public comments: CommentInfo[];

  constructor(
    private currentUserService: GetCurrentUserService,
    private commentService: CommentService,
    private notificationService: ToastrNotificationService,
    ) { }

  ngOnInit(): void {
    this.currentUserService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    this.commentService.getCommentsByTaskId(this.taskId)
      .subscribe(
        (resp) => {
          if(resp.ok) {
            this.comments = resp.body as CommentInfo[];
          }
        }
          
      );
  }

  sendComment(messageInput: InputComponent): void {
    if(!messageInput.inputValue) {
      this.notificationService.error('Comment cannot be empty!');
      return;
    }
    const comment = {
      taskId: this.taskId,
      message: messageInput.inputValue,
      authorId: this.currentUser.id
    } as CreateComment;

    this.commentService.addComment(comment).subscribe(
      (resp) => {
        if(resp.ok) {
          this.comments.unshift(resp.body as CommentInfo);
          messageInput.writeValue('');
        }
        else {
          this.notificationService.error('Comment has not been added!');
        }
      }
    );
  } 

}
