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

  public inputWidth = 300;
  public inputBorderRadius = 10;

  public inputClass = '';
  public inputType = 'text';
  public inputValue = ''; 
  public inputLabel = '';
  public inputPlaceholder = '';

  public inputErrorMessage = 'error';
  public inputValueisError = false;

  @Input() value: string;

  @Input()
  set type(typeName: string) {
    this.inputType = typeName;
  }
  get type(): string {
    return this.inputType;
  }

  @Input()
  set width(width: number){
    this.inputWidth = width;
  }
  get width(): number{
    return this.inputWidth;
  }

  @Input()
  set borderRadius(raduis: number){
    this.inputBorderRadius = raduis;
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
    this.inputValueisError = hasError;
  }
  get invalid(): boolean {
    return this.inputValueisError;
  }

  @Input()
  set errorMessage(message: string) {
    this.inputErrorMessage = message;
  }
  get errorMessage(): string {
    return this.inputErrorMessage;
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() { }

  writeValue(value: string): void {
    this.inputValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
}
