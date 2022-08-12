import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ValidationConstants } from 'src/entity-models/const-resources/validation-constraints';

@Component({
  selector: 'app-restore-page',
  templateUrl: './restore-page.component.html',
  styleUrls: ['./restore-page.component.sass'],
})
export class RestorePageComponent implements OnInit {
  faArrow = faArrowLeft;
  public email = '';
  public loginForm: FormGroup = new FormGroup({});
  public emailControl: FormControl;

  constructor() {
    this.emailControl = new FormControl(this.email, [
      Validators.required,
      Validators.pattern(ValidationConstants.emailRegex),
    ]);
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      emailControl: this.emailControl,
    });
  }
}
