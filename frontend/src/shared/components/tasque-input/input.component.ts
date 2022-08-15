import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'tasque-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputComponent)
    }
  ]
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

  @Input() value: string;

  @Input()
  set type(typeName: string) {
    this.inputType = typeName;
  }
  get type(): string {
    return this.inputType;
  }

  // @Input()
  // set width(width: number){
  //   this.inputWidth = width;
  // }
  // get width(): number{
  //   return this.inputWidth;
  // }

  @Input()
  set borderRadius(radius: number){
    this.inputBorderRadius = radius;
  }
  get borderRadius(): number{
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

  onChange: (value: Event) => void = () => {};
  onTouched: (value: Event) => void = () => {};

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
