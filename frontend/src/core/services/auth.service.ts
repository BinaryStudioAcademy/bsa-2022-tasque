import { HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccessToken } from '../models/access-token';
import { UserLoginModel } from 'src/core/models/user/user-login-model';
import { HttpService } from './http.service';
import { LocalStorageKeys } from '../models/local-storage-keys';
import { Router } from '@angular/router';
import { GetCurrentOrganizationService } from './get-current-organization.service';
import { UserRegisterModel } from '../models/user/user-register-model';
import { UserResetPasswordModel } from '../models/user/user-reset-password-model';
import { GetCurrentUserService } from './get-current-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public routePrefix = '/api/user';

  constructor(
    private httpService: HttpService,
    private router: Router,
    private getCurrentOrganizationService: GetCurrentOrganizationService,
    private getCurrentUserService: GetCurrentUserService
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

  checkInvitationLink(ref: string): Observable<HttpResponse<{ email: string }>> {
    return this.httpService.putFullRequest('/api/organization/invite/confirm/' + ref);
  }

  setAuthToken(token: AccessToken): void {
    localStorage.setItem(LocalStorageKeys.token, token.accessToken);
  }

  setConnectionId(connection: string): Observable<HttpResponse<void>> {
    return this.httpService.putFullRequest(this.routePrefix + `/connection/${connection}`);
  }

  logout(): void {
    localStorage.clear();
    this.getCurrentUserService.clearCurrentUser();
    this.getCurrentOrganizationService.clearCurrentOrganizationId();
    this.router.navigate(['/auth/login'], { replaceUrl: true, });
  }

  areTokensExist(): boolean {
    return localStorage.getItem('token') !== null;
  }
}
