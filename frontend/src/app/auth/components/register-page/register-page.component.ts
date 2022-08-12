import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from 'src/core/services/auth.service';
import { UserRegisterModel } from 'src/entity-models/user-register-model';
import { ValidationConstants } from 'src/entity-models/const-resources/validation-constraints';
import { ToastrService } from 'ngx-toastr';
import { ErrorMessages } from 'src/entity-models/const-resources/error-messages';

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
  public validationConstants = ValidationConstants;
  public errorMessages = ErrorMessages;

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
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

  resetPasswordControl(): void {
    this.passwordRepeatControl = new FormControl(this.passwordRepeat, [
      Validators.required,
      Validators.pattern(this.userRegister.password as string),
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
          /*
          this.router.navigate(['..', 'login'], {
      relativeTo: this.route,
      queryParams: { registered: true },
    });
          */
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
