import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpNotificationsService extends HttpService {

  public baseUrl: string = environment.notificationsUrl;

  constructor(private client: HttpClient) {
    super(client);
  }
}
