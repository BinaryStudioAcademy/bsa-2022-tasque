import { Component, Input, OnInit } from '@angular/core';
import { faFloppyDisk as faSend}  from '@fortawesome/free-solid-svg-icons';
import { UserModel } from 'src/core/models/user/user-model';
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
  constructor(private currentUserService: GetCurrentUserService,) { }

  ngOnInit(): void {
    this.currentUserService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

}
