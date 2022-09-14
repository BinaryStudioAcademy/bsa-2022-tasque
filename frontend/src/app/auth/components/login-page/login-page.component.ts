import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/core/services/auth.service';
import { LocalStorageKeys } from 'src/core/models/local-storage-keys';
import { UserLoginModel } from 'src/core/models/user/user-login-model';
import { ValidationConstants } from 'src/core/models/const-resources/validation-constraints';
import { ToastrService } from 'ngx-toastr';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { InputComponent } from 'src/shared/components/tasque-input/input.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.sass'],
})
export class LoginPageComponent implements OnInit, OnDestroy {
  faGithub = faGithub;
  faGoogle = faGoogle;
  faHide = faEye;
  faShow = faEyeSlash;

  public userLogin: UserLoginModel = {};
  public hidePass = true;
  public loginForm: FormGroup = new FormGroup({});
  public firstName: FormControl;
  public emailControl: FormControl;
  public passwordControl: FormControl;
  public unsubscribe$ = new Subject<void>();
  public localStorage = window.localStorage;
  public localStorageKeys = LocalStorageKeys;
  private validationConstants = ValidationConstants;

  private errMsg?: string;

  @ViewChild('passwordInput') passwordInput: InputComponent;
  @ViewChild('emailInput') emailInput: InputComponent;

  get emailErrorMessage(): string {
    const ctrl = this.emailControl;
    if (ctrl.errors?.['required']) {
      return 'Email is required';
    }
    if (ctrl.errors?.['pattern']) {
      return 'Incorrect email format';
    }

    return '';
  }

  get passwordErrorMessage(): string {
    const ctrl = this.passwordControl;
    if (ctrl.errors?.['required']) {
      return 'Password is required';
    }
    if (ctrl.errors?.['minlength']) {
      return 'Password must be at least 8 characters';
    }

    return '';
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastrService: ToastrService,
  ) {
    const nav = this.router.getCurrentNavigation();
    this.errMsg = nav?.extras.state?.['error'];

    this.emailControl = new FormControl(this.userLogin.email, [
      Validators.required,
      Validators.pattern(this.validationConstants.emailRegex),
    ]);
    this.passwordControl = new FormControl(this.userLogin.password, [
      Validators.required,
      Validators.minLength(this.validationConstants.minLengthPassword),
    ]);
  }

  ngOnInit(): void {
    if (this.errMsg) {
      this.toastrService.error(this.errMsg);
    }

    this.loginForm = new FormGroup({
      emailControl: this.emailControl,
      passwordControl: this.passwordControl,
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public submitForm(): void {
    if (this.loginForm.invalid) {
      this.showError(this.emailInput);
      this.showError(this.passwordInput);
      return;
    }

    this.userLogin = {
      email: this.loginForm.get('emailControl')?.value,
      password: this.loginForm.get('passwordControl')?.value,
    };

    this.authService
      .loginUser(this.userLogin)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (resp) => {
          if (resp.body) {
            this.authService.setAuthToken(resp.body);
            this.toastrService.success(
              'You will be redirected to your profile',
              'Login successful', { positionClass: 'toast-top-right' }
            );
            this.router.navigate(['../..', 'organizations'], {
              replaceUrl: true,
              relativeTo: this.route,
            });
          }
        },
        (error: HttpErrorResponse) => {
          if (error.status == 403) {
            const toast = this.toastrService.error(
              'Click this notification to send confirmation link again',
              'Email is not confirmed',
              { disableTimeOut: true, closeButton: true, timeOut: 10000 },
            );
            toast.onTap.subscribe(() => this.resendConfirmationEmail());
            return;
          }
          throw error;
        },
      );
  }

  flipPasswordVisible(): void {
    this.hidePass = !this.hidePass;
    this.passwordInput.type = this.hidePass ? 'password' : 'text';
    this.passwordInput.icon = this.hidePass ? this.faHide : this.faShow;
  }

  public showError(input: InputComponent): void {
    let isError = false;
    let errMsg = '';
    switch (input.inputLabel) {
      case 'Email':
        isError = this.emailControl.invalid;
        errMsg = this.emailErrorMessage;
        break;
      case 'Password':
        isError = this.passwordControl.invalid;
        errMsg = this.passwordErrorMessage;
    }

    input.invalid = isError;
    input.errorMessage = errMsg;
  }

  public hideError(input: InputComponent): void {
    input.invalid = false;
  }

  private resendConfirmationEmail(): void {
    const ctrl = this.emailControl;
    if (ctrl.invalid) return;
    this.authService
      .resendEmailConfirmation(ctrl.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.toastrService.success('Check your inbox');
      });
  }
}
