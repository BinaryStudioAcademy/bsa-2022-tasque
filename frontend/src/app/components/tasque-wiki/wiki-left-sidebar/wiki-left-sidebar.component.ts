import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faCircleArrowLeft, faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { WikiPageInfo } from 'src/core/models/wiki/wiki-page-info';
import { GetCurrentWikiService } from 'src/core/services/get-current-wiki.service';
import { WikiService } from 'src/core/services/wiki.service';

@Component({
  selector: 'wiki-left-sidebar',
  templateUrl: './wiki-left-sidebar.component.html',
  styleUrls: ['./wiki-left-sidebar.component.sass']
})
export class WikiLeftSidebarComponent implements OnInit {

  public backIcon: IconDefinition = faCircleArrowLeft;
  public plusIcon: IconDefinition = faPlus;
  
  public pageList: WikiPageInfo[] = [];
  public showCreate: boolean;

  private currentProjectId: number;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private wikiService: WikiService,
    private currentWiki: GetCurrentWikiService
  ) { }

  ngOnInit() {
    this.currentProjectId = Number(this.activeRoute.snapshot.paramMap.get('id'));

    this.wikiService.getProjectWiki(this.currentProjectId).subscribe((data) => {
      if(data.body) {
        this.pageList = data.body;
        this.router.navigate([`project/${this.currentProjectId}/wiki/${this.pageList[0].name}`]);
        this.currentWiki.setWiki(this.pageList[0]);
      }
    });
  }

  backToProject(): void {
    this.router.navigate([`project/${this.currentProjectId}/board`]);
  }

  createBasePage(name: string): void {
    this.wikiService.createWikiPage({name: name, projectId: this.currentProjectId})
    .subscribe((data) => {
      if(data.body) {
        this.pageList.push(data.body);
        this.showCreate = false;
      }
    });
  }

}
