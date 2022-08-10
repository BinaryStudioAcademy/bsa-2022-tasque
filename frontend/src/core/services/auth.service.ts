import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccessToken } from 'src/entity-models/access-token';
import { UserLoginModel } from 'src/entity-models/user-login-model';
import { UserRegisterModel } from 'src/entity-models/user-register-model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public routePrefix = '/api/user';

  constructor(
    private httpService: HttpService
  ) { }

  loginUser(credentials: UserLoginModel):Observable<HttpResponse<AccessToken>> {
    return this.httpService.postFullRequest(this.routePrefix + '/login', credentials);
  }

  registerUser(credentials: UserRegisterModel):Observable<HttpResponse<AccessToken>> {
    return this.httpService.postFullRequest(this.routePrefix + '/register', credentials);
  }
}
