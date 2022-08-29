import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditSprintModel } from 'src/core/models/sprint/edit-sprint-model';
import { SprintModel } from 'src/core/models/sprint/sprint-model';
import { EditSprintDialogComponent } from './edit-sprint-dialog/edit-sprint-dialog.component';

@Component({
  selector: 'app-edit-sprint',
  templateUrl: './edit-sprint.component.html',
  styleUrls: ['./edit-sprint.component.sass']
})
export class EditSprintComponent implements OnInit {

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
    const editSprint = {
      name: this.currentSprint.name,
      description: this.currentSprint.description,
      startAt: this.currentSprint.startAt ? this.currentSprint.startAt.toISOString().slice(0, 16) : "",
      endAt: this.currentSprint.endAt ? this.currentSprint.endAt.toISOString().slice(0, 16) : "",
      projectId: this.currentSprint.projectId,
      isStarting: true
    } as EditSprintModel;
    const dialog = this.matDialog.open(EditSprintDialogComponent, { data: editSprint });
    dialog.afterClosed().subscribe();
  }

}
