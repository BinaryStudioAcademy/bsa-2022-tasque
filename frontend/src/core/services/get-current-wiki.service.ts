import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { WikiPageInfo } from '../models/wiki/wiki-page-info';

@Injectable({
  providedIn: 'root'
})
export class GetCurrentWikiService {

  constructor() { }

  private wikiSubj = new ReplaySubject<WikiPageInfo>(1);
  public wiki$ = this.wikiSubj.asObservable();

  public setWiki(wikiPage: WikiPageInfo): void {
    this.wikiSubj.next(wikiPage);
  }

}
