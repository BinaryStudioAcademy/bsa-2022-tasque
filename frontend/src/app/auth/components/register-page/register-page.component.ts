import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from 'src/core/services/auth.service';
import { UserRegisterModel } from 'src/entity-models/user-register-model';
import { ValidationConstants } from 'src/entity-models/const-resources/validation-constraints';
import { ToastrService } from 'ngx-toastr';
import { ErrorMessages } from 'src/entity-models/const-resources/error-messages';
import { InputComponent } from 'src/shared/components/tasque-input/input.component';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.sass'],
})
export class RegisterPageComponent implements OnInit {
  public passwordRepeat = '';
  public hidePass = true;
  public hidePassRepeat = true;

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

  get nameErrorMessage(): string {
    const ctrl = this.nameControl;
    if (ctrl.errors?.['required'] && (ctrl.dirty || ctrl.touched)) {
      return 'Name is required';
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
    if (ctrl.errors?.['pattern']) {
      return 'Passwords do not match';
    }
    return '';
  }

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService
  ) {
    this.nameControl = new FormControl(this.userRegister.name, [
      Validators.required,
      Validators.minLength(this.validationConstants.minLengthName),
    ]);
    this.emailControl = new FormControl(this.userRegister.email, [
      Validators.email,
      Validators.required,
      Validators.pattern(this.validationConstants.emailRegex),
    ]);
    this.passwordControl = new FormControl(this.userRegister.password, [
      Validators.required,
      Validators.minLength(this.validationConstants.minLengthPassword),
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
      passwordRepeatControl: this.passwordRepeatControl,
    });
  }

  flipPassword(input: InputComponent): void {
    const show = input.type == 'password';
    input.type = show ? 'text' : 'password';
    input.icon = show ? this.faHide : this.faShow;
  }

  resetPasswordControl(): void {
    this.passwordRepeatControl = new FormControl(this.passwordRepeatControl.value, [
      Validators.required,
      Validators.pattern(this.passwordControl.value as string),
    ]);
    this.registerForm = new FormGroup({
      nameControl: this.nameControl,
      emailControl: this.emailControl,
      passwordControl: this.passwordControl,
      passwordRepeatControl: this.passwordRepeatControl,
    });
  }

  public submitForm(): void {
    if (!this.registerForm.valid) {
      this.toastrService.error('Invalid values');
      return;
    }
    this.toastrService.info('Check your mailbox');
    this.authService.registerUser(this.userRegister).subscribe(
      (resp) => {
        if (resp.ok) {
          this.toastrService.success(resp.body as string);
        } else {
          this.toastrService.error(resp.body as string);
        }
      },
      (error) => {
        this.toastrService.error(error);
      },
    );
  }
}
