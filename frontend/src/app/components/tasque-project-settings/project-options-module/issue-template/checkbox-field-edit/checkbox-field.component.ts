import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TaskCustomField } from 'src/core/models/task/task-template-models/task-custom-field';
import { faCheck, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormControl, Validators } from '@angular/forms';
import { NotificationService } from 'src/core/services/notification.service';
import { CheckboxField } from 'src/core/models/task/task-template-models/checkbox-field';

@Component({
  selector: 'app-checkbox-field',
  templateUrl: './checkbox-field.component.html',
  styleUrls: ['./checkbox-field.component.sass']
})
export class CheckboxFieldComponent implements OnInit {

  @Input() field: TaskCustomField;
  public fields: CheckboxField[];

  @Output() closeEdit = new EventEmitter<boolean>();

  isChanging = false;
  newField: CheckboxField;

  faCheck = faCheck;
  faMinus = faMinus;
  faPlus = faPlus;

  formControl: FormControl;

  get errorMessage(): string {
    if(this.formControl.errors?.['regiured']) {
      return 'Field name is required';
    }
    if(this.formControl.errors?.['minlength']) {
      return 'Minimum field name should contain 2 characters';
    }
    return 'Cannot save empty data';
  }

  constructor(
    private notify: NotificationService, 
  ) { 
    this.formControl = new FormControl(this.newField, [
      Validators.required,
      Validators.minLength(2),
    ]);
  }

  ngOnInit(): void {
    this.fields = this.field?.checkboxes as CheckboxField[];
    if(this.fields === undefined || this.fields === null) {
      this.fields = [];
    }
  }

  public deleteField(val:CheckboxField): void {
    this.field.checkboxes?.forEach((value,index)=> {
      if(value.checkboxName === val.checkboxName) this.field.checkboxes?.splice(index,1);
  });
  }

  public saveField(): void {
    if(!this.formControl.valid){
      this.notify.error(this.errorMessage);
      return;
    }
    if(this.field.checkboxes === undefined || this.field.checkboxes === null) {
      this.field.checkboxes = this.fields;
    }
    this.fields.push(this.newField);
    this.isChanging = false;
  }

  public addField(): void {
    this.isChanging = !this.isChanging;
  }

  public finishEdit(): void {
    this.closeEdit.emit(false);
  }

  setValue(val:string): void {
    this.newField = {
      checkboxName: val,
      isChecked: false,
    };
  }
}

