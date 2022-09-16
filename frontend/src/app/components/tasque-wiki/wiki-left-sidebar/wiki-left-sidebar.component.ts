import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faCircleArrowLeft, faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'wiki-left-sidebar',
  templateUrl: './wiki-left-sidebar.component.html',
  styleUrls: ['./wiki-left-sidebar.component.sass']
})
export class WikiLeftSidebarComponent implements OnInit {

  public backIcon: IconDefinition = faCircleArrowLeft;
  public plusIcon: IconDefinition = faPlus;

  private currentProjectId: number;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.currentProjectId = Number(this.activeRoute.snapshot.paramMap.get('id'));
  }

  backToProject(): void {
    this.router.navigate([`project/${this.currentProjectId}/board`]);
  }

  openPage(name: string): void {
    this.router.navigate([`project/${this.currentProjectId}/wiki/${name}`]);
  }
}
