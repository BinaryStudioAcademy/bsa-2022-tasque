import { Component, OnInit } from '@angular/core';
import { ProjectCardModel } from 'src/core/models/your-work/project-card-model';

@Component({
  selector: 'app-your-work',
  templateUrl: './your-work.component.html',
  styleUrls: ['./your-work.component.sass']
})
export class YourWorkComponent implements OnInit {

  constructor() { }
  public projectCards: ProjectCardModel[] = [
    { projectId: 1, title: 'Project 1', color: '', assignedIssuesCount: 2, allIssuesCount: 4 } as ProjectCardModel,
    { projectId: 2, title: 'Project 2', color: '', assignedIssuesCount: 2, allIssuesCount: 4 } as ProjectCardModel,
    { projectId: 3, title: 'Project with very long name', color: '', assignedIssuesCount: 2, allIssuesCount: 4 } as ProjectCardModel,
    { projectId: 4, title: 'Project 4', color: '', assignedIssuesCount: 2, allIssuesCount: 4 } as ProjectCardModel,
  ];
  public userId = 1;
  colors = ['#D47500', '#00AA55', '#E3BC01', '#009FD4', '#B281B3', '#D47500', '#DC2929'];

  ngOnInit(): void {
    this.generateColors();
  }

  private generateColors(): void {
    this.projectCards.forEach(card => {
      if(!card.color) {
        card.color = this.colors[card.projectId % this.colors.length];
      }      
    });
  }

}
