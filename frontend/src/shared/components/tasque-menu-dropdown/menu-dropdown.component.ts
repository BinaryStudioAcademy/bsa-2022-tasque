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

  @Input() public label?: string; // Main label of the dropdown

  @Input() public downArrowIcon = faChevronDown;  // Down State of the arrow (applies when dropdown is not expanded)

  @Input() public upArrowIcon = faChevronUp; // Up State of the arrow (applies when dropdown is expanded)

  public currentArrowIcon: IconProp;

  @Input() public options: MenuDropdownOption[]; // input data
  public selectedOption: MenuDropdownOption;

  @Output() labelClicked = new EventEmitter(); // event that represents click on the dropdown main label
  @Input() toggleDropdownOnLabelClick = true;

  @Input() user = { id: 1, name: 'John Doe', email: 'johndoe@gmail.com' } // url of the avatar
  @Input() diameter_px = 45; // size of the avatar

  @Input() public hasAvatar = false; // state of the avatar visibility
  @Output() avatarClicked = new EventEmitter(); // click on the avatar

  @Input() headerLabel: string; // text of the top label in the options container. Pass it to see this option 
  @Input() footerLabel: string; // text of the bottom label in the options container. Pass it to see this option 
  @Output() headerClicked = new EventEmitter(); // click on the top label
  @Output() footerClicked = new EventEmitter(); // click on the bottom label

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

      if (this.currentArrowIcon === this.upArrowIcon) {
        this.currentArrowIcon = this.downArrowIcon;
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

  ngOnInit(): void {
    this.currentArrowIcon = this.downArrowIcon;
  }

  public toggleDropdown(): void {
    this.expanded = !this.expanded;

    if (this.expanded) {
      this.currentArrowIcon = this.upArrowIcon;
    }
    else {
      this.currentArrowIcon = this.downArrowIcon;
    }
  }

  public select(option: MenuDropdownOption): void {
    this.onChange(option);

    if (this.selectedOption != option) {
      this.selectedOption = option;
    }

    this.expanded = false;
    if (this.currentArrowIcon === this.upArrowIcon) {
      this.currentArrowIcon = this.downArrowIcon;
    }
  }

  public labelClick(): void {
    if (this.toggleDropdownOnLabelClick) {
      this.toggleDropdown();
    }

    this.labelClicked.emit();
  }

  public arrowIconClick(): void {
    this.toggleDropdown();
  }

  public avatarClick(): void {
    this.avatarClicked.emit();
    this.toggleDropdown();
  }

  public headerClick(): void {
    this.headerClicked.emit();
    this.toggleDropdown();
  }

  public footerClick(): void {
    this.footerClicked.emit();
    this.toggleDropdown();
  }
}
