import { AngularEditorConfig } from '@kolkov/angular-editor';

export const EditorConfig: AngularEditorConfig = {
  editable: true,
  spellcheck: true,

  minHeight: '50px',
  maxHeight: '150px',
  width: '100%',
  minWidth: '100%',
  translate: 'yes',
  enableToolbar: true,
  showToolbar: true,
  placeholder: 'Enter text here...',
  defaultParagraphSeparator: '',
  defaultFontName: '',
  defaultFontSize: 'h1',
  fonts: [
    { class: 'arial', name: 'Arial' },
    { class: 'times-new-roman', name: 'Times New Roman' },
    { class: 'calibri', name: 'Calibri' },
    { class: 'comic-sans-ms', name: 'Comic Sans MS' },
  ],
  customClasses: [
    {
      name: 'quote',
      class: 'quote',
    },
    {
      name: 'redText',
      class: 'redText',
    },
    {
      name: 'titleText',
      class: 'titleText',
      tag: 'h1',
    },
  ],
  toolbarHiddenButtons: [
    [
      'strikeThrough',
      'subscript',
      'superscript',
      'fontSize',
      'textColor',
      'backgroundColor',
      'customClasses',
      'link',
      'unlink',
      'insertImage',
      'insertVideo',
      'insertHorizontalRule',
      'removeFormat',
      'toggleEditorMode',
      'fontName',
    ],
  ],
};
