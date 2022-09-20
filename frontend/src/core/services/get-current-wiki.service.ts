import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WikiPageInfo } from '../models/wiki/wiki-page-info';

@Injectable({
  providedIn: 'root'
})
export class GetCurrentWikiService {

  constructor() { }

  private wikiSubj = new Subject<WikiPageInfo>();
  public wiki$ = this.wikiSubj.asObservable();

  public setWiki(wikiPage: WikiPageInfo): void {
    this.wikiSubj.next(wikiPage);
  }

}
