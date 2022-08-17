import { Component, OnInit } from '@angular/core';
import { SideBarService } from 'src/core/services/sidebar.service';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-creation',
  templateUrl: './task-creation.component.html',
  styleUrls: ['./task-creation.component.sass'],
})
export class TaskCreationComponent implements OnInit {
  faExpeditedssl = faEllipsisVertical;
  taskCreateForm: FormGroup;

  constructor(private sideBarService: SideBarService) {}

  openSidebar(): void {
    this.sideBarService.toggle();
  }

  create(): void {
    console.log('create');
    console.warn(this.taskCreateForm.value);
  }

  cancel(): void {
    console.log('cancel');
  }

  onSubmit() {
    console.log(this.taskCreateForm.value);
  }

  ngOnInit(): void {
    this.taskCreateForm = new FormGroup({
      project: new FormControl(''),
      issueType: new FormControl(''),
      summary: new FormControl('', Validators.required),
      description: new FormControl(''),
    });
  }

  importIssues(): void {}

  onChange() {}
}
