import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { EditSprintModel } from 'src/core/models/sprint/edit-sprint-model';
import { TasqueDropdownOption } from 'src/shared/components/tasque-dropdown/dropdown.component';
import * as moment from 'moment';
import { SprintService } from 'src/core/services/sprint.service';
import { ToastrNotificationService } from 'src/core/services/toastr-notification.service';

@Component({
  selector: 'app-edit-sprint-dialog',
  templateUrl: './edit-sprint-dialog.component.html',
  styleUrls: ['./edit-sprint-dialog.component.sass'],
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
    { title: 'Custom', id: 0 },
    { title: 'One Week', id: 1 },
    { title: 'Two Weeks', id: 2 },
    { title: 'Four Weeks', id: 4 },
  ];

  public unsubscribe$ = new Subject<void>();
  public period = 0;
  public isSave = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public sprint: EditSprintModel,
    private sprintService: SprintService,
    private notificationService: ToastrNotificationService,
  ) {
    if (sprint.isStarting) {
      this.sprint.startAt = moment(new Date()).format('YYYY-MM-DDTHH:mm');
      this.sprint.endAt = this.addDays(this.sprint?.startAt, 7);
    }
    this.sprintName = new FormControl(this.sprint.name, [
      Validators.required,
      Validators.minLength(4),
    ]);
    this.sprintDuration = new FormControl(this.periods[0], []);
    this.sprintStartAt = new FormControl(this.sprint.startAt, []);
    this.sprintEndAt = new FormControl(this.sprint.endAt, []);
    this.sprintDescription = new FormControl(this.sprint.description, []);
    if (sprint.isStarting) {
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
      sprintDescription: this.sprintDescription,
    });

    this.sprintForm.controls.sprintDuration.valueChanges.subscribe((value) => {
      if (value > 0 && this.sprint.startAt) {
        this.sprint.endAt = this.addDays(this.sprint.startAt, 7 * value);
      }
    });
  }

  onSubmit(): void {
    if(this.sprint.startAt === '') {
      this.sprint.startAt = undefined;
    }
    
    this.sprintService.editSprint(this.sprint.id, this.sprint).subscribe(
      (resp) => {
        if (resp.ok && resp.body != null) {
          this.sprint.name = resp.body.name;
          this.isSave = true;

          this.notificationService.success(`Sprint ${this.sprint.name} was successfully changed`);
        } else {
          this.notificationService.error('Something went wrong');
        }
      },
      (error) => {
        this.notificationService.error(error.error);
      },
    );
  }

  private addDays(stringDate: string, days: number): string {
    const date = this.dateFromStr(stringDate);
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 16);
  }

  private dateFromStr(str: string): Date {
    const d = new Date(str);
    return new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes() - d.getTimezoneOffset(),
    );
  }

  selectPeriod(event: number): void {
    this.period = event;

    const date = new Date();

    if (this.sprint.startAt) {
      this.sprint.endAt = this.addDays(this.sprint.startAt, 7 * 12);
    }
    switch (event) {
      case 1:
        if (this.sprint.startAt) {
          this.sprint.endAt = this.addDays(date.toString(), 7);
        }
        break;
      case 2:
        if (this.sprint.startAt) {
          this.sprint.endAt = this.addDays(date.toString(), 14);
        }
        break;
      case 4:
        if (this.sprint.startAt) {
          this.sprint.endAt = this.addDays(date.toString(), 28);
        }
        break;
      default:
    }
  }
}
