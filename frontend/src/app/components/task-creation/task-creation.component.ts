import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { SideBarService } from 'src/core/services/sidebar.service';
import {
  faEllipsisVertical,
  faBold,
  faItalic,
  faUnderline,
  faFont,
  faAlignRight,
  faAlignLeft,
  faAlignCenter,
  faAlignJustify,
  faList,
  faList12,
  faIndent,
  faOutdent,
  faReply,
  faShare,
  faSortDown,
  faUpLong,
  faDownLong,
} from '@fortawesome/free-solid-svg-icons';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-task-creation',
  templateUrl: './task-creation.component.html',
  styleUrls: ['./task-creation.component.sass'],
})
export class TaskCreationComponent implements OnInit {
  faExpeditedssl = faEllipsisVertical;
  faBold = faBold;
  faItalic = faItalic;
  faFont = faFont;
  faAlignRight = faAlignRight;
  faAlignLeft = faAlignLeft;
  faAlignCenter = faAlignCenter;
  faAlignJustify = faAlignJustify;
  faList = faList;
  faList12 = faList12;
  faIndent = faIndent;
  faOutdent = faOutdent;
  faReply = faReply;
  faShare = faShare;
  faUnderline = faUnderline;
  faSortDown = faSortDown;
  faUpLong = faUpLong;
  faDownLong = faDownLong;

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
