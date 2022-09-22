import { AngularEditorConfig } from '@kolkov/angular-editor';

export const WikiEditorConfig: AngularEditorConfig = {
  editable: true,
  spellcheck: true,
  height: 'auto',
  minHeight: '100px',
  maxHeight: '580px',
  width: '100%',
  minWidth: '100%',
  translate: 'yes',
  enableToolbar: true,
  showToolbar: true,
  sanitize: false,
  placeholder: 'Enter text here...',
  defaultParagraphSeparator: '',
  defaultFontName: '',
  defaultFontSize: '',
  fonts: [
    { class: 'arial', name: 'Arial' },
    { class: 'times-new-roman', name: 'Times New Roman' },
    { class: 'calibri', name: 'Calibri' },
    { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    { class: 'nunito', name: 'Nunito' }
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

      'textColor',
      'backgroundColor',
      'customClasses',
      'unlink',
      'insertVideo',
      'insertHorizontalRule',
      'removeFormat',
      'toggleEditorMode',
      'fontName',
      'heading',
    ],
  ],
};
