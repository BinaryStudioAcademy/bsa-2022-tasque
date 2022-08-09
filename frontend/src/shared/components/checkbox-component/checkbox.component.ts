import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.sass']
})
export class CheckboxComponent implements OnInit {
  @Input() public Text = '';
  @Input() public Checked = false;
  @Output() public stateChanged = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  public toggleChecked(): void {
    this.Checked = !this.Checked;
    this.stateChanged.emit(this.Checked);
  }
}
