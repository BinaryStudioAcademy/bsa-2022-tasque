import { Component, HostBinding, Input } from '@angular/core';
import { SideBarService } from 'src/core/services/sideBar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass'],
})
export class SideBarComponent {
  @HostBinding('class.is-open')
  isOpen = false;

  constructor(private sideBarService: SideBarService) {}

  ngOnInit() {
    this.sideBarService.change.subscribe((isOpen: boolean) => {
      this.isOpen = isOpen;
    });
  }

  close() {
    this.sideBarService.toggle();
  }
}
