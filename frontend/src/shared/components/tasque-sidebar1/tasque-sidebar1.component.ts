import { Component, Input, OnInit } from '@angular/core';
import { SideBarService } from 'src/core/services/sidebar.service';

@Component({
  selector: 'app-tasque-sidebar',
  templateUrl: './tasque-sidebar1.component.html',
  styleUrls: ['./tasque-sidebar1.component.sass'],
})
export class TasqueSidebar1Component implements OnInit {
  constructor(public sidebarService: SideBarService) {}
  @Input() public name = '';

  openSidebar(): void {
    this.sidebarService.toggle(this.name);
  }
  ngOnInit(): void {}
}
