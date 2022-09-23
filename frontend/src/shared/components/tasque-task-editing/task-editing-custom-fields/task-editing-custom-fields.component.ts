import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { TaskCustomField } from 'src/core/models/task/task-template-models/task-custom-field';
import { UserModel } from 'src/core/models/user/user-model';
import { EditorConfig } from 'src/core/settings/angular-editor-setting';
import { TaskCustomFieldModel } from 'src/core/models/task/task-creation-models/task-custom-field-model';
import { FormControl } from '@angular/forms';
import { TasqueDropdownOption } from '../../tasque-dropdown/dropdown.component';
import { TaskFieldType } from 'src/core/models/task/task-field-types';
import { CheckboxField } from 'src/core/models/task/task-template-models/checkbox-field';
import { DropdownField } from 'src/core/models/task/task-template-models/dropdown-field';

@Component({
  selector: 'app-task-editing-custom-fields',
  templateUrl: './task-editing-custom-fields.component.html',
  styleUrls: ['./task-editing-custom-fields.component.sass']
})
export class TaskEditingCustomFieldsComponent implements OnInit, OnChanges {

  constructor() { }

  public taskCustomFieldControl: FormControl;

  @Input() public customField: TaskCustomField;
  @Input() public projectUsers: UserModel[];

  @Input() public currentTaskCustomField?: TaskCustomFieldModel;

  @Output() taskCustomFieldChange = new EventEmitter<TaskCustomFieldModel>();

  public newTaskCustomField: TaskCustomFieldModel;

  public editorConfig = EditorConfig;

  public dropdownField: DropdownField;
  public checkboxFields: CheckboxField[];
  public labelOptions: TasqueDropdownOption[] = [];

  public dropdownValue: string;

  ngOnChanges(): void {
    this.taskCustomFieldControl.setValue(this.currentTaskCustomField?.fieldValue, {
      emitEvent: false
    });
  }

  ngOnInit(): void {
    this.taskCustomFieldControl = new FormControl(this.currentTaskCustomField);
    this.newTaskCustomField = {
      fieldId: this.customField.fieldId as string,
    };

    switch (this.customField.type) {
      case TaskFieldType.Dropdown:
        this.dropdownField = this.customField.dropdown as DropdownField;
        break;
      case TaskFieldType.Label:
        this.initLabels();
        break;
      case TaskFieldType.CheckBox:
        this.checkboxFields = this.customField.checkboxes as CheckboxField[];
        break;
    }

    this.taskCustomFieldControl.valueChanges.subscribe((value) => {
      this.taskCustomFieldChange.emit({
        fieldId: this.customField.fieldId as string,
        type: this.customField.type,
        fieldValue: value
      });
    });
  }

  initLabels(): void {
    let index = 0;
    this.customField.labels?.forEach((l) => this.labelOptions.push({
      color: l.color,
      title: l.name,
      id: index++,
    }));
  }

  setSelectedUser(value: UserModel): void {
    this.taskCustomFieldControl.setValue(JSON.stringify(value));
  }

  setDropdownValue(value: string): void {
    this.taskCustomFieldControl.setValue(value);
    this.dropdownValue = value;
  }

  setCheckboxChanged(val: boolean, field: CheckboxField): void {
    field.isChecked = val;
    const isExist = this.checkboxFields.find((f) => f.checkboxName === field.checkboxName);
    if (isExist === undefined) {
      this.checkboxFields.push(field);
    } else {
      this.checkboxFields.forEach((f) => {
        if (f.checkboxName === field.checkboxName) {
          f.isChecked = field.isChecked;
        }
      });
    }
    this.taskCustomFieldControl.setValue(JSON.stringify(this.checkboxFields));
  }
}
