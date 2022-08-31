import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { faPenToSquare, faCheck } from '@fortawesome/free-solid-svg-icons';
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
  public fieldControl: FormControl;

  isChanging = false;

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
  
}
