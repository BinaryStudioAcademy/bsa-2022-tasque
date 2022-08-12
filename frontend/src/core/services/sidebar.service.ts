import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class SideBarService {
  isOpen = false;

  @Output() change: EventEmitter<boolean> = new EventEmitter();

  toggle(): void {
    this.isOpen = !this.isOpen;
    this.change.emit(this.isOpen);
  }
}
