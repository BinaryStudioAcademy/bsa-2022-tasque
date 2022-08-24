import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  public requiredErrorMessage = 'This field is required.';

  public sprintForm: FormGroup = new FormGroup({});
  public sprintName: FormControl;
  public sprintDuration: FormControl;
  public sprintStartAt: FormControl;
  public sprintEndAt: FormControl;
  public sprintDescription: FormControl;

  public duration: [color: string, title: string, id: number];

  public periods: [color: string, title: string, id: number][] = [
    ['#0000', 'Custom', 0],
    ['#0000', 'One Week', 1],
    ['#0000', 'Two weeks', 2],
    ['#0000', 'Four weeks', 4],
  ];

  public unsubscribe$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: NewSprintModel
  ) {
    this.sprintName = new FormControl(this.data.name, [
      Validators.required,
      Validators.minLength(4),
    ]);
    this.sprintDuration = new FormControl(this.periods[0], [ 
      Validators.required
    ]);
    this.sprintStartAt = new FormControl(this.data.startAt, [
      Validators.required,
    ]);
    this.sprintEndAt = new FormControl(this.data.endAt, [
      Validators.required,
    ]);
    this.sprintDescription = new FormControl(this.data.description, [ ]);
   }

  ngOnInit(): void {
    this.sprintForm = new FormGroup({
      sprintName: this.sprintName,
      sprintDuration: this.sprintDuration,
      sprintStartAt: this.sprintStartAt,
      sprintEndAt: this.sprintEndAt,
      sprintDescription: this.sprintDescription
    });    

    this.sprintForm.controls.sprintDuration.valueChanges.subscribe(
      () => {
        const value: number = this.sprintForm.controls.sprintDuration.value[2];
        if (value > 0) {
          this.data.endAt = this.addDays(this.data.startAt, 7 * value);
        }        
      });
  }

  onSubmit(): void{
    
  }
  
  addDays(stringDate: string, days: number): string{
    const date = new Date(stringDate);
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 16);
  }
  
}
