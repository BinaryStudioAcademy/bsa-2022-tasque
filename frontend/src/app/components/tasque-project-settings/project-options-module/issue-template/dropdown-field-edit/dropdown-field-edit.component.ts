import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TaskCustomField } from 'src/core/models/task/task-template-models/task-custom-field';
import { faCheck, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormControl, Validators } from '@angular/forms';
import { ToastrNotificationService } from 'src/core/services/toastr-notification.service';

@Component({
  selector: 'app-dropdown-field-edit',
  templateUrl: './dropdown-field-edit.component.html',
  styleUrls: ['./dropdown-field-edit.component.sass']
})
export class DropdownFieldEditComponent implements OnInit {

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
    private notify: ToastrNotificationService, 
  ) { 
    this.formControl = new FormControl(this.newField, [
      Validators.required,
      Validators.minLength(2),
    ]);
  }

  ngOnInit(): void {
    this.fields = this.field?.dropdown?.fields as string[];
    if(this.fields === undefined || this.fields.length === 0) {
      this.fields = [];
    }
  }

  public deleteField(val:string): void {
    this.field.dropdown?.fields.forEach((value,index)=>{
      if(value==val) this.field.dropdown?.fields.splice(index,1);
  });
  }

  public saveField(): void {
    if(!this.formControl.valid){
      this.notify.error(this.errorMessage);
      return;
    }
    if(this.field.dropdown === undefined || this.field.dropdown?.fields === undefined) {
      this.field.dropdown = {
        fields: this.fields
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

