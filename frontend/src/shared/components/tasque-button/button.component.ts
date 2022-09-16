import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
@Component({
  selector: 'tasque-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.sass'],
})
export class ButtonComponent {
  public buttonIcon?: IconProp = undefined;
  public buttonText = '';
  public buttonClass = 'btn';
  public buttonType = 'button';

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

  set type(name: string) {
    this.buttonType = name;
  }
  get type(): string {
    return this.buttonType;
  }

  @Input()
  set icon(icon: IconProp) {
    this.buttonIcon = icon;
  }

  @Output() btnClick = new EventEmitter();

  constructor() {}

  onClick(): void {
    this.btnClick.emit();
  }
}
