import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WikiPageCreate } from '../models/wiki/wiki-page-create';
import { WikiPageInfo } from '../models/wiki/wiki-page-info';
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
}
