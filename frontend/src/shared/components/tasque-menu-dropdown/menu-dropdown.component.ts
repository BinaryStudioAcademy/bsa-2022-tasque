import { Component, HostListener, Input, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'tasque-menu-dropdown',
  templateUrl: './menu-dropdown.component.html',
  styleUrls: ['./menu-dropdown.component.sass'],
})
export class MenuDropdownComponent implements OnInit {

  @Input() public downArrowIcon = faChevronDown;  // Down State of the arrow (applies when dropdown is not expanded)

  @Input() public upArrowIcon = faChevronUp; // Up State of the arrow (applies when dropdown is expanded)

  public currentArrowIcon: IconProp;

  @Input() toggleDropdownOnButtonClick = true;

  @Input() separator?: string; // just a text between button and arrow
  @Input() toggleDropdownOnSeparatorClick = false;

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

      if (this.currentArrowIcon === this.upArrowIcon) {
        this.currentArrowIcon = this.downArrowIcon;
      }
    }
    this.wasInside = false;
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

  public arrowIconClick(): void {
    this.toggleDropdown();
  }

  public buttonClick(): void {
    if (this.toggleDropdownOnButtonClick) {
      this.toggleDropdown();
    }
    else {
      if (this.expanded) {
        this.toggleDropdown();
      }
    }
  }
}

