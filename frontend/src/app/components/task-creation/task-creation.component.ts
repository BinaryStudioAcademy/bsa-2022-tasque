import { Component, OnInit } from '@angular/core';
import { SideBarService } from 'src/core/services/sidebar.service';
import {
  faLink,
  faPaperclip,
  faCheckToSlot,
  faShareNodes,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-task-creation',
  templateUrl: './task-creation.component.html',
  styleUrls: ['./task-creation.component.sass'],
})
export class TaskCreationComponent implements OnInit {
  faLink = faLink;
  faPaperclip = faPaperclip;
  faCheckToSlot = faCheckToSlot;
  faShareNodes = faShareNodes;
  constructor(private sideBarService: SideBarService) {}

  openSidebar(): void {
    this.sideBarService.toggle();
  }
  ngOnInit(): void {}
}
