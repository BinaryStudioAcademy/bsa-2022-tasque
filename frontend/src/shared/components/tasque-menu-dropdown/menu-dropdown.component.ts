import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'tasque-menu-dropdown',
  templateUrl: './menu-dropdown.component.html',
  styleUrls: ['./menu-dropdown.component.sass']
})
export class MenuDropdownComponent implements OnInit {
  @Input() public items: string[] = [];
  @Input() public menuName = '';
  @Output() public buttonClicked = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onClick(item: string): void {
    this.buttonClicked.emit(item);
  }
}
