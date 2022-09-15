import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { SideBarService } from 'src/core/services/sidebar.service';

@Component({
  selector: 'tasque-sidebar',
  templateUrl: './tasque-sidebar.component.html',
  styleUrls: ['./tasque-sidebar.component.sass'],
})
export class TasqueSidebarComponent implements OnInit {
  constructor(public sidebarService: SideBarService) {}
  @Input() public name = '';
  @Input() public btnClass = 'btn mini';
  @Input() public btnText = '';
  @Input() public btnIcon?: IconProp = undefined;

  @Output() sidebarToggle = new EventEmitter<boolean>();

  openSidebar(): void {
    this.sidebarToggle.emit(true);
    this.sidebarService.toggle(this.name);
  }
  ngOnInit(): void {
    if (this.name === '') {
      throw new Error('Attribute name is required');
    }
  }

  toggle(value: boolean) {
    this.sidebarToggle.emit(value);
  }
}
