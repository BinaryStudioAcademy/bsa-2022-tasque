import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SprintModel } from 'src/core/models/sprint/sprint-model';
import { CreateSprintDialogComponent } from './create-sprint-dialog/create-sprint-dialog.component';

@Component({
  selector: 'app-create-sprint',
  templateUrl: './create-sprint.component.html',
  styleUrls: ['./create-sprint.component.sass']
})
export class CreateSprintComponent implements OnInit {

  public currentSprint: SprintModel = {
    id: 1,
    name: 'PROJ Sprint 3',
    createdAt: new Date(2000, 1, 1),
    updatedAt: new Date(2001, 1, 1),
    startAt: new Date(),
    endAt: new Date(),
    projectId: 1
  };

  public btnText = 'Start sprint';
  public btnClass = 'btn mini';

  constructor(
    public matDialog: MatDialog,
  ) { }

  ngOnInit(): void {

  }

  openDialog(): void {
    const dialog = this.matDialog.open(CreateSprintDialogComponent, { data: this.currentSprint });
    dialog.afterClosed().subscribe();
  }

}
