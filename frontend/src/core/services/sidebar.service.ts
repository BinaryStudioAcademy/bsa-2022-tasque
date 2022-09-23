import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class SideBarService {
  @Output() change: EventEmitter<string> = new EventEmitter();

  toggle(name: string): void {
    this.change.emit(name);
  }
}
