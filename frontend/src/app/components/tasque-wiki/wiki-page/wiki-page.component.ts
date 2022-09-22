import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ValidationConstants } from 'src/core/models/const-resources/validation-constraints';
import { WikiPage } from 'src/core/models/wiki/wiki-page';
import { GetCurrentWikiService } from 'src/core/services/get-current-wiki.service';
import { OpenDialogService } from 'src/core/services/open-dialog.service';
import { WikiService } from 'src/core/services/wiki.service';
import { WikiEditorConfig } from 'src/core/settings/angular-wiki-editor-setting';

@Component({
  selector: 'wiki-page',
  templateUrl: './wiki-page.component.html',
  styleUrls: ['./wiki-page.component.sass']
})
export class WikiPageComponent implements OnInit, OnDestroy {

  public faPenToSquare: IconDefinition = faPenToSquare;

  public wikiPage: WikiPage;
  
  private validationConstants = ValidationConstants;
  public editorConfig = WikiEditorConfig;
  public pageName = '';
  public pageText?: string;
  public pageTitle: string;
  public orEdit = true;

  private unsubscribe$ = new Subject<void>();

  public pageForm: FormGroup = new FormGroup({});
  public pageNameControl: FormControl;
  public pageTextControl: FormControl;

  constructor(
    private currentWikiService: GetCurrentWikiService,
    private wikiService: WikiService,
    private activeRoute: ActivatedRoute,
    private openDialogService: OpenDialogService,
    private router: Router
  ) {
    this.pageNameControl = new FormControl(this.pageName, [
      Validators.required,
      Validators.pattern(/^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/),
      Validators.minLength(this.validationConstants.minLengthName),
      Validators.maxLength(this.validationConstants.maxLengthName),
    ]);
    this.pageTextControl = new FormControl(this.pageText, []);
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((routeParams) => {
      this.wikiService.getWikiPage(routeParams.pageId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        if(data.body) {
          this.wikiPage = data.body;

          this.pageName = this.wikiPage.name;
          this.pageText = this.wikiPage.text;
          this.pageTitle = this.wikiPage.title;
        }
      });
    });

    this.pageForm = new FormGroup({
      pageNameControl: this.pageNameControl,
      pageTextControl: this.pageTextControl
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  edit(): void {
    this.orEdit = false;
  }

  emptyText(): boolean {
    return this.orEdit && (this.pageText?.length == 0 || !this.pageText)
  }

  cancel(): void {
    this.orEdit = true;
    this.pageName = this.wikiPage.name;
    this.pageText = this.wikiPage.text;
  }

  save(): void {
    if(this.pageForm.valid) {
      this.wikiService.updateWikiPage({ 
        name: this.pageForm.controls['pageNameControl'].value,
        text: this.pageForm.controls['pageTextControl'].value,
      }, this.wikiPage.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        if(data.body) {
          this.wikiPage = data.body;
          this.pageName = this.wikiPage.name;
          this.pageText = this.wikiPage.text;
          this.orEdit = true;

          this.currentWikiService.setWiki(data.body);
        }
      });
    }
  }

  remove(): void {
    this.openDialogService.openConfirmRemoveDialog({ 
      message: 'When you delete a page that has nested pages, they will also be deleted', 
      title: 'Are you sure?',
      type: 'deletion'
    })
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data) => {
      if(data === true) {
        this.wikiService.deleteWikiPage(this.wikiPage.id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          const id = this.activeRoute.parent?.snapshot.paramMap.get('id');
          this.currentWikiService.setWikiDel(this.wikiPage.id);
          this.router.navigate(['project/' + id + '/wiki']);
        });
      }
    });
  }

}
