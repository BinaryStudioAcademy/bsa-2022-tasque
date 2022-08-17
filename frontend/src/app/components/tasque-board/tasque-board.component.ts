import { Component, OnInit } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'tasque-board',
  templateUrl: './tasque-board.component.html',
  styleUrls: ['./tasque-board.component.sass']
})
export class TasqueBoardComponent implements OnInit {

  public searchIcon = faMagnifyingGlass;
  public board = new Array

  constructor() { }

  ngOnInit() {
  }

}
