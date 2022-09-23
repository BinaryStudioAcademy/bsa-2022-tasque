import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SprintModel } from 'src/core/models/sprint/sprint-model';
import { BacklogService } from 'src/core/services/backlog.service';
import { ToastrNotificationService } from 'src/core/services/toastr-notification.service';
import { SprintService } from 'src/core/services/sprint.service';

@Component({
  selector: 'app-delete-sprint-dialog',
  templateUrl: './delete-sprint-dialog.component.html',
  styleUrls: ['./delete-sprint-dialog.component.sass'],
})
export class DeleteSprintDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public sprint: SprintModel,
    private dialogRef: MatDialogRef<DeleteSprintDialogComponent>,
    private sprintService: SprintService,
    private notificationService: ToastrNotificationService,
    private backlogService: BacklogService,
  ) {}

  ngOnInit(): void {}

  deleteSprint(): void {
    this.sprintService.delete(this.sprint.id).subscribe(
      (resp) => {
        if (resp.status == 204) {
          this.dialogRef.close();
          this.notificationService.success('Sprint has been removed');
          this.backlogService.changeBacklog();
          this.sprintService.changeDeleteSprint(this.sprint.id);
        } else {
          //TODO
          console.warn('Something went wrong');
          // this.notificationService.error('Something went wrong');
        }
      },
      (error) => {
        //TODO
        console.warn(error);
        //this.notificationService.error(error);
      },
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
