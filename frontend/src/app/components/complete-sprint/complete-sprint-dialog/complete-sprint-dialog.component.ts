import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SprintModel } from 'src/core/models/sprint/sprint-model';
import { BacklogService } from 'src/core/services/backlog.service';
import { GetCurrentProjectService } from 'src/core/services/get-current-project.service';
import { SprintService } from 'src/core/services/sprint.service';

@Component({
  selector: 'app-complete-sprint-dialog',
  templateUrl: './complete-sprint-dialog.component.html',
  styleUrls: ['./complete-sprint-dialog.component.sass'],
})
export class CompleteSprintDialogComponent implements OnInit {

  public finishBtnName = 'Complete sprint';
  public createBtnClass = 'fill';
  public cancelBtnName = 'Cancel';
  public cancelBtnClass = 'fill gray';

  constructor(
    @Inject(MAT_DIALOG_DATA) public sprint: SprintModel,
    private router: Router,
    private dialogRef: MatDialogRef<CompleteSprintDialogComponent>,
    public sprintService: SprintService,
    public backlogService: BacklogService,
    private currentProjectService: GetCurrentProjectService
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
      this.currentProjectService.setLeftSidebar(true);
      this.router.navigate([`project/${this.sprint.projectId}/backlog`]);
    });
    this.dialogRef.close();
  }

  changeOutside(): void {
    this.backlogService.changeBacklog();
    this.sprintService.changeDeleteSprint(this.sprint.id);
  }

  openIssue(): number {
    return this.sprint.tasks.filter((t) => !t.state?.status).length;
  }

  completedIssues(): number {
    return this.sprint.tasks.filter((t) => t.state?.status).length;
  }
}
