import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class SprintService {
  constructor(public httpService: HttpService) {}
}
