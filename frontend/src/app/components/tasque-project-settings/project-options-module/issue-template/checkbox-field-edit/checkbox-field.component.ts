import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TaskCustomField } from 'src/core/models/task/task-custom-field';
import { faCheck, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormControl, Validators } from '@angular/forms';
import { NotificationService } from 'src/core/services/notification.service';

@Component({
  selector: 'app-checkbox-field',
  templateUrl: './checkbox-field.component.html',
  styleUrls: ['./checkbox-field.component.sass']
})
export class CheckboxFieldComponent implements OnInit {

  @Input() field: TaskCustomField;
  public fields: string[];

  @Output() closeEdit = new EventEmitter<boolean>();

  isChanging = false;
  newField: string;

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
    this.fields = this.field?.checkbox?.checkList as string[];
    if(this.fields === undefined || this.fields === null || this.fields.length === 0) {
      this.fields = [];
    }
    console.log(this.field.checkbox?.checkList);
  }

  public deleteField(val:string): void {
    this.field.checkbox?.checkList?.forEach((value,index)=>{
      if(value==val) this.field.checkbox?.checkList?.splice(index,1);
  });
  }

  public saveField(): void {
    if(!this.formControl.valid){
      this.notify.error(this.errorMessage);
      return;
    }
    if(this.field.checkbox === undefined || this.field.checkbox === null || this.field.checkbox?.checkList === undefined) {
      this.field.checkbox = {
        checkList: this.fields
      };
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
    this.newField = val;
  }
}

