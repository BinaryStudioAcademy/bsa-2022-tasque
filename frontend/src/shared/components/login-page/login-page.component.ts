import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.sass']
})
export class LoginPageComponent implements OnInit {

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
  ) { 
    this.firstName = new FormControl(this.name, [
      Validators.required,
      Validators.minLength(8)
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
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      firstName: this.firstName,
      emailControl: this.emailControl,
      passwordControl: this.passwordControl
    });
  }

  generateFormControls() {
    this.firstName = new FormControl(this.name, [
      Validators.required,
      Validators.minLength(4)
    ]);
  }

  public close() {
    this.dialogRef.close(false);
  }

  public submitForm() {
    console.log(this.emailControl.value);
    console.log(this.passwordControl.value);
    this.close();
  }

}
