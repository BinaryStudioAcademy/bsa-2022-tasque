import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ValidationConstants } from 'src/core/models/const-resources/validation-constraints';

@Component({
  selector: 'tasque-create-dropdown',
  templateUrl: './tasque-create-dropdown.component.html',
  styleUrls: ['./tasque-create-dropdown.component.sass']
})
export class TasqueCreateDropdownComponent implements OnInit {

  @Output() nameItemEvent = new EventEmitter<string>();

  public plusIcon = faPlus;
  public createForm: FormGroup;
  public createControl: FormControl;

  private validationConstants = ValidationConstants;

  get createErrorMessage(): string {
    const ctrl = this.createControl;
    if (ctrl.errors?.['required']) {
      return 'Name is required';
    }
    if (ctrl.errors?.['minlength']) {
      return 'Must be at least 2 characters';
    }
    if (ctrl.errors?.['maxlength']) {
      return 'Must be no more than 12 characters';
    }
    if (ctrl.errors?.['pattern']) {
      return 'The name must consist of numbers or letters';
    }

    return '';
  }

  constructor() {
    this.createControl = new FormControl('', [
        Validators.required,
        Validators.pattern(/^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/),
        Validators.minLength(this.validationConstants.minLengthName),
        Validators.maxLength(this.validationConstants.maxLenghtTitle),
    ]);
  }

  ngOnInit(): void {
    this.createForm = new FormGroup({
      createControl: this.createControl
    });
  }

  create(): void {
    if(this.createForm.valid) {
      this.nameItemEvent.emit(this.createForm.get('createControl')?.value);
    }
  }
}
