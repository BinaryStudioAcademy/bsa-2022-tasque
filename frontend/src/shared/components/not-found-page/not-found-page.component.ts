import { Component, OnInit } from '@angular/core';
import { fa0, fa4 } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.sass']
})
export class NotFoundPageComponent implements OnInit {

  faFour = fa4;
  faZero = fa0;

  constructor() { }

  ngOnInit(): void {
  }

}
