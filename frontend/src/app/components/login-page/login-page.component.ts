import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { ValidationConstants } from 'src/entity-models/const-resources/validation-constraints';

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
  private validationConstants = ValidationConstants;

  constructor() {
    this.firstName = new FormControl(this.name, [
      Validators.required,
      Validators.minLength(this.validationConstants.minLengthName)
    ]);
    this.emailControl = new FormControl(this.email, [
      Validators.email,
      Validators.required,
      Validators.minLength(this.validationConstants.minLengthEmail)
    ]);
    this.passwordControl = new FormControl(this.password, [
      Validators.required,
      Validators.minLength(this.validationConstants.minLengthPassword)
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
      Validators.minLength(this.validationConstants.minLengthName)
    ]);
  }

  public close(): void {
  }

  public submitForm(): void {
    this.email = this.emailControl.value;
    this.password = this.passwordControl.value;
    this.close();
  }

}
