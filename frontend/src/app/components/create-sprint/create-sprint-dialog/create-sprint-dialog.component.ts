import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { NewSprintModel } from 'src/core/models/sprint/new-sprint-model';

@Component({
  selector: 'app-create-sprint-dialog',
  templateUrl: './create-sprint-dialog.component.html',
  styleUrls: ['./create-sprint-dialog.component.sass']
})
export class CreateSprintDialogComponent implements OnInit {

  public createBtnName = 'Start';
  public createBtnClass = 'fill';
  public cancelBtnName = 'Cancel';
  public cancelBtnClass = 'fill gray';
  public inputClass = 'input';

  public unsubscribe$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: NewSprintModel
  ) { }

  ngOnInit(): void {
    this.data.endAt = this.addDays(this.data.startAt, 7); //should be changed
  }

  onSubmit(): void{
    //console.log(this.data.description);
  }
  
  addDays(stringDate: string, days: number): string{
    let date = new Date(stringDate);
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 16);
  };
}
