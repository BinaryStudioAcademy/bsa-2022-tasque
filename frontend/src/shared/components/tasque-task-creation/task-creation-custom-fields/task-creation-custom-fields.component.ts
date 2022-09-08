import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CheckboxField } from 'src/core/models/task/checkbox-field';
import { DropdownField } from 'src/core/models/task/dropdown-field';
import { LabelField } from 'src/core/models/task/label-field';
import { TaskCustomField } from 'src/core/models/task/task-custom-field';
import { TaskFieldType } from 'src/core/models/task/task-field-types';
import { UserModel } from 'src/core/models/user/user-model';
import { EditorConfig } from 'src/core/settings/angular-editor-setting';
import { TasqueDropdownOption } from '../../tasque-dropdown/dropdown.component';

@Component({
  selector: 'app-task-creation-custom-fields',
  templateUrl: './task-creation-custom-fields.component.html',
  styleUrls: ['./task-creation-custom-fields.component.sass']
})
export class TaskCreationCustomFieldsComponent implements OnInit {

  constructor() { }

  @Input() customField: TaskCustomField;
  @Input() projectUsers: UserModel[];

  @Output() taskCustomField: EventEmitter<TaskCustomField>;

  public fieldType: TaskFieldType;

  public dropdownField: DropdownField;
  public checkboxFields: CheckboxField[];
  public labelField: LabelField[];

  public dropdownOptions: TasqueDropdownOption[] = [];
  public labelOptions: TasqueDropdownOption[] = [];

  public editorConfig = EditorConfig;
  public editorContent = '';

  public textValue: string;
  public dropdownValue: string;
  public labelValue: LabelField;
  public checkboxValue: boolean;
  public selectedUser: UserModel;
  
  ngOnInit(): void {
    this.fieldType = this.customField.type;
    if(this.fieldType === TaskFieldType.Dropdown) {
      this.dropdownField = this.customField.dropdown as DropdownField;
    }
    if(this.fieldType === TaskFieldType.Label) {
      this.labelField = this.customField.labels as LabelField[];
      this.setLabelOptions();
    }
    if(this.fieldType === TaskFieldType.CheckBox) {
      this.checkboxFields = this.customField.checkboxes as CheckboxField[];
    }
  }

  setDropdownValue(value: string): void {
    this.dropdownValue = value;
  }

  setCheckboxChanged(val: boolean, field: CheckboxField): void {
    field.isChecked = val;
  }
  
  setSelectedLabel(val: number): void {
    this.labelValue = this.labelField[val];
  }

  setLabelOptions(): void {
    let index = 0;
    this.labelField.forEach((l) => this.labelOptions.push({
      color: l.color,
      title: l.name,
      id: index++,
    }));
  }

  emitField(): void {
    this.taskCustomField.emit(this.customField);
  }
}
