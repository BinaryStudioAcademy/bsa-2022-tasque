import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCircleArrowLeft, faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { WikiPage } from 'src/core/models/wiki/wikiPage';

@Component({
  selector: 'wiki-left-sidebar',
  templateUrl: './wiki-left-sidebar.component.html',
  styleUrls: ['./wiki-left-sidebar.component.sass']
})
export class WikiLeftSidebarComponent implements OnInit {

  public backIcon: IconDefinition = faCircleArrowLeft;
  public plusIcon: IconDefinition = faPlus;
  
  public pageList: WikiPage[] = [];
  public showCreate: boolean;

  private currentProjectId: number;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  backToProject(): void {
    this.router.navigate([`project/${this.currentProjectId}/board`]);
  }

  createBasePage(name: string): void {
    this.pageList.push({name: name});
    this.showCreate = false;
  }

}
