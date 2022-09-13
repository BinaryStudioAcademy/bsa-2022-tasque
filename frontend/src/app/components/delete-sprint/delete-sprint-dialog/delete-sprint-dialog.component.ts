import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SprintModel } from 'src/core/models/sprint/sprint-model';
import { NotificationService } from 'src/core/services/notification.service';
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
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {}

  deleteSprint(): void {
    this.sprintService.delete(this.sprint.id).subscribe(
      (resp) => {
        if (resp.ok && resp.body != null) {
          this.notificationService.success('Sprint was successfully changed');
        } else {
          this.notificationService.error('Something went wrong');
        }
      },
      (error) => {
        this.notificationService.error(error);
      },
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
