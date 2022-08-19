import { Component } from '@angular/core';
import { SideBarService } from 'src/core/services/sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'tasque';

  constructor(public sidebarService: SideBarService) {}

  openSidebar(name: string): void {
    this.sidebarService.toggle(name);
  }
}
