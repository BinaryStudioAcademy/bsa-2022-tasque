import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faArrowLeft,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/core/services/auth.service';
import { ValidationConstants } from 'src/entity-models/const-resources/validation-constraints';
import { UserResetPasswordModel } from 'src/entity-models/user-reset-password-model';
import { InputComponent } from 'src/shared/components/tasque-input/input.component';

@Component({
  selector: 'app-restore-page',
  templateUrl: './restore-page.component.html',
  styleUrls: ['./restore-page.component.sass'],
})
export class RestorePageComponent implements OnInit, OnDestroy {
  faArrow = faArrowLeft;
  faHide = faEyeSlash;
  faShow = faEye;

  public isValidKey?: boolean;
  public hasKey?: boolean;

  public email = '';

  public requestForm: FormGroup = new FormGroup({});
  public resetForm: FormGroup = new FormGroup({});

  public emailControl: FormControl;
  public passwordControl: FormControl;
  public passwordRepeatControl: FormControl;

  private unsubscribe$ = new Subject<void>();
  private token: string;

  get emailErrorMessage(): string {
    const ctrl = this.emailControl;
    if (ctrl.errors?.['required'] && (ctrl.dirty || ctrl.touched)) {
      return 'Email is required';
    }
    if (ctrl.errors?.['pattern']) {
      return 'Incorrect email format';
    }

    return '';
  }

  get passwordErrorMessage(): string {
    const ctrl = this.passwordControl;
    if (ctrl.errors?.['required'] && (ctrl.dirty || ctrl.touched)) {
      return 'Password is required';
    }
    if (ctrl.errors?.['minlength']) {
      return 'Password must be at least 8 characters';
    }
    return '';
  }

  get passwordRepeatErrorMessage(): string {
    const ctrl = this.passwordRepeatControl;
    if (ctrl.errors?.['required'] && ctrl.touched) {
      return 'Password is required';
    }
    if (ctrl.errors?.['pattern']) {
      return 'Passwords do not match';
    }
    return '';
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastrService: ToastrService,
  ) {
    this.emailControl = new FormControl(this.email, [
      Validators.required,
      Validators.email,
      Validators.pattern(ValidationConstants.emailRegex),
    ]);
    this.passwordControl = new FormControl('', [
      Validators.required,
      Validators.minLength(ValidationConstants.minLengthPassword),
    ]);
    this.passwordRepeatControl = new FormControl(this.passwordControl?.value, [Validators.required]);
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        const key = params['key'];
        if (!key) {
          this.hasKey = false;
          return;
        }
        this.hasKey = true;
        this.authService
          .confirmResetKey(key)
          .pipe(delay(5000))
          .subscribe(
            () => {
              this.isValidKey = true;
              this.token = key;
            },
            () => {
              this.router.navigate(['..', 'login'], {
                relativeTo: this.route,
                replaceUrl: true,
                state: { 'error': 'Invalid token' },
              });
            },
          );
      });

    this.requestForm = new FormGroup({
      emailControl: this.emailControl,
    });

    this.resetForm = new FormGroup({
      passwordControl: this.passwordControl,
      passwordRepeatControl: this.passwordRepeatControl,
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public submitEmail(): void {
    if (!this.requestForm.valid) {
      this.requestForm.markAllAsTouched();
      return;
    }
    const email = this.emailControl.value;
    this.authService
      .requestPasswordReset(email)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.toastrService.info('Check your inbox');
      });
  }

  public flipPassword(input: InputComponent): void {
    const show = input.type == 'password';
    input.type = show ? 'text' : 'password';
    input.icon = show ? this.faHide : this.faShow;
  }

  submitPassword(): void {

    if(!this.resetForm.valid){
      this.resetForm.markAllAsTouched();
      return;
    }
    const credentials = {
      password: this.passwordControl.value,
      token: this.token,
    } as UserResetPasswordModel;

    this.authService
      .resetPassword(credentials)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        if (resp.ok) {
          const token = resp.body;
          if (!token) return;
          this.authService.setAuthToken(token);
          this.toastrService.success(
            'You will be redirected to your profile',
            'Password changed',
            { disableTimeOut: true },
          );
          this.router.navigate(['../..', 'organizations'], {
            replaceUrl: true,
            relativeTo: this.route,
          });
        }
      });
  }

  resetPasswordControl(): void {
    this.passwordRepeatControl = new FormControl(
      this.passwordRepeatControl.value,
      [
        Validators.required,
        Validators.pattern(this.passwordControl.value as string),
      ],
    );
    this.resetForm = new FormGroup({
      passwordControl: this.passwordControl,
      passwordRepeatControl: this.passwordRepeatControl,
    });
  }
}
