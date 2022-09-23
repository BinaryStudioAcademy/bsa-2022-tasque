import { Component, OnInit, Input, HostListener, EventEmitter, Output } from '@angular/core';
import { CheckboxField } from 'src/core/models/task/task-template-models/checkbox-field';
import { DropdownField } from 'src/core/models/task/task-template-models/dropdown-field';
import { LabelField } from 'src/core/models/task/task-template-models/label-field';
import { TaskCustomField } from 'src/core/models/task/task-template-models/task-custom-field';
import { TaskFieldType } from 'src/core/models/task/task-field-types';
import { UserModel } from 'src/core/models/user/user-model';
import { EditorConfig } from 'src/core/settings/angular-editor-setting';
import { TasqueDropdownOption } from '../../tasque-dropdown/dropdown.component';
import { TaskCustomFieldModel } from 'src/core/models/task/task-creation-models/task-custom-field-model';

@Component({
  selector: 'app-task-editing-custom-fields',
  templateUrl: './task-editing-custom-fields.component.html',
  styleUrls: ['./task-editing-custom-fields.component.sass']
})
export class TaskEditingCustomFieldsComponent implements OnInit {

  constructor() { }

  @Input() customField: TaskCustomField;
  @Input() projectUsers: UserModel[];

  @Output() taskCustomField = new EventEmitter<TaskCustomFieldModel>();

  public fieldType: TaskFieldType; //BASIC FIELD

  //SPECIFIC FIELDS
  public dropdownField: DropdownField;
  public checkboxFields: CheckboxField[];
  public labelField: LabelField[];
  public taskCheckboxFields: CheckboxField[] = [];

  //OPTIONS
  public dropdownOptions: TasqueDropdownOption[] = [];
  public labelOptions: TasqueDropdownOption[] = [];

  //ADDITION
  public editorConfig = EditorConfig;
  public editorContent = '';

  @HostListener('document:keyup')
  listenParagraph(): void {
    if (this.fieldType === TaskFieldType.Paragraph) {
      this.textValue = this.editorContent;
      this.emitField();
    }
  }

  //INCOME VALUES
  public textValue: string; //use for =>   text, num, date 

  public dropdownValue: string;
  public labelValue: LabelField;
  public checkboxValue: boolean;
  public selectedUser: UserModel;

  //OUTPUT VALUE
  public valueField: TaskCustomFieldModel;

  //INIT COMPONENT
  ngOnInit(): void {
    this.fieldType = this.customField.type;
    if (this.fieldType === TaskFieldType.Dropdown) {
      this.dropdownField = this.customField.dropdown as DropdownField;
    }
    if (this.fieldType === TaskFieldType.Label) {
      this.labelField = this.customField.labels as LabelField[];
      this.setLabelOptions();
    }
    if (this.fieldType === TaskFieldType.CheckBox) {
      this.checkboxFields = this.customField.checkboxes as CheckboxField[];
    }
  }

  //SET VALUES

  setTextValue(val: string): void {
    this.textValue = val;
    this.emitField();
  }

  setDropdownValue(value: string): void {
    this.dropdownValue = value;
    this.emitField();
  }

  setCheckboxChanged(val: boolean, field: CheckboxField): void {
    field.isChecked = val;
    const isExist = this.taskCheckboxFields.find((f) => f.checkboxName === field.checkboxName);
    if (isExist === undefined) {
      this.taskCheckboxFields.push(field);
    } else {
      this.taskCheckboxFields.forEach((f) => {
        if (f.checkboxName === field.checkboxName) {
          f.isChecked = field.isChecked;
        }
      });
    }
    this.textValue = JSON.stringify(this.checkboxFields);
    this.emitField();
  }

  setSelectedLabel(val: number): void {
    this.labelValue = this.labelField[val];
    this.emitField();
  }

  setSelectedUser(val: UserModel): void {
    this.selectedUser = val;
    this.textValue = JSON.stringify(val);
    this.emitField();
  }

  //SET OPTIONS

  setLabelOptions(): void {
    let index = 0;
    this.labelField.forEach((l) => this.labelOptions.push({
      color: l.color,
      title: l.name,
      id: index++,
    }));
  }

  //EMIT 

  emitField(): void {
    if (this.fieldType === TaskFieldType.Paragraph) {
      this.valueField = {
        fieldId: this.customField.fieldId as string,
        fieldValue: this.editorContent,
      };
    }
    if (this.fieldType === TaskFieldType.Label) {
      this.valueField = {
        fieldId: this.customField.fieldId as string,
        fieldValue: this.labelValue.name,
      };
    } else if (this.fieldType === TaskFieldType.User) {
      this.valueField = {
        fieldId: this.customField.fieldId as string,
        fieldValue: this.textValue,
      };
    } else if (this.fieldType === TaskFieldType.Dropdown) {
      this.valueField = {
        fieldId: this.customField.fieldId as string,
        fieldValue: this.dropdownValue,
      };
    } else if (this.fieldType === TaskFieldType.CheckBox) {
      this.valueField = {
        fieldId: this.customField.fieldId as string,
        fieldValue: this.textValue,
      };
    } else {                    //Used for => Text, number and date fields
      this.valueField = {
        fieldId: this.customField.fieldId as string,
        fieldValue: this.textValue,
      };
    }
    this.taskCustomField.emit(this.valueField);
  }
}
