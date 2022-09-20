import { Component, Input, OnInit } from '@angular/core';
import { faFloppyDisk as faSend}  from '@fortawesome/free-solid-svg-icons';
import { CommentInfo } from 'src/core/models/comment/comment-info';
import { UserModel } from 'src/core/models/user/user-model';
import { CommentService } from 'src/core/services/comment.service';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';

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
    ) { }

  ngOnInit(): void {
    this.currentUserService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    this.commentService.getCommentsByTaskId(this.taskId)
      .subscribe(
        (resp) => {
          if(resp) {
            this.comments = resp.body as CommentInfo[];
          }
        }
          
      );
  }

}
