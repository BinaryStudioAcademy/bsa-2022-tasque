import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/core/services/auth.service';
import { ValidationConstants } from 'src/entity-models/const-resources/validation-constraints';
import { LocalStorageKeys } from 'src/entity-models/local-storage-keys';
import { UserResetPasswordModel } from 'src/entity-models/user-reset-password-model';

@Component({
  selector: 'app-reset-page',
  templateUrl: './reset-page.component.html',
  styleUrls: ['./reset-page.component.sass'],
})
export class ResetPageComponent implements OnInit, OnDestroy {
  public isValidKey = false;
  public password = '';
  public passwordRepeat = '';
  public hidePass = true;
  public hidePassRepeat = true;
  public resetPasswordForm: FormGroup = new FormGroup({});
  public passwordControl: FormControl;
  public passwordRepeatControl: FormControl;
  public localStorage = window.localStorage;
  public localStorageKeys = LocalStorageKeys;

  private unsubscribe$ = new Subject<void>();
  private token: string;

  constructor(private route: ActivatedRoute, private authService: AuthService) {
    this.passwordControl = new FormControl(this.password, [
      Validators.required,
      Validators.minLength(ValidationConstants.minLengthPassword),
    ]);
    this.passwordRepeatControl = new FormControl(this.passwordRepeat, [
      Validators.required,
    ]);
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
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  resetPasswordControl(): void {
    this.passwordRepeatControl = new FormControl(this.passwordRepeat, [
      Validators.required,
      Validators.pattern(this.password as string),
    ]);
    this.resetPasswordForm = new FormGroup({
      passwordControl: this.passwordControl,
      passwordRepeatControl: this.passwordRepeatControl,
    });
  }

  submit(): void {
    const credentials = {
      password: this.password,
      token: this.token,
    } as UserResetPasswordModel;

    this.authService
      .resetPassword(credentials)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        if (resp.ok) {
          const token = resp.body;
          this.localStorage.setItem(
            this.localStorageKeys.token,
            token?.accessToken as string,
          );
          // redirect into app here
        }
      });
  }
}
