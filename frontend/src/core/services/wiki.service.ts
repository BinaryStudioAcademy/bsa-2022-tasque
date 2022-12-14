import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WikiPage } from '../models/wiki/wiki-page';
import { WikiPageCreate } from '../models/wiki/wiki-page-create';
import { WikiPageInfo } from '../models/wiki/wiki-page-info';
import { WikiPageUpdate } from '../models/wiki/wiki-page-update';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root'
})
export class WikiService {
  public routePrefix = '/api/wiki';

  constructor(public httpService: HttpService) { }

  getProjectWiki(projectId: number): Observable<HttpResponse<WikiPageInfo[]>> {
    return this.httpService.getFullRequest<WikiPageInfo[]>(this.routePrefix + `/getProjectWiki/${projectId}`);
  }

  createWikiPage(createModel: WikiPageCreate): Observable<HttpResponse<WikiPageInfo>> {
    return this.httpService.postFullRequest<WikiPageInfo>(this.routePrefix + '/create', createModel);
  }

  updateWikiPage(updateModel: WikiPageUpdate, wikiPageId: number): Observable<HttpResponse<WikiPage>> {
    return this.httpService.putFullRequest<WikiPage>(this.routePrefix + `/update/page/${wikiPageId}`, updateModel);
  }

  getWikiPage(wikiPageId: number): Observable<HttpResponse<WikiPage>> {
    return this.httpService.getFullRequest<WikiPage>(this.routePrefix + `/page/${wikiPageId}`);
  }

  deleteWikiPage(wikiPageId: number): Observable<HttpResponse<boolean>> {
    return this.httpService.deleteRequest(this.routePrefix + `/delete/${wikiPageId}`);
  }
}
