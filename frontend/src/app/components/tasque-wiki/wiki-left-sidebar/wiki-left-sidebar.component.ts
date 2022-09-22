import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faCircleArrowLeft, faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WikiPageInfo } from 'src/core/models/wiki/wiki-page-info';
import { GetCurrentWikiService } from 'src/core/services/get-current-wiki.service';
import { WikiService } from 'src/core/services/wiki.service';

@Component({
  selector: 'wiki-left-sidebar',
  templateUrl: './wiki-left-sidebar.component.html',
  styleUrls: ['./wiki-left-sidebar.component.sass']
})
export class WikiLeftSidebarComponent implements OnInit, OnDestroy {

  public backIcon: IconDefinition = faCircleArrowLeft;
  public plusIcon: IconDefinition = faPlus;
  
  private colors = ['#D47500', '#00AA55', '#E3BC01', '#009FD4', '#B281B3', '#D47500', '#DC2929'];
  public rColor: string;

  private currentProjectId: number;
  public pageList: WikiPageInfo[] = [];
  public showCreate: boolean;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private wikiService: WikiService,
    private currentWiki: GetCurrentWikiService
  ) { }

  ngOnInit(): void {
    this.currentProjectId = Number(this.activeRoute.snapshot.paramMap.get('id'));
    this.rColor = this.randomColor();

    this.wikiService.getProjectWiki(this.currentProjectId)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data) => {
      if(data.body && data.body.length !== 0) {
        this.pageList = data.body;
        this.currentWiki.setWiki(this.pageList[0]);
        this.router.navigate([`project/${this.currentProjectId}/wiki/${this.pageList[0].id}`]);
      }
    });

    this.currentWiki.wikiDel$.subscribe((data) => {
      const index = this.pageList.findIndex((x) => x.id == data);

      if(index && index != -1) {
        this.pageList.splice(index, 1);
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  randomColor(): string {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  backToProject(): void {
    this.router.navigate([`project/${this.currentProjectId}/board`]);
  }

  createBasePage(name: string): void {
    this.wikiService.createWikiPage({name: name, projectId: this.currentProjectId})
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data) => {
      if(data.body) {
        this.pageList.push(data.body);
        this.showCreate = false;
      }
    });
  }

}
