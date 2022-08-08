import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.sass']
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

	@Input() color: string = '0068B4';
	@Input() type: string = 'button';
	@Output() btnClick = new EventEmitter();

	constructor() {}

	onClick() {
		this.btnClick.emit();
	}
}