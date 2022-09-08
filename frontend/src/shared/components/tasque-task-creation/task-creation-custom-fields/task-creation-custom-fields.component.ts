import { Component, OnInit, Input } from '@angular/core';
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
  public fieldType: TaskFieldType;
  public dropdownField: DropdownField;
  public checkboxField: CheckboxField;
  public dropdownOptions: TasqueDropdownOption[] = [];
  public labelField: LabelField[];
  public textValue: string;
  public dropdownValue: string = '';
  public editorConfig = EditorConfig;
  public editorContent = '';
  public checkboxValue: boolean;
  public selectedUser: UserModel;
  public labelOptions: TasqueDropdownOption[] = [];

  
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
      this.checkboxField = this.customField.checkbox as CheckboxField;
    }
    console.log(this.customField);
  }

  selectDropdownValue(value: string): void {
    this.dropdownValue = value;
  }

  selectLabelValue(label: LabelField): void {
    console.log(label);
  }

  setCheckboxChanged(val: boolean): void {
    this.checkboxValue = val;
    console.log(val + ' ' + this.checkboxField.checkList);
  }
  
  setSelectedLabel(val: number) {
    console.log(val);
  }

  setLabelOptions(): void {
    let index = 0;
    this.labelField.forEach((l) => this.labelOptions.push({
      color: l.color,
      title: l.name,
      id: index,
    }), index++);
  }

}
