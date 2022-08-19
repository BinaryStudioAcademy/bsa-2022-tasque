import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/core/services/auth.service';
import { ValidationConstants } from 'src/entity-models/const-resources/validation-constraints';
import { UserResetPasswordModel } from 'src/entity-models/user-reset-password-model';
import { InputComponent } from 'src/shared/components/tasque-input/input.component';

@Component({
  selector: 'app-reset-page',
  templateUrl: './reset-page.component.html',
  styleUrls: ['./reset-page.component.sass'],
})
export class ResetPageComponent implements OnInit, OnDestroy {
  faHide = faEyeSlash;
  faShow = faEye;

  public isValidKey = false;
  public resetPasswordForm: FormGroup = new FormGroup({});
  public passwordControl: FormControl;
  public passwordRepeatControl: FormControl;

  private unsubscribe$ = new Subject<void>();
  private token: string;

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
    private authService: AuthService,
    private toastrService: ToastrService,
  ) {
    this.passwordControl = new FormControl('', [
      Validators.required,
      Validators.minLength(ValidationConstants.minLengthPassword),
    ]);
    this.passwordRepeatControl = new FormControl('', [Validators.required]);
    this.resetPasswordForm = new FormGroup({
      passwordControl: this.passwordControl,
      passwordRepeatControl: this.passwordRepeatControl,
    });
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
      const key = value['key'];
      if (!key) return;
      this.authService.confirmResetKey(key).subscribe((res) => {
        this.isValidKey = res.ok;
        this.token = key;
      });
    });

    this.passwordControl.valueChanges.subscribe((value) => {
      this.passwordRepeatControl.setValidators([
        Validators.pattern(value),
        Validators.required,
      ]);
      this.passwordRepeatControl.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  flipPassword(input: InputComponent): void {
    const show = input.type == 'password';
    input.type = show ? 'text' : 'password';
    input.icon = show ? this.faHide : this.faShow;
  }

  submit(): void {
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
          // redirect into app here
        }
      });
  }
}
