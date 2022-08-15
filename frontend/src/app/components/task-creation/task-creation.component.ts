import { Component, OnInit } from '@angular/core';
import { SideBarService } from 'src/core/services/sidebar.service';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-task-creation',
  templateUrl: './task-creation.component.html',
  styleUrls: ['./task-creation.component.sass'],
})
export class TaskCreationComponent implements OnInit {
  faExpeditedssl = faEllipsisVertical;
  constructor(private sideBarService: SideBarService) {}

  openSidebar(): void {
    this.sideBarService.toggle();
  }

  create(): void {
    console.log('create');
  }

  cancel(): void {
    console.log('cancel');
  }

  importIssues(): void {
    console.log('ImportIssues');
  }

  ngOnInit(): void {}
}
