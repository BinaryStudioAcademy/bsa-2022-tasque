import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EditSprintModel } from '../models/sprint/edit-sprint-model';
import { SprintModel } from '../models/sprint/sprint-model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class SprintService {

  public routePrefix = '/api/sprint';

  constructor(
    public httpService: HttpService
  ) { }

  editSprint(editedSprint: EditSprintModel):Observable<HttpResponse<SprintModel>>{
    return this.httpService.putFullRequest<SprintModel>(this.routePrefix + '/edit', editedSprint);
  }

}
