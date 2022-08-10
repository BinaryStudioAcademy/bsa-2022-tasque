import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.sass']
})
export class DropdownComponent implements OnInit {
  @Input() public options: [color:string, title:string, id:number][] = [["#F8A70B", "Development", 0], ["#F6F7F9", "Feature", 1]];
  @Input() public label: string = "";
  @Input() public width : string = "300px";

 // @Output() dropdownSelect = new EventEmitter();
  
  public selectedOption : [string, string, number] = this.options[0];
  public expanded : boolean = false;
  

  constructor() { 
  }

  ngOnInit(): void {
    this.selectedOption = this.options[0];
  }

  public toggleDropdown() : void
  {
    this.expanded = !this.expanded;
  }

  public select(option: [string, string, number]) : void
  {
    this.selectedOption = option;
    this.expanded = false;
  }

}
