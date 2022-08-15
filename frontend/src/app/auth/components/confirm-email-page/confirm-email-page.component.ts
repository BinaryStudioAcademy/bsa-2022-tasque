import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/core/services/auth.service';

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
  ) {}

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
      });
    });
  }
}
