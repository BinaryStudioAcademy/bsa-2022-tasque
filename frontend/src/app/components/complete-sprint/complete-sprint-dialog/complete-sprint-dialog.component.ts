import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SprintModel } from 'src/core/models/sprint/sprint-model';
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
  ) {}

  ngOnInit(): void {
    this.openIssue();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.sprintService.completeSprint(this.sprint.id).subscribe();
    this.dialogRef.close();
  }

  openIssue(): number {
    return this.sprint.tasks.filter((t) => t.stateId == 1 || t.stateId == 3)
      .length;
  }

  complatedIssues(): number {
    return this.sprint.tasks.filter((t) => t.stateId == 2 || t.stateId == 4)
      .length;
  }
}
