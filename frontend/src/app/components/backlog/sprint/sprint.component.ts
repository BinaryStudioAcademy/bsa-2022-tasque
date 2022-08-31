import { Component, Input, OnInit } from '@angular/core';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { SprintModel } from 'src/core/models/sprint/sprint-model';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.sass'],
})
export class SprintComponent implements OnInit {
  @Input() public sprint: SprintModel;

  constructor() {}

  faEllipsisV = faEllipsisV;
  ngOnInit(): void {
    console.log(this.sprint);
  }
}
