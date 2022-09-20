import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-protected',
  templateUrl: './protected.component.html',
  styleUrls: ['./protected.component.sass']
})
export class ProtectedComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe((p) => {
      const exist = p['exist'];
      const key = p['key'] as string;
      if(exist === 'true') {
        this.router.navigate(['auth/login'], {
          queryParams: { key: key },
          queryParamsHandling: 'merge',
        });
      } else {
        this.router.navigate(['auth/register'], {
          queryParams: { key: key, invite: 'org' },
          queryParamsHandling: 'merge',
        });
      }
    });
  }
}
