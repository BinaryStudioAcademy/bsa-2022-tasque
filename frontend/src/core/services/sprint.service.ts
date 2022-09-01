import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class SprintService {

  public routePrefix = '/api/sprint';

  constructor(public httpService: HttpService) {}

  completeSprint(sprintId: number): Observable<void> {
    console.log(this.routePrefix + `/complete/${sprintId}`);
    return this.httpService.putRequest<void>(this.routePrefix + `/complete/${sprintId}`, new Object);
  }
}
