import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SprintModel } from 'src/core/models/sprint/sprint-model';
import { DeleteSprintDialogComponent } from './delete-sprint-dialog/delete-sprint-dialog.component';

@Component({
  selector: 'app-delete-sprint',
  templateUrl: './delete-sprint.component.html',
  styleUrls: ['./delete-sprint.component.sass'],
})
export class DeleteSprintComponent implements OnInit {
  @Input() public sprint: SprintModel;

  constructor(public matDialog: MatDialog) {}

  ngOnInit(): void {}

  openDialog(): void {
    const dialog = this.matDialog.open(DeleteSprintDialogComponent, {
      data: this.sprint,
    });

    dialog.afterClosed().subscribe((result: SprintModel) => {});
  }
}
