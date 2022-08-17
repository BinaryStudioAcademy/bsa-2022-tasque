import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export type IconPosition = 'right' | 'left';

@Component({
  selector: 'tasque-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputComponent),
    },
  ],
})

export class InputComponent implements ControlValueAccessor {
  public inputBorderRadius = 10;
  public inputClass = '';
  public inputType = 'text';
  public inputValue = '';
  public inputLabel = '';
  public inputPlaceholder = '';
  public inputErrorMessage = 'error';
  public inputValueIsError = false;

  public iconPos: IconPosition;
  public inputIcon?: IconProp = undefined;

  @Input() value: string;

  @Input()
  set type(typeName: string) {
    this.inputType = typeName;
  }
  get type(): string {
    return this.inputType;
  }

  @Input()
  set borderRadius(radius: number) {
    this.inputBorderRadius = radius;
  }
  get borderRadius(): number {
    return this.inputBorderRadius;
  }

  @Input()
  set placeholder(text: string) {
    this.inputPlaceholder = text;
  }
  get placeholder(): string {
    return this.inputPlaceholder;
  }

  @Input()
  set label(text: string) {
    this.inputLabel = text;
  }
  get label(): string {
    return this.inputLabel;
  }

  @Input()
  set class(name: string) {
    this.inputClass = name;
  }
  get class(): string {
    return this.inputClass;
  }

  @Input()
  set invalid(hasError: boolean) {
    this.inputValueIsError = hasError;
  }
  get invalid(): boolean {
    return this.inputValueIsError;
  }

  @Input()
  set errorMessage(message: string) {
    this.inputErrorMessage = message;
  }
  get errorMessage(): string {
    return this.inputErrorMessage;
  }

  @Input()
  set iconPosition(position: IconPosition) {
    this.iconPos = position;
  }

  @Input()
  set icon(icon: IconProp) {
    this.inputIcon = icon;
  }

  get iconClass(): string {
    let res = this.iconPos as string;
    if (this.iconClick.observers.length) {
      res += ' btn';
    }
    return res;
  }

  @Output() iconClick = new EventEmitter<MouseEvent>();

  emitClick(args: MouseEvent): void {
    this.iconClick.emit(args);
  }

  onChange: (value: Event) => void = () => { };

  onTouched: (value: Event) => void = () => { };

  constructor() { }

  writeValue(value: string): void {
    this.inputValue = value;
  }

  registerOnChange(fn: (value: Event) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (value: Event) => void): void {
    this.onTouched = fn;
  }
}
