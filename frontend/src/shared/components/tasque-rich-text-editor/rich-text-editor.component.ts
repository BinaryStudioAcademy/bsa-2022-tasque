import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
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

@Component({
  selector: 'tasque-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.sass'],
})
export class RichTextEditorComponent implements OnInit {
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

  constructor() {}
  description: string = '';
  @ViewChild('editor') editor: any;

  @Input() value: any;
  @Output() valueChange = new EventEmitter();

  ngOnInit(): void {}

  onInput(newValue: string) {
    this.valueChange.emit(newValue);
  }

  setStyle(style: string) {
    document.execCommand(style, false);
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
}
