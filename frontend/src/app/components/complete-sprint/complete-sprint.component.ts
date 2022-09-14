import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SprintModel } from 'src/core/models/sprint/sprint-model';
import { CompleteSprintDialogComponent } from './complete-sprint-dialog/complete-sprint-dialog.component';

@Component({
  selector: 'app-complete-sprint',
  templateUrl: './complete-sprint.component.html',
  styleUrls: ['./complete-sprint.component.sass'],
})
export class CompleteSprintComponent implements OnInit {
  @Input() public completeBthClass = 'fill gray';
  @Input() public completeBtnText = 'Start sprint';
  @Input() public sprint: SprintModel;

  constructor(public matDialog: MatDialog) {}

  ngOnInit(): void {}

  openCompSprintDialog(): void {
    const dialog = this.matDialog.open(CompleteSprintDialogComponent, {
      data: this.sprint,
    });
    dialog.afterClosed().subscribe();
  }
}
