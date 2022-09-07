import { Component, OnInit, Input } from '@angular/core';
import { DropdownField } from 'src/core/models/task/dropdown-field';
import { LabelField } from 'src/core/models/task/label-field';
import { TaskCustomField } from 'src/core/models/task/task-custom-field';
import { TaskFieldType } from 'src/core/models/task/task-field-types';
import { EditorConfig } from 'src/core/settings/angular-editor-setting';

@Component({
  selector: 'app-task-creation-custom-fields',
  templateUrl: './task-creation-custom-fields.component.html',
  styleUrls: ['./task-creation-custom-fields.component.sass']
})
export class TaskCreationCustomFieldsComponent implements OnInit {

  constructor() { }

  @Input() customField: TaskCustomField;
  public fieldType: TaskFieldType;
  public dropdownField: DropdownField;
  public labelField: LabelField[];
  
  ngOnInit(): void {
    this.fieldType = this.customField.type;
    if(this.fieldType === TaskFieldType.Dropdown) {
      this.dropdownField = this.customField.dropdown as DropdownField;
    }
    if(this.fieldType === TaskFieldType.Label) {
      this.labelField = this.customField.labels as LabelField[];
    }
    console.log(this.customField);
  }
  
}
