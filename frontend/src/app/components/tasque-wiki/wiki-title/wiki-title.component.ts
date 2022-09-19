import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faChevronRight, faCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { WikiPageInfo } from 'src/core/models/wiki/wiki-page-info';
import { WikiService } from 'src/core/services/wiki.service';

@Component({
  selector: 'app-wiki-title',
  templateUrl: './wiki-title.component.html',
  styleUrls: ['./wiki-title.component.sass']
})
export class WikiTitleComponent implements OnInit {

  @Input() childWikiPage: WikiPageInfo;

  public plusIcon: IconDefinition = faPlus;
  public chevronDownIcon: IconDefinition = faChevronDown;
  public circleIcon: IconDefinition = faCircle;
  public chevronRightIcon: IconDefinition = faChevronRight;
  public collapseIcon: IconDefinition = this.chevronRightIcon;

  public showCreate: boolean;
  public isHidden: boolean = true;

  private currentProjectId: number;

  constructor(
    private router: Router, 
    private activeRoute: ActivatedRoute,
    private wikiService: WikiService
  ) { }

  ngOnInit() {
    if(!this.childWikiPage.nestedPages) {
      this.childWikiPage.nestedPages = [];
    }
    if(this.childWikiPage.nestedPages?.length === 0) {
      this.collapseIcon = this.circleIcon;
      return;
    }

    this.currentProjectId = Number(this.activeRoute.snapshot.paramMap.get('id'));
  }

  createPage(name: string): void {
    this.wikiService.createWikiPage({name: name, projectId: this.currentProjectId, parentPageId: this.childWikiPage.id})
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
    return this.childWikiPage.nestedPages?.length != 5;
  }

  moveToPage(): void {
    this.router.navigate([`project/${this.currentProjectId}/wiki/${this.childWikiPage.name}`]);
  }
}
