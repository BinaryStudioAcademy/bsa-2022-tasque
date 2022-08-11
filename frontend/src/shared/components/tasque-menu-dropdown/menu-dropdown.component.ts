import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'tasque-menu-dropdown',
  templateUrl: './menu-dropdown.component.html',
  styleUrls: ['./menu-dropdown.component.sass']
})
export class MenuDropdownComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  @Input() public items: string[] = [];
  @Input() public menuName = '';
  @Output() public buttonClicked = new EventEmitter<string>();

  onClick(item: string): void {
    this.buttonClicked.emit(item);
  }
}
