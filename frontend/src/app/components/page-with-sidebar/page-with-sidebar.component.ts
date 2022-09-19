import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-page-with-sidebar',
  templateUrl: './page-with-sidebar.component.html',
  styleUrls: ['./page-with-sidebar.component.sass']
})
export class PageWithSidebarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  checkRoutes: Observable<void>;

  changedUrl(val: Observable<void>): void {
    this.checkRoutes = val;
  }
}
