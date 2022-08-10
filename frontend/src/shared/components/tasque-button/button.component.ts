import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tasque-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.sass'],
})
export class ButtonComponent {
  public buttonText = '';
  public buttonClass = 'btn';

  @Input()
  set text(name: string) {
    this.buttonText = name;
  }
  get name(): string {
    return this.buttonText;
  }

  @Input()
  set class(name: string) {
    this.buttonClass = name;
  }
  get class(): string {
    return this.buttonClass;
  }

  @Output() btnClick = new EventEmitter();

  constructor() {}

  onClick(): void {
    this.btnClick.emit();
  }
}
