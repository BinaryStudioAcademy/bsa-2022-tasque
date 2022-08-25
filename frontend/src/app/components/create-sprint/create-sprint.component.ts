import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewSprintModel } from 'src/core/models/sprint/new-sprint-model';
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
    endAt: new Date('2022-08-24T10:20'),
    projectId: 1,
    description: ''
  };

  public btnText = 'Start sprint';
  public btnClass = 'btn mini';

  constructor(
    public matDialog: MatDialog,
  ) { }

  ngOnInit(): void {

  }

  openDialog(): void {
    const newSprint = {
      name: this.currentSprint.name,
      description: this.currentSprint.description,
      startAt: this.currentSprint.startAt ? this.currentSprint.startAt.toISOString().slice(0, 16) : "",
      endAt: this.currentSprint.endAt ? this.currentSprint.endAt.toISOString().slice(0, 16) : "",
      projectId: this.currentSprint.projectId,
      isNew: true
    } as NewSprintModel;
    const dialog = this.matDialog.open(CreateSprintDialogComponent, { data: newSprint });
    dialog.afterClosed().subscribe();
  }

}
