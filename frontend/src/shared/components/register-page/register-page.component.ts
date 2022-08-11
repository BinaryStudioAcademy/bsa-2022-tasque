import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.sass']
})
export class RegisterPageComponent implements OnInit {

  public name = '';
  public email = '';
  public password = '';
  public passwordRepeat = '';
  public hidePass = true;
  public hidePassRepeat = true;
  public registerForm: FormGroup =  new FormGroup({});
  public nameControl: FormControl;
  public emailControl: FormControl;
  public passwordControl: FormControl;
  public passwordRepeatControl: FormControl;

  constructor() { 
    this.nameControl = new FormControl(this.name, [
      Validators.required,
    ]);
    this.emailControl = new FormControl(this.email, [
      Validators.email,
      Validators.required,
      Validators.minLength(8)
    ]);
    this.passwordControl = new FormControl(this.password, [
      Validators.required,
      Validators.minLength(8)
    ]);
    this.passwordRepeatControl = new FormControl(this.passwordRepeat, [
      Validators.required,
    ]);
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      nameControl: this.nameControl,
      emailControl: this.emailControl,
      passwordControl: this.passwordControl,
      passwordRepeatControl: this.passwordRepeatControl
    });
  }

  resetPasswordControl(): void {
    this.passwordRepeatControl = new FormControl(this.passwordRepeat, [
      Validators.required,
      Validators.pattern(this.password)
    ]);
    this.registerForm = new FormGroup({
      nameControl: this.nameControl,
      emailControl: this.emailControl,
      passwordControl: this.passwordControl,
      passwordRepeatControl: this.passwordRepeatControl
    });
  }

  public submitForm(): void {
    if(!this.registerForm.valid)
      return;
    this.email = this.emailControl.value;
    this.password = this.passwordControl.value;
    this.name = this.nameControl.value;
  }
}
