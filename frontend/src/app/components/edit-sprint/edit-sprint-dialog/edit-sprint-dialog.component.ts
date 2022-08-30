import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { EditSprintModel } from 'src/core/models/sprint/edit-sprint-model';
import { TasqueDropdownOption } from 'src/shared/components/tasque-dropdown/dropdown.component';
import * as moment from 'moment'; 

@Component({
  selector: 'app-edit-sprint-dialog',
  templateUrl: './edit-sprint-dialog.component.html',
  styleUrls: ['./edit-sprint-dialog.component.sass']
})
export class EditSprintDialogComponent implements OnInit {

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

  public duration: TasqueDropdownOption;

  public periods: TasqueDropdownOption[] = [
    { color: '#0000', title: 'Custom', id: 0 },
    { color: '#0000', title: 'One Week', id: 1 },
    { color: '#0000', title: 'Two Weeks', id: 2 },
    { color: '#0000', title: 'Four Weeks', id: 4 },
  ];

  public unsubscribe$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EditSprintModel
  ) {
    if (data.isStarting) {
      this.data.startAt = moment(new Date()).format('YYYY-MM-DDTHH:mm');
      this.data.endAt = this.addDays(this.data.startAt, 7);
    }
    this.sprintName = new FormControl(this.data.name, [
      Validators.required,
      Validators.minLength(4),
    ]);
    this.sprintDuration = new FormControl(this.periods[0], [ ]);
    this.sprintStartAt = new FormControl(this.data.startAt, [ ]);
    this.sprintEndAt = new FormControl(this.data.endAt, [ ]);
    this.sprintDescription = new FormControl(this.data.description, [ ]);
    if (data.isStarting) {
      this.sprintStartAt.addValidators(Validators.required);
      this.sprintEndAt.addValidators(Validators.required);
    }
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
        const value: number = this.sprintForm.controls.sprintDuration.value.id;
        if (value > 0 && this.data.startAt) {
          this.data.endAt = this.addDays(this.data.startAt, 7 * value);
        }        
      });
  }

  onSubmit(): void{
    
  }
  
  private addDays(stringDate: string, days: number): string{
    const date = this.dateFromStr(stringDate);
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 16);
  }

  private dateFromStr(str: string): Date {
    const d = new Date(str);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset());
  }
  
}
