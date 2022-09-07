import { Component, OnInit, Input } from '@angular/core';
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
  editorConfig = EditorConfig;
  public editorContent = '';
  
  ngOnInit(): void {
    this.fieldType = this.customField.type;
    console.log(this.fieldType);
  }
  
}
