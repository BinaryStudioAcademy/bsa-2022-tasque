import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { UserModel } from 'src/core/models/user/user-model';

@Component({
  selector: 'tasque-menu-dropdown',
  templateUrl: './menu-dropdown.component.html',
  styleUrls: ['./menu-dropdown.component.sass'],
})
export class MenuDropdownComponent implements OnInit {

  @Input() public label?: string; // Main label of the dropdown

  @Input() public downArrowIcon = faChevronDown;  // Down State of the arrow (applies when dropdown is not expanded)

  @Input() public upArrowIcon = faChevronUp; // Up State of the arrow (applies when dropdown is expanded)

  public currentArrowIcon: IconProp;

  @Output() labelClicked = new EventEmitter(); // event that represents click on the dropdown main label
  @Input() toggleDropdownOnLabelClick = true;

  @Input() user: UserModel = { id: 1, name: 'John Doe', email: 'johndoe@gmail.com', avatarURL: 'https://www.w3schools.com/howto/img_avatar.png' }; // url of the avatar
  @Input() diameter_px = 45; // size of the avatar

  @Input() public hasAvatar = false; // state of the avatar visibility
  @Output() avatarClicked = new EventEmitter(); // click on the avatar

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
}
