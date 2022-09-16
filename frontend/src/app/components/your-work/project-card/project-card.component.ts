import { Component, Input, OnInit } from '@angular/core';
import { ProjectCardModel } from 'src/core/models/your-work/project-card-model';

@Component({
  selector: 'project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.sass']
})
export class ProjectCardComponent implements OnInit {

  @Input() projectCard: ProjectCardModel;
  @Input() userId: number;
  constructor() { }

  ngOnInit(): void {
  }

}
