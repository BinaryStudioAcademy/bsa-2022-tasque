import { Component, OnInit } from '@angular/core';
import { ProjectCardModel } from 'src/core/models/your-work/project-card-model';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';
import { ProjectService } from 'src/core/services/project.service';

@Component({
  selector: 'app-your-work',
  templateUrl: './your-work.component.html',
  styleUrls: ['./your-work.component.sass']
})
export class YourWorkComponent implements OnInit {

  constructor(private projectService: ProjectService, private userIdService: GetCurrentUserService) { }
  public projectCards: ProjectCardModel[];
  public userId = 0;
  colors = ['#D47500', '#00AA55', '#E3BC01', '#009FD4', '#B281B3', '#D47500', '#DC2929'];

  ngOnInit(): void {
    this.userId = this.userIdService.getUserId();
    this.projectService.getProjectCards().subscribe(
      (res) => {
        if(res.body) {
          this.projectCards = res.body;
          this.generateColors();
        }        
      }
    );    
  }

  private generateColors(): void {
    this.projectCards.forEach(card => {
      if(!card.color) {
        card.color = this.colors[card.projectId % this.colors.length];
      }      
    });
  }

}
