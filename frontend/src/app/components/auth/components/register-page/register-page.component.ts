import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from 'src/core/services/auth.service';
import { ValidationConstants } from 'src/core/models/const-resources/validation-constraints';
import { ErrorMessages } from 'src/core/models/const-resources/error-messages';
import { InputComponent } from 'src/shared/components/tasque-input/input.component';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { filter, map, mergeMap, switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { UserRegisterModel } from 'src/core/models/user/user-register-model';
import { ToastrNotificationService } from 'src/core/services/toastr-notification.service';
import { HttpResponse } from '@angular/common/http';
import { matchValidator } from '../../match.validator';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.sass'],
})
export class RegisterPageComponent implements OnInit {
  public passwordRepeat = '';
  public hidePass = true;
  public hidePassRepeat = true;
  public isInvite = false;
  public isInvitedToOrganization: boolean;

  private key?: string;

  public userRegister: UserRegisterModel = {};
  public registerForm: FormGroup = new FormGroup({});
  public nameControl: FormControl;
  public emailControl: FormControl;
  public passwordControl: FormControl;
  public passwordRepeatControl: FormControl;

  faGithub = faGithub;
  faGoogle = faGoogle;
  faShow = faEye;
  faHide = faEyeSlash;
  public validationConstants = ValidationConstants;
  public errorMessages = ErrorMessages;
  public showError: boolean;

  @ViewChild('emailInput')
  public emailInput: InputComponent;

  private unsubscribe$ = new Subject<void>();

  get nameErrorMessage(): string {
    const ctrl = this.nameControl;
    if (ctrl.errors?.['required'] && (ctrl.dirty || ctrl.touched)) {
      return 'Name is required';
    }
    if (ctrl.errors?.['minlength'] && (ctrl.dirty || ctrl.touched)) {
      return 'Name minimum length is 4 characters';
    }
    return '';
  }

  get emailErrorMessage(): string {
    const ctrl = this.emailControl;
    if (ctrl.errors?.['required'] && (ctrl.dirty || ctrl.touched)) {
      return 'Email is required';
    }
    if (ctrl.errors?.['pattern']) {
      return 'Invalid email format';
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
    if (ctrl.errors?.['noMatch']) {
      return 'Passwords do not match';
    }
    if (ctrl.errors?.['required'] && (ctrl.dirty || ctrl.touched)) {
      return 'You need to repeat your password';
    }
    if (ctrl.errors?.['minlength']) {
      return 'Password must be at least 8 characters';
    }
    return '';
  }

  constructor(
    private authService: AuthService,
    private notificationService: ToastrNotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: GetCurrentUserService,
  ) {
    this.nameControl = new FormControl(this.userRegister.name, [
      Validators.required,
      Validators.minLength(this.validationConstants.minLengthName),
    ]);
    this.emailControl = new FormControl(this.userRegister.email, [
      Validators.required,
      Validators.pattern(this.validationConstants.emailRegex),
    ]);
    this.passwordControl = new FormControl(this.userRegister.password, [
      Validators.required,
      Validators.minLength(this.validationConstants.minLengthPassword),
    ]);
    this.passwordRepeatControl = new FormControl(this.passwordRepeat, [
      Validators.required,
      Validators.minLength(this.validationConstants.minLengthPassword),
      matchValidator(this.passwordControl)
    ]);
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      nameControl: this.nameControl,
      emailControl: this.emailControl,
      passwordControl: this.passwordControl,
      passwordRepeatControl: this.passwordRepeatControl,
    });

    this.passwordControl.valueChanges.subscribe(() => {
      this.passwordRepeatControl.updateValueAndValidity();
    });

    this.route.queryParams
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((params) => !!params['key']),
        map((params) => {
          this.key = params['key'] as string;
          const invitation = params['invite'] as string;
          if(invitation) {
            this.isInvitedToOrganization = true;
          }
          return this.key;
        }),
        mergeMap((ref) => this.checkInvitationLink(ref)),
      )
      .subscribe(
        (resp) => {
          this.emailControl.setValue(resp.body?.email);
          this.isInvite = true;
        },
        () => {
          this.router.navigate([], {
            replaceUrl: true,
            relativeTo: this.route,
          });
        },
      );
  }

  checkInvitationLink(ref: string): Observable<HttpResponse<{ email: string }>> {
    if(this.isInvitedToOrganization) {
      return this.authService.checkInvitationLink(ref);
    }
    return this.authService.checkRefLink(ref);
  }

  flipPassword(input: InputComponent): void {
    const show = input.type == 'password';
    input.type = show ? 'text' : 'password';
    input.icon = show ? this.faHide : this.faShow;
  }

  public submitForm(): void {
    if (this.registerForm.valid) {
      const model = {
        name: this.nameControl.value,
        email: this.emailControl.value,
        password: this.passwordControl.value,
        key: this.key,
        isInvitedToOrganization: this.isInvitedToOrganization,
      } as UserRegisterModel;

      if (!this.key) {
        this.authService
          .registerUser(model)
          .pipe(
            switchMap(() =>
              this.authService.resendEmailConfirmation(model.email ?? ''),
            ),
          )
          .subscribe(() => {
            this.notificationService.info('Check your mailbox');
          });
        return;
      }

      this.authService.registerUser(model)
        .subscribe((resp) => {
          if (resp.body != null) {
            this.authService.setAuthToken(resp.body);
            this.userService.setCurrentUserByEmail(this.emailControl.value);
          }
          this.router.navigate(['/']);
        });
    }
    else {
      this.registerForm.markAllAsTouched();
      this.showError = true;
    }
  }
}
