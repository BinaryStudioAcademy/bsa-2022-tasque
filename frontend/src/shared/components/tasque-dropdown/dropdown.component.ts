import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'tasque-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.sass']
})
export class DropdownComponent implements OnInit {
  @Input() public options: [color:string, title:string, id:number][] = [];
  @Input() public label: string = "";
  @Input() public width : string = "300px";
  @Input() public placeholder : string = "";
  @Input() public autoSelect : boolean = false;

  @Output() onSelect = new EventEmitter<number>();
  
  public selectedOption : [color:string, title:string, id:number] | undefined = undefined;
  public expanded : boolean = false;
  
  constructor() { 
  }

  ngOnInit(): void {
    if (this.autoSelect)
    {
      this.select(this.options[0]);
    }   
  }

  public toggleDropdown() : void
  {
    this.expanded = !this.expanded;
  }

  public select(option: [string, string, number]) : void
  {
    if (this.selectedOption != option)
    {
      this.selectedOption = option;
      this.onSelect.emit(this.selectedOption[2]);
    }
    this.expanded = false;
  }

}
