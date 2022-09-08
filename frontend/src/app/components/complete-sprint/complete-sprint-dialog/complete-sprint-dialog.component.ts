import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SprintModel } from 'src/core/models/sprint/sprint-model';
import { BacklogService } from 'src/core/services/backlog.service';
import { SprintService } from 'src/core/services/sprint.service';

@Component({
  selector: 'app-complete-sprint-dialog',
  templateUrl: './complete-sprint-dialog.component.html',
  styleUrls: ['./complete-sprint-dialog.component.sass'],
})
export class CompleteSprintDialogComponent implements OnInit {
  //Information about the current sprint

  public finishBtnName = 'Complete sprint';
  public createBtnClass = 'fill';
  public cancelBtnName = 'Cancel';
  public cancelBtnClass = 'fill gray';

  constructor(
    @Inject(MAT_DIALOG_DATA) public sprint: SprintModel,
    private dialogRef: MatDialogRef<CompleteSprintDialogComponent>,
    public sprintService: SprintService,
    public backlogService: BacklogService,
  ) {}

  ngOnInit(): void {
    this.openIssue();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.sprintService.completeSprint(this.sprint.id).subscribe(() => {
      this.changeOutside();
    });
    this.dialogRef.close();
  }

  changeOutside(): void {
    this.backlogService.changeBacklog();
    this.sprintService.changeDeleteSprint(this.sprint.id);
  }

  openIssue(): number {
    return this.sprint.tasks.filter((t) => t.stateId == 1 || t.stateId == 2)
      .length;
  }

  completedIssues(): number {
    return this.sprint.tasks.filter((t) => t.stateId == 3 || t.stateId == 4)
      .length;
  }
}
