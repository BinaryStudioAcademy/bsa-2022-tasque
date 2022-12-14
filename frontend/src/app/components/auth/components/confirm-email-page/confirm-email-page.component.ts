import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/core/services/auth.service';
import { ToastrNotificationService } from 'src/core/services/toastr-notification.service';

@Component({
  selector: 'app-confirm-email-page',
  templateUrl: './confirm-email-page.component.html',
  styleUrls: ['./confirm-email-page.component.sass'],
})
export class ConfirmEmailPageComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notifService: ToastrNotificationService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['key'];
      if (!token) {
        this.router.navigate(['..', 'login'], {
          replaceUrl: true,
          relativeTo: this.route,
        });
      }
      this.authService.confirmEmail(token).subscribe((resp) => {
        const token = resp.body;
        if (!token) return;
        this.authService.setAuthToken(resp.body);
        this.notifService.success(
          'You will be redirected to your profile',
          'Email confirmed',
        );
        this.router.navigate(['../..', 'organizations'], {
          replaceUrl: true,
          relativeTo: this.route,
        });
      });
    });
  }
}
