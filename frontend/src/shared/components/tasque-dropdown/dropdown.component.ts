import {
  Component,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface TasqueDropdownOption {
  color: string;
  title: string;
  id: number;
}

@Component({
  selector: 'tasque-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DropdownComponent),
    },
  ],
})
export class DropdownComponent implements OnInit, ControlValueAccessor {
  public dropdownErrorMessage = 'error';
  public dropdownValueIsError = false;
  @Input() public options: TasqueDropdownOption[] = [
    {
      color: 'red',
      title: 'Development',
      id: 0,
    },
    {
      color: '#F6F7F9',
      title: 'Feature',
      id: 1,
    },
  ];
  @Input() public label = '';
  @Input() public width = '300px';
  @Input() public optionsWidth: string;
  @Input() public placeholder = '';
  @Input() public autoSelect = false;
  @Input() public dropBelow = true;

  @Input()
  set invalid(hasError: boolean) {
    this.dropdownValueIsError = hasError;
  }
  get invalid(): boolean {
    return this.dropdownValueIsError;
  }

  @Input()
  set errorMessage(message: string) {
    this.dropdownErrorMessage = message;
  }
  @Output() onSelect = new EventEmitter<number>();

  onChange: (value: TasqueDropdownOption) => void = () => {};
  onTouched: (value: TasqueDropdownOption) => void = () => {};

  public selectedOption: TasqueDropdownOption | undefined = undefined;
  public expanded = false;

  private wasInside = false;

  @HostListener('click')
  clickInside(): void {
    this.wasInside = true;
  }

  @HostListener('document:click')
  clickOutside(): void {
    if (!this.wasInside) {
      this.expanded = false;
    }
    this.wasInside = false;
  }

  constructor() {}

  writeValue(option: TasqueDropdownOption): void {
    this.selectedOption = option;
  }

  registerOnChange(fn: (value: TasqueDropdownOption) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (value: TasqueDropdownOption) => void): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {
    if (this.autoSelect) {
      this.select(this.options[0]);
    }
  }

  public toggleDropdown(): void {
    this.expanded = !this.expanded;
  }

  public select(option: TasqueDropdownOption): void {
    this.onChange(option);

    if (this.selectedOption != option) {
      this.selectedOption = option;
      this.onSelect.emit(this.selectedOption.id);
    }
    this.expanded = false;
  }

  public setStyles() {
    if (this.dropBelow) {
      return {
        width: this.optionsWidth,
        top: '100%',
      };
    }
    return {
      width: this.optionsWidth,
      bottom: '100%',
    };
  }
}
