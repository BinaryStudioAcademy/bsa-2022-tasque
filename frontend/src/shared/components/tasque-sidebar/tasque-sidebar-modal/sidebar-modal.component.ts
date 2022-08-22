import { Component, HostBinding, Input } from '@angular/core';
import { SideBarService } from 'src/core/services/sidebar.service';

@Component({
  selector: 'tasque-sidebar-modal',
  templateUrl: './sidebar-modal.component.html',
  styleUrls: ['./sidebar-modal.component.sass'],
})
export class TasqueSideBarModalComponent {
  @HostBinding('class.is-open')
  isOpen = false;
  @Input() public name = '';
  constructor(private sideBarService: SideBarService) {}

  ngOnInit(): void {
    this.sideBarService.change.subscribe((name: string) => {
      if (name == this.name) this.isOpen = !this.isOpen;
    });
  }

  open(): void {
    this.sideBarService.toggle(this.name);
  }
  close(): void {
    this.sideBarService.toggle(this.name);
  }
}
