import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { LabelField } from 'src/core/models/task/label-field';
import { TaskCustomField } from 'src/core/models/task/task-custom-field';
import { faCheck, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormControl, Validators } from '@angular/forms';
import { NotificationService } from 'src/core/services/notification.service';

@Component({
  selector: 'app-label-field-edit',
  templateUrl: './label-field-edit.component.html',
  styleUrls: ['./label-field-edit.component.sass']
})
export class LabelFieldEditComponent implements OnInit {

  constructor(
    private notify: NotificationService,
  ) { }

  @Input() field: TaskCustomField;
  @Output() closeEdit = new EventEmitter<boolean>();
  public labels: LabelField[];

  faCheck = faCheck;
  faMinus = faMinus;
  faPlus = faPlus;

  formNameControl: FormControl;
  formColorControl: FormControl;

  isChanging = false;
  newField: LabelField = { name: '' };

  get errorMessage(): string {
    if(this.formNameControl.errors?.['required']) {
      return 'All fields are required';
    }
    if(this.formNameControl.errors?.['minlength']) {
      return 'Minimum label name should contain 2 characters';
    }
    return '';
  }

  ngOnInit(): void {
    this.labels = this.field?.labels as LabelField[];

    this.formNameControl = new FormControl(this.newField.name, [
      Validators.required,
      Validators.minLength(2),
    ]);

    this.formColorControl = new FormControl(this.newField.color, [
      Validators.required,
    ]);
  }

  public deleteLabel(val: LabelField): void  {
    this.labels.forEach((value,index)=>{
        if(value==val) this.labels.splice(index,1);
    });
  }

  public addLabel(): void {
    this.isChanging = ! this.isChanging;
  }

  public saveLabel():void {
    if(!this.formNameControl.valid || !this.formColorControl.valid) {
      this.notify.error(this.errorMessage);
      return;
    }
    this.labels.push(this.newField);
    this.isChanging = false;
  }

  public finishEdit(): void {
    this.closeEdit.emit(false);
  }

  setValue(val: string, type: string): void {
    if(type === 'name'){
      this.newField.name = val;
    } else {
      this.newField.color = val;
    }
  }
}
