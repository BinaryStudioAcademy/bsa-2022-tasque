import { HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccessToken } from 'src/entity-models/access-token';
import { UserLoginModel } from 'src/core/models/user/user-login-model';
import { HttpService } from './http.service';
import { LocalStorageKeys } from 'src/entity-models/local-storage-keys';
import { Router } from '@angular/router';
import { GetCurrentOrganizationService } from './get-current-organization.service';
import { UserRegisterModel } from '../models/user/user-register-model';
import { UserResetPasswordModel } from '../models/user/user-reset-password-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public routePrefix = '/api/user';

  constructor(
    private httpService: HttpService,
    private router: Router,
    private getCurrentOrganizationService: GetCurrentOrganizationService
  ) { }

  loginUser(credentials: UserLoginModel): Observable<HttpResponse<AccessToken>> {
    return this.httpService.postFullRequest(this.routePrefix + '/login', credentials);
  }

  registerUser(credentials: UserRegisterModel): Observable<HttpResponse<AccessToken>> {
    return this.httpService.postFullRequest(this.routePrefix + '/register', credentials);
  }

  confirmEmail(token: string): Observable<HttpResponse<AccessToken>> {
    return this.httpService.getFullRequest(this.routePrefix + '/confirm', new HttpParams().set('key', token));
  }

  resendEmailConfirmation(email: string): Observable<HttpResponse<string>> {
    return this.httpService.postFullRequest(this.routePrefix + '/confirm', { email: email });
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

  checkRefLink(ref: string): Observable<HttpResponse<{ email: string }>> {
    return this.httpService.getFullRequest(this.routePrefix + `/ref?key=${ref}`);
  }

  setAuthToken(token: AccessToken): void {
    localStorage.setItem(LocalStorageKeys.token, token.accessToken);
  }

  logout(): void {
    localStorage.clear();
    this.getCurrentOrganizationService.currentOrganizationId = -1;
    this.router.navigate(['/auth/login'], {
      replaceUrl: true,
    });
  }

  areTokensExist(): boolean {
    return localStorage.getItem('token') !== null;
  }
}
