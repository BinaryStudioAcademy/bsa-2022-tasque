import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccessToken } from 'src/entity-models/access-token';
import { UserLoginModel } from 'src/entity-models/user-login-model';
import { UserRegisterModel } from 'src/entity-models/user-register-model';
import { UserResetPasswordModel } from 'src/entity-models/user-reset-password-model';
import { HttpService } from './http.service';
import { LocalStorageKeys } from 'src/entity-models/local-storage-keys';

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

  registerUser(credentials: UserRegisterModel):Observable<HttpResponse<string>> {
    return this.httpService.postFullRequest(this.routePrefix + '/register', credentials);
  }

  requestPasswordReset(email: string): Observable<HttpResponse<string>> {
    return this.httpService.postFullRequest(this.routePrefix + `/restore/request?email=${email}`, {});
  }

  confirmResetKey(key: string): Observable<HttpResponse<string>> {
    return this.httpService.getFullRequest(this.routePrefix + `/restore?token=${key}`);
  }

  resetPassword(credentials: UserResetPasswordModel): Observable<HttpResponse<AccessToken>> {
    return this.httpService.postFullRequest(this.routePrefix + '/restore', credentials);
  }

  setAuthToken(token: AccessToken): void {
    localStorage.setItem(LocalStorageKeys.token, token.accessToken);
  }
}
