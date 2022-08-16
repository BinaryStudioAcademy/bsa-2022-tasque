import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tasque-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.sass'],
})
export class RichTextEditorComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

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
