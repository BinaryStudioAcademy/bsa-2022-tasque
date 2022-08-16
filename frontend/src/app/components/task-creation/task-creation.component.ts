import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { SideBarService } from 'src/core/services/sidebar.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-task-creation',
  templateUrl: './task-creation.component.html',
  styleUrls: ['./task-creation.component.sass'],
})
export class TaskCreationComponent implements OnInit {
  constructor(
    private sideBarService: SideBarService,
    @Inject(DOCUMENT) private document: Document,
  ) {}

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
    console.log(this.description);
  }

  @ViewChild('editor') editor: any;
  description: string = '';
  setStyle(style: string) {
    let bool = document.execCommand(style, false);
  }

  onChange() {
    console.log(this.editor.nativeElement['innerHTML']);
  }

  public undo(): void {
    document.execCommand('undo');
  }

  public redo(): void {
    document.execCommand('redo');
  }

  public setList(style: string): void {
    document.execCommand(style, false, 'NewUL');
  }

  public setfontSize(value: string): void {
    document.execCommand('fontSize', true, value);
  }

  ngOnInit(): void {}
}
