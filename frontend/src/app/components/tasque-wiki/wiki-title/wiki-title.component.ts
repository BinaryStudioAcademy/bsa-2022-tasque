import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faChevronRight, faCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WikiPageInfo } from 'src/core/models/wiki/wiki-page-info';
import { GetCurrentWikiService } from 'src/core/services/get-current-wiki.service';
import { WikiService } from 'src/core/services/wiki.service';

@Component({
  selector: 'app-wiki-title',
  templateUrl: './wiki-title.component.html',
  styleUrls: ['./wiki-title.component.sass']
})
export class WikiTitleComponent implements OnInit, OnDestroy {

  @Input() childWikiPage: WikiPageInfo;
  @Input() nestedLevel: number;

  public plusIcon: IconDefinition = faPlus;
  public chevronDownIcon: IconDefinition = faChevronDown;
  public circleIcon: IconDefinition = faCircle;
  public chevronRightIcon: IconDefinition = faChevronRight;
  public collapseIcon: IconDefinition = this.chevronRightIcon;

  public showCreate: boolean;
  public isHidden: boolean = true;
  public selected: boolean = false;

  private currentProjectId: number;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private router: Router, 
    private activeRoute: ActivatedRoute,
    private wikiService: WikiService,
    private currentWiki: GetCurrentWikiService
  ) { }

  ngOnInit(): void {
    this.currentProjectId = Number(this.activeRoute.snapshot.paramMap.get('id'));
    this.nestedLevel++;
    this.selected = false;

    if(!this.childWikiPage.nestedPages) {
      this.childWikiPage.nestedPages = [];
    }
    if(this.childWikiPage.nestedPages?.length === 0) {
      this.collapseIcon = this.circleIcon;
    }

    this.currentWiki.wiki$.subscribe((data) => {
      if(data.id === this.childWikiPage.id) {
        this.selected = true;
        this.childWikiPage.name = data.name;
      }
      else {
        this.selected = false;
      }
    });

    this.currentWiki.wikiDel$.subscribe((data) => {
      const index = this.childWikiPage.nestedPages?.findIndex((x) => x.id == data);
      
      if(index && index != -1) {
        this.childWikiPage.nestedPages?.splice(index, 1);
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  createPage(name: string): void {
    this.wikiService.createWikiPage({name: name, projectId: this.currentProjectId, parentPageId: this.childWikiPage.id})
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data) => {
      if(data.body) {
        this.childWikiPage.nestedPages?.push(data.body);
        this.showCreate = false;
        this.isHidden = false;
        this.collapseIcon = this.chevronDownIcon;
      }
    });
  }

  collapse(): void {
    if(this.childWikiPage.nestedPages?.length === 0) {
      this.collapseIcon = this.circleIcon;
      return;
    }

    if(this.isHidden === true) {
      this.isHidden = false;
      this.collapseIcon = this.chevronDownIcon;
      return;
    } else {
      this.isHidden = true;
      this.collapseIcon = this.chevronRightIcon;
      return;
    }
  }

  restrictionCreation(): boolean {
    return this.nestedLevel < 5;
  }

  moveToPage(): void {
    this.router.navigate([`project/${this.currentProjectId}/wiki/${this.childWikiPage.id}`]);
    this.selected = true;
    this.currentWiki.setWiki(this.childWikiPage);
  }
}
