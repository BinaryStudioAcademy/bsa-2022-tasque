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

  @Input() public buttonIcon?: IconProp;

  @Input() public downArrowIcon = faChevronDown;

  @Input() public upArrowIcon = faChevronUp;

  public currentArrowIcon: IconProp;

  @Input() public options: MenuDropdownOption[];
  public selectedOption: MenuDropdownOption;

  @Output() labelClicked = new EventEmitter();
  @Input() toggleDropdownOnLabelClick = true;

  @Input() avatarUrl = '\\assets\\avatar.png';
  @Input() diameter_px = 45;

  @Input() public hasAvatar = false;
  @Output() avatarClicked = new EventEmitter();

  @Input() headerLabel: string;
  @Input() footerLabel: string;
  @Output() headerClicked = new EventEmitter();
  @Output() footerClicked = new EventEmitter();

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

  public buttonIconClick(): void {
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

  public setFooterClasses(): string {
    if (this.options.length > 0) {
      return '';
    }
    return 'solo';
  }
}
