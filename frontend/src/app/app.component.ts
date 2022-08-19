import { Component } from '@angular/core';
import { SideBarService } from 'src/core/services/sidebar.service';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'tasque';
  faGithub = faGithub;

  constructor(public sidebarService: SideBarService) {}

  openSidebar(name: string): void {
    this.sidebarService.toggle(name);
  }
}
