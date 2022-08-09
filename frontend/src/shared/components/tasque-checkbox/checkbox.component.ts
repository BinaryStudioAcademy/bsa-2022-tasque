import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'tasque-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.sass']
})
export class CheckboxComponent implements OnInit {
  @Input() public text = '';
  @Input() public checked = false;
  @Output() public stateChanged = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  public toggleChecked(): void {
    this.checked = !this.checked;
    this.stateChanged.emit(this.checked);
  }
}
