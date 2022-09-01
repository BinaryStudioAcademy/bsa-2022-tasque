import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SprintInfo } from 'src/core/models/sprint/sprint-info';
import { SprintService } from 'src/core/services/sprint.service';

@Component({
  selector: 'app-complete-sprint-dialog',
  templateUrl: './complete-sprint-dialog.component.html',
  styleUrls: ['./complete-sprint-dialog.component.sass']
})
export class CompleteSprintDialogComponent implements OnInit {

  public sprint: SprintInfo = {id: 1, name: 'Prol', complatedIssues: 42, openIssue: 3}

  public finishBtnName = 'Complate sprint';
  public createBtnClass = 'fill';
  public cancelBtnName = 'Cancel';
  public cancelBtnClass = 'fill gray';

  constructor(private dialogRef: MatDialogRef<CompleteSprintDialogComponent>, 
    public sprintService: SprintService) { }

  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.sprintService.completeSprint(this.sprint.id).subscribe();
  }
}
