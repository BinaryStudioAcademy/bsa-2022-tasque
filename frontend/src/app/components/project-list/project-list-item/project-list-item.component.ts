import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.sass']
})
export class ProjectListItemComponent implements OnInit {

  @Input()
  public projectName: string;

  constructor() { }

  ngOnInit(): void {
  }

}
