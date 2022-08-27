import { Component, EventEmitter, forwardRef, HostListener, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

export interface MenuDropdownOption {
  id?: number,
  name: string
}

@Component({
  selector: 'tasque-menu-dropdown',
  templateUrl: './menu-dropdown.component.html',
  styleUrls: ['./menu-dropdown.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MenuDropdownComponent),
    },
  ],
})
export class MenuDropdownComponent implements OnInit, ControlValueAccessor {

  @Input() public label?: string;
  @Input() public buttonIcon?: IconProp = faChevronDown;

  @Input() public options: MenuDropdownOption[];
  public selectedOption: MenuDropdownOption;

  @Output() labelClicked = new EventEmitter();
  @Input() toggleDropdownOnLabelClick = true;

  public expanded = false;
  private wasInside = false;

  onChange: (value: MenuDropdownOption) => void = () => { };
  onTouched: (value: MenuDropdownOption) => void = () => { };

  @HostListener('click')
  clickInside(): void {
    this.wasInside = true;
  }

  @HostListener('document:click')
  clickOutside(): void {
    if (!this.wasInside) {
      this.expanded = false;

      if (this.buttonIcon === faChevronUp) {
        this.buttonIcon = faChevronDown;
      }
    }
    this.wasInside = false;
  }

  writeValue(option: MenuDropdownOption): void {
    this.selectedOption = option;
  }

  registerOnChange(fn: (value: MenuDropdownOption) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (value: MenuDropdownOption) => void): void {
    this.onTouched = fn;
  }

  constructor() { }

  ngOnInit(): void { }

  public toggleDropdown(): void {
    this.expanded = !this.expanded;

    if (this.expanded) {
      this.buttonIcon = faChevronUp;
    }
    else {
      this.buttonIcon = faChevronDown;
    }
  }

  public select(option: MenuDropdownOption): void {
    this.onChange(option);

    if (this.selectedOption != option) {
      this.selectedOption = option;
    }

    this.expanded = false;
    if (this.buttonIcon === faChevronUp) {
      this.buttonIcon = faChevronDown;
    }
  }

  public labelClick(): void {
    if (this.toggleDropdownOnLabelClick) {
      this.toggleDropdown();
    }

    this.labelClicked.emit();
  }

  public iconClick(): void {
    this.toggleDropdown();
  }
}
