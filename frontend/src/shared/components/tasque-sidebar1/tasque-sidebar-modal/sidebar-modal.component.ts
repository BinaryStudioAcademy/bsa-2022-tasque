import { Component, HostBinding, Input } from '@angular/core';
import { SideBarService } from 'src/core/services/sidebar.service';

@Component({
  selector: 'tasque-sidebar-modal',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass'],
})
export class SideBarComponent {
  @HostBinding('class.is-open')
  isOpen = false;
  @Input() public name = '';
  constructor(private sideBarService: SideBarService) {}

  ngOnInit(): void {
    this.sideBarService.change.subscribe((isOpen: string) => {
      console.log(isOpen);
      if (isOpen == this.name) this.isOpen = !this.isOpen;
    });
  }

  open(): void {
    this.sideBarService.toggle(this.name);
  }
  close(): void {
    this.sideBarService.toggle(this.name);
  }
}
