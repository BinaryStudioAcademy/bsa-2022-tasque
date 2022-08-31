import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { faPenToSquare, faCheck, faDatabase } from '@fortawesome/free-solid-svg-icons';
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
  faEdit = faDatabase;
  public fieldControl: FormControl;

  isChanging = false;
  isFieldLabel = false;
  @Output() isLabel = new EventEmitter<boolean>();
  @Output() isDropDown = false;

  @Input() field: TaskCustomField;

  ngOnInit(): void {
  }

  get errorMessage(): string {
    const control = this.fieldControl;
    if(control.errors?.['required'])
      return 'Field can not be empty'
    if(control.errors?.['minlength'])
      return 'Minimum length are 2 characters'
    return ''
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
    this.isLabel.emit(this.isFieldLabel);
  }
}
