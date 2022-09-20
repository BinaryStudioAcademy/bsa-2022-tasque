import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { WikiPageInfo } from 'src/core/models/wiki/wiki-page-info';
import { GetCurrentWikiService } from 'src/core/services/get-current-wiki.service';

@Component({
  selector: 'wiki-page',
  templateUrl: './wiki-page.component.html',
  styleUrls: ['./wiki-page.component.sass']
})
export class WikiPageComponent implements OnInit {

  public editIcon: IconDefinition = faPenToSquare;
  public wikiPage: WikiPageInfo;

  public pageName: string = 'Page Name';
  public pageText?: string = '';

  public pageForm: FormGroup = new FormGroup({});
  public pageNameControl: FormControl;
  public pageTextControl: FormControl;

  constructor(private currentWikiService: GetCurrentWikiService) {
    this.pageNameControl = new FormControl(this.pageName, [
      Validators.required,
    ]);
    this.pageTextControl = new FormControl(this.pageText, [

    ]);
  }

  ngOnInit(): void {
    this.currentWikiService.wiki$.subscribe((data) => {
      this.wikiPage = data;
      this.pageName = this.wikiPage.name;
      this.pageText = this.wikiPage.text;
    });

    this.pageForm = new FormGroup({
      pageNameControl: this.pageNameControl,
      pageTextControl: this.pageTextControl
    });
  }

  public titleContent(event: Event): string {
    const input = event.target as HTMLElement;
    return input.innerText;
  }

  cancel(): void {

  }

  edit(): void {

  }

  save(): void {
    console.log(this.wikiPage);
  }
}
