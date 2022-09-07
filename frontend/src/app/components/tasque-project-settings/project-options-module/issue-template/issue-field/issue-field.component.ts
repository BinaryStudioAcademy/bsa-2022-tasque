import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { faPenToSquare, faCheck, faCode } from '@fortawesome/free-solid-svg-icons';
import { TaskCustomField } from 'src/core/models/task/task-custom-field';

@Component({
  selector: 'tasque-issue-field',
  templateUrl: './issue-field.component.html',
  styleUrls: ['./issue-field.component.sass']
})
export class IssueFieldComponent implements OnInit {

  constructor() {
    this.fieldControl = new FormControl(this.field, [
      Validators.required,
      Validators.minLength(2),
    ]);

   }

  faPenToSquare = faPenToSquare;
  faCheck = faCheck;
  faEdit = faCode;
  public fieldControl: FormControl;

  isChanging = false;
  isFieldLabel = false;
  isFieldDropdown = false;
  isFieldCheckbox = false;
  @Output() isLabel = new EventEmitter<TaskCustomField>();
  @Output() isDropDown = new EventEmitter<TaskCustomField>();
  @Output() isCheckbox = new EventEmitter<TaskCustomField>();

  @Input() field: TaskCustomField;

  ngOnInit(): void {
  }

  get errorMessage(): string {
    const control = this.fieldControl;
    if(control.errors?.['required'])
      return 'Field can not be empty';
    if(control.errors?.['minlength'])
      return 'Minimum length are 2 characters';
    return '';
  }

  public fieldRename(event: Event): string {
    const input = event.target as HTMLInputElement;
    return input.innerText;
  }

  public toogleChanging(): void {
    this.isChanging = !this.isChanging;
  }
  
  public toogleLabelChanging(): void {
    this.isFieldLabel = !this.isFieldLabel;
    this.isLabel.emit(this.field);
  }

  public toogleDropdownChanging(): void {
    this.isFieldDropdown = !this.isFieldDropdown;
    this.isDropDown.emit(this.field);
  }

  public toogleCheckboxChanging(): void {
    this.isFieldCheckbox = !this.isFieldCheckbox;
    this.isCheckbox.emit(this.field);
  }
}

