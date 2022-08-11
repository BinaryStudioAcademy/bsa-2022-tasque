import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/core/services/auth.service';
import { LocalStorageKeys } from 'src/entity-models/local-storage-keys';
import { UserLoginModel } from 'src/entity-models/user-login-model';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.sass']
})
export class LoginPageComponent implements OnInit {
  faGithub = faGithub;
  faGoogle = faGoogle;

  public userLogin: UserLoginModel = {};
  public hidePass = true;
  public loginForm: FormGroup =  new FormGroup({});
  public firstName: FormControl;
  public emailControl: FormControl;
  public passwordControl: FormControl;
  public unsubscribe$ = new Subject<void>(); 
  public localStorage = window.localStorage;
  public localStorageKeys = LocalStorageKeys;

  constructor(
    private dialogRef: MatDialogRef<LoginPageComponent>,
    private authService: AuthService
  ) {
    this.emailControl = new FormControl(this.userLogin.email, [
      Validators.email,
      Validators.required,
      Validators.minLength(8)
    ]);
    this.passwordControl = new FormControl(this.userLogin.password, [
      Validators.required,
      Validators.minLength(8)
    ]);
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      emailControl: this.emailControl,
      passwordControl: this.passwordControl
    });
  }

  public close(): void {
    this.dialogRef.close(false);
  }

  public submitForm(): void {
    console.log(this.userLogin);
    this.authService.loginUser(this.userLogin)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((resp) => {
      if(resp.ok){
        const token = resp.body;
        this.localStorage.setItem(this.localStorageKeys.token, token?.accessToken as string)
      }
    },
    (error) => {
      //pop-up with error;
    });
    this.close();
  }

}
