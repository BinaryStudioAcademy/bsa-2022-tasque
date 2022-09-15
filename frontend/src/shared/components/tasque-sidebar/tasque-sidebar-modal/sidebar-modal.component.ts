import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
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

  @Output() sidebarToggle = new EventEmitter<boolean>();

  constructor(private sideBarService: SideBarService) {}

  ngOnInit(): void {
    this.sideBarService.change.subscribe((name: string) => {
      if (name == this.name) this.isOpen = !this.isOpen;
    });
  }

  open(): void {
    this.toogle(true);
    this.sideBarService.toggle(this.name);
  }
  close(): void {
    this.toogle(false);
    this.sideBarService.toggle(this.name);
  }

  toogle(value: boolean) {
    this.sidebarToggle.emit(value);
  }
}
