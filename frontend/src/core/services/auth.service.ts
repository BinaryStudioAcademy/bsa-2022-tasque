import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public routePrefix = '/api/user';

  constructor(
    private httpService: HttpService
  ) { }

  loginUser(email: string, password: string):Observable<HttpResponse<{ assessToken: string }>> {
    return this.httpService.postFullRequest(this.routePrefix + '/login', { email: email, password: password });
  }

  registerUser(email: string, password: string, name: string):Observable<HttpResponse<{ assessToken: string }>> {
    return this.httpService.postFullRequest(this.routePrefix + '/register', { email: email, password: password, name: name });
  }
}
