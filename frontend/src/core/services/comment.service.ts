import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentInfo } from '../models/comment/comment-info';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  public routePrefix = '/api/comment';
  
  constructor(
    public httpService: HttpService
  ) { }

  getCommentsByTaskId(id: number): Observable<HttpResponse<CommentInfo[]>> {
    return this.httpService.getFullRequest<CommentInfo[]>(this.routePrefix + '/getCommentsByTaskId/' + id);
  }
}
