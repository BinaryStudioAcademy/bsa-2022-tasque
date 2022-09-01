import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CompleteSprintDialogComponent } from './complete-sprint-dialog/complete-sprint-dialog.component';

@Component({
  selector: 'app-complete-sprint',
  templateUrl: './complete-sprint.component.html',
  styleUrls: ['./complete-sprint.component.sass']
})
export class CompleteSprintComponent implements OnInit {

  public completeBthClass = 'fill gray';

  constructor(public matDialog: MatDialog) { }

  ngOnInit(): void {
  }

  openCompSprintDialog(): void {
    const dialog = this.matDialog.open(CompleteSprintDialogComponent);
    dialog.afterClosed().subscribe(); 
  }
}
