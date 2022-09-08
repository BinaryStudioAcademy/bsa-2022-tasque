import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectBoardService {

  public routePrefix = '/api/project';

  constructor(public httpService: HttpService) { }

}
