import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/core/services/auth.service';
import { UserRegisterModel } from 'src/entity-models/user-register-model';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.sass']
})
export class RegisterPageComponent implements OnInit {

  public passwordRepeat = '';
  public hidePass = true;
  public hidePassRepeat = true;

  public userRegister: UserRegisterModel = {};
  public registerForm: FormGroup =  new FormGroup({});
  public nameControl: FormControl;
  public emailControl: FormControl;
  public passwordControl: FormControl;
  public passwordRepeatControl: FormControl;
  public unsubscribe$ = new Subject<void>();

  faGithub = faGithub;
  faGoogle = faGoogle;

  constructor(
    private authService: AuthService
  ) { 
    this.nameControl = new FormControl(this.userRegister.name, [
      Validators.required,
      Validators.minLength(4)
    ]);
    this.emailControl = new FormControl(this.userRegister.email, [
      Validators.email,
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
    ]);
    this.passwordControl = new FormControl(this.userRegister.password, [
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
      Validators.pattern(this.userRegister.password as string)
    ]);
    this.registerForm = new FormGroup({
      nameControl: this.nameControl,
      emailControl: this.emailControl,
      passwordControl: this.passwordControl,
      passwordRepeatControl: this.passwordRepeatControl
    });
  }

  public submitForm(): void {
    if(!this.registerForm.valid){
      //pop-up with error
      return;
    }
      this.authService.registerUser(this.userRegister)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }
}
