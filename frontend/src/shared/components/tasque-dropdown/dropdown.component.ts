import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'tasque-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent implements OnInit, ControlValueAccessor {
  @Input() public options: [color: string, title: string, id: number][] = [
    ['red', 'Development', 0],
    ['#F6F7F9', 'Feature', 1],
  ];
  @Input() public label = '';
  @Input() public width = '300px';
  @Input() public placeholder = '';
  @Input() public autoSelect = false;

  @Output() onSelect = new EventEmitter<number>();
  onChange: (_: any) => {};

  public selectedOption:
    | [color: string, title: string, id: number]
    | undefined = undefined;
  public expanded = false;

  constructor() {}

  writeValue(option: [string, string, number]): void {
    this.selectedOption = option;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    //this.selectedOption = fn;
    //  this.onChange(fn);
  }

  ngOnInit(): void {
    if (this.autoSelect) {
      this.select(this.options[0]);
    }
  }

  public toggleDropdown(): void {
    this.expanded = !this.expanded;
  }

  public select(option: [string, string, number]): void {
    this.onChange(option);

    if (this.selectedOption != option) {
      this.selectedOption = option;
      this.onSelect.emit(this.selectedOption[2]);
    }
    this.expanded = false;
  }
}
