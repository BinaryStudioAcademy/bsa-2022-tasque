import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.sass']
})
export class DropdownComponent implements OnInit {
  @Input() public options: [color:string, title:string, id:number][] = [["red", "Bug", 0], ["blue", "Feature", 1]];
  @Input() public label: string = "";

 // @Output() dropdownSelect = new EventEmitter();
  
  public selectedOption : [string, string, number] = this.options[0];
  public expanded : boolean = false;
  constructor() { 
  }

  ngOnInit(): void {
    this.selectedOption = this.options[0];
  }

  public dropdownOpen() 
  {
    this.expanded = true;
  }

  public select(option: [string, string, number])
  {
    this.selectedOption = option;
    this.expanded = false;
  }

}
