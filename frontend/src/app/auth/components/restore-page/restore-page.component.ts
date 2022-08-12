import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/core/services/auth.service';
import { ValidationConstants } from 'src/entity-models/const-resources/validation-constraints';

@Component({
  selector: 'app-restore-page',
  templateUrl: './restore-page.component.html',
  styleUrls: ['./restore-page.component.sass'],
})
export class RestorePageComponent implements OnInit {
  faArrow = faArrowLeft;
  public email = '';
  public loginForm: FormGroup = new FormGroup({});
  public emailControl: FormControl;
  public unsubscribe$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
  ) {
    this.emailControl = new FormControl(this.email, [
      Validators.required,
      Validators.pattern(ValidationConstants.emailRegex),
    ]);
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      emailControl: this.emailControl,
    });
  }

  public submit(): void {
    if (!this.loginForm.valid) return;
    const email = this.emailControl.value;
    this.authService
      .requestPasswordReset(email)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.toastrService.success(resp.body as string);
      });
  }
}
