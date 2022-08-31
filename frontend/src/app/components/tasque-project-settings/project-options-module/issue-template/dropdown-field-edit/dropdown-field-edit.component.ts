import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TaskCustomField } from 'src/core/models/task/task-custom-field';
import { faCheck, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

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

  constructor() { }

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
    this.fields.push(this.newField);
    this.isChanging = false;
    if(this.field.dropdown === undefined || this.field.dropdown?.fields === undefined) {
      this.field.dropdown = {
        fields: this.fields
      };
    }
  }

  public addField(): void {
    this.isChanging = !this.isChanging;
  }

  public finishEdit(): void {
    this.closeEdit.emit(false);
  }
}
