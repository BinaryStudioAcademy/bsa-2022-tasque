import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { ValidationConstraints } from 'src/entity-models/const-resources/validation-constraints';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.sass']
})
export class LoginPageComponent implements OnInit {
  faGithub = faGithub;
  faGoogle = faGoogle;

  public name = '';
  public email = '';
  public password = '';
  public hidePass = true;
  public loginForm: FormGroup =  new FormGroup({});
  public firstName: FormControl;
  public emailControl: FormControl;
  public passwordControl: FormControl;

  constructor(
    private dialogRef: MatDialogRef<LoginPageComponent>,
    private validationConstraints = ValidationConstraints,
  ) {
    this.firstName = new FormControl(this.name, [
      Validators.required,
      Validators.minLength(this.validationConstraints.minLengthName)
    ]);
    this.emailControl = new FormControl(this.email, [
      Validators.email,
      Validators.required,
      Validators.minLength(this.validationConstraints.minLengthEmail)
    ]);
    this.passwordControl = new FormControl(this.password, [
      Validators.required,
      Validators.minLength(this.validationConstraints.minLengthPassword)
    ]);
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      firstName: this.firstName,
      emailControl: this.emailControl,
      passwordControl: this.passwordControl
    });
  }

  generateFormControls(): void {
    this.firstName = new FormControl(this.name, [
      Validators.required,
      Validators.minLength(this.validationConstraints.minLengthName)
    ]);
  }

  public close(): void {
    this.dialogRef.close(false);
  }

  public submitForm(): void {
    this.email = this.emailControl.value;
    this.password = this.passwordControl.value;
    this.close();
  }

}
