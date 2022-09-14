import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { EditSprintModel } from 'src/core/models/sprint/edit-sprint-model';
import { SprintModel } from 'src/core/models/sprint/sprint-model';
import { EditSprintDialogComponent } from './edit-sprint-dialog/edit-sprint-dialog.component';

@Component({
  selector: 'app-edit-sprint',
  templateUrl: './edit-sprint.component.html',
  styleUrls: ['./edit-sprint.component.sass'],
})
export class EditSprintComponent implements OnInit {
  @Input() public currentSprint: SprintModel;

  public tasks: number[];

  @Input() public isStarting: boolean;

  @Input() public btnClass = 'btn mini voilet full';

  constructor(public matDialog: MatDialog) {}

  ngOnInit(): void {}

  openDialog(): void {
    const editSprint = {
      id: this.currentSprint.id,
      name: this.currentSprint.name,
      description: this.currentSprint.description,
      startAt: this.currentSprint.startAt
        ? moment(this.currentSprint.startAt).format('YYYY-MM-DDTHH:mm')
        : undefined,
      endAt: this.currentSprint.endAt
        ? moment(this.currentSprint.endAt).format('YYYY-MM-DDTHH:mm')
        : undefined,
      projectId: this.currentSprint.projectId,
      isStarting: this.isStarting,
      tasks: this.tasks,
    } as EditSprintModel;
    const dialog = this.matDialog.open(EditSprintDialogComponent, {
      data: editSprint,
    });

    dialog.afterClosed().subscribe((result: SprintModel) => {
      if (this.isStarting && result && result.startAt) {
        this.currentSprint.startAt = result.startAt;
        this.currentSprint.endAt = result.endAt;
      }
    });
  }
}
