import { Component, HostBinding } from '@angular/core';
import { SideBarService } from 'src/core/services/sidebar.service';

@Component({
  selector: 'tasque-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass'],
})
export class SideBarComponent {
  @HostBinding('class.is-open')
  isOpen = false;

  constructor(private sideBarService: SideBarService) {}

  ngOnInit(): void {
    this.sideBarService.change.subscribe((isOpen: boolean) => {
      this.isOpen = isOpen;
    });
  }

  close(): void {
    this.sideBarService.toggle();
  }
}