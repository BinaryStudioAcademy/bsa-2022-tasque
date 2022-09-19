import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faChevronRight, faCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { WikiPage } from 'src/core/models/wiki/wikiPage';

@Component({
  selector: 'app-wiki-title',
  templateUrl: './wiki-title.component.html',
  styleUrls: ['./wiki-title.component.sass']
})
export class WikiTitleComponent implements OnInit {

  @Input() childWikiPage: WikiPage;

  public plusIcon: IconDefinition = faPlus;
  public chevronDownIcon: IconDefinition = faChevronDown;
  public circleIcon: IconDefinition = faCircle;
  public chevronRightIcon: IconDefinition = faChevronRight;
  public collapseIcon: IconDefinition = this.chevronDownIcon;

  public showCreate: boolean;
  public isExpanded: boolean;

  private currentProjectId: number;

  constructor(
    private router: Router, 
    private activeRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    if(!this.childWikiPage.nestedPages) {
      this.childWikiPage.nestedPages = [];
      this.collapseIcon = this.circleIcon;
    }

    this.currentProjectId = Number(this.activeRoute.snapshot.paramMap.get('id'));
  }

  createPage(name: string): void {
    this.childWikiPage.nestedPages?.push({name: name});
    this.showCreate = false;
    this.collapseIcon = this.chevronDownIcon;
    this.isExpanded = true;
  }

  collapse(): void {
    if(this.childWikiPage.nestedPages?.length === 0) {
      this.collapseIcon = this.circleIcon;
      return;
    }
    if(this.isExpanded) {
      this.isExpanded = false;
      this.collapseIcon = this.chevronRightIcon;
      return;
    }

    this.isExpanded = true;
    this.collapseIcon = this.chevronDownIcon;
  }

  restrictionCreation(): boolean {
    return this.childWikiPage.nestedPages?.length != 5;
  }

  moveToPage(): void {
    this.router.navigate([`project/${this.currentProjectId}/wiki/${this.childWikiPage.name}`]);
  }
}
