import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'input-component',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.sass']
})
export class InputComponent implements OnInit {
  public inputWidth = 100;
  public inputBorderRadius = 5;
  public inputClass = 'input';
  public inputType = 'text';
  public inputText = ''; 
  public inputLabel = '';
  public inputPlaceholder = '';
  public inputErrorMessage = 'error';
  public inputValueisError = false;

  @Input()
  set type(typeName: string) {
    this.inputType = typeName;
  }
  get type(): string {
    return this.inputType;
  }

  @Input()
  set value(text: string) {
    this.inputText = text;
  }
  get value(): string {
    return this.inputText;
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
  set isValid(hasError: boolean) {
    this.inputValueisError = !hasError;
  }
  get isValid(): boolean {
    return this.inputValueisError;
  }

  @Input()
  set errorMessage(message: string) {
    this.inputErrorMessage = message;
  }
  get(): string {
    return this.inputErrorMessage;
  }

  constructor() { }

  ngOnInit() {
  }

}
