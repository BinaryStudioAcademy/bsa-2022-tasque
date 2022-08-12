import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/core/services/auth.service';

@Component({
  selector: 'app-reset-page',
  templateUrl: './reset-page.component.html',
  styleUrls: ['./reset-page.component.sass']
})
export class ResetPageComponent implements OnInit, OnDestroy {
  public isValidKey = false;
  public password = '';
  public passwordRepeat = '';
  public hidePass = true;
  public hidePassRepeat = true;
  public loginForm: FormGroup = new FormGroup({});
  public emailControl: FormControl;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
      const key = value['key'];
      if (!key) return;
      this.authService.confirmResetKey(key).subscribe((res) => {
        this.isValidKey == res;
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
