import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/user/services/user.service';
import { TaskModel } from 'src/core/models/task/task-model';
import { UserModel } from 'src/core/models/user/user-model';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.sass'],
})
export class IssueComponent implements OnInit {
  @Input() public issue: TaskModel;
  public issueAuthor: UserModel;
  public unsubscribe$ = new Subject<void>();

  constructor(public userServise: UserService) {
    //this.issueAuthor.avatar
  }

  ngOnInit(): void {
    this.getIssueAuthor();
  }

  public getIssueAuthor(): void {
    this.userServise
      .getUserById(this.issue.authorId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result.body) {
          this.issueAuthor = result.body;
          console.log(result.body);
          //  if (this.issueAuthor.avatar == undefined) {
          // this.issueAuthor.avatar = '\\assets\\avatar.png';
          // }
        }
      });
  }
}
