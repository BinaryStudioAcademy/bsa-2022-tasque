import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class SideBarService {
  isOpen = false;

  @Output() change: EventEmitter<string> = new EventEmitter();

  toggle(name: string): void {
    this.isOpen = !this.isOpen;
    this.change.emit(name);
  }
}
