import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from 'src/core/models/user/user-model';
import { HttpService } from 'src/core/services/http.service';
import { PasswordChangesDTO } from '../dto/password-changes-dto';
import { ProfileChangesModel } from '../dto/profile-changes-dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public routePrefix = '/api/user';
  constructor(private httpService: HttpService) {}

  getCurrentUser(): Observable<HttpResponse<UserModel>> {
    return this.httpService.getFullRequest(this.routePrefix + '/current');
  }

  editUserProfile(
    user: ProfileChangesModel,
  ): Observable<HttpResponse<ProfileChangesModel>> {
    return this.httpService.putFullRequest(this.routePrefix + '/edit', user);
  }

  editPassword(
    password: PasswordChangesDTO,
  ): Observable<HttpResponse<PasswordChangesDTO>> {
    return this.httpService.putFullRequest(
      this.routePrefix + '/password',
      password,
    );
  }

  editAvatar(imageData: string): Observable<HttpResponse<ProfileChangesModel>> {
    return this.httpService.putFullRequest(this.routePrefix + '/edit/avatar', {
      imageData,
    });
  }

  getUserById(userId: number): Observable<HttpResponse<UserModel>> {
    return this.httpService.getFullRequest(
      this.routePrefix + `/getUserById/${userId}`,
    );
  }

  getUserByEmail(email: string): Observable<HttpResponse<UserModel>> {
    return this.httpService.getFullRequest(
      this.routePrefix + `/getUserByEmail/${email}`,
    );
  }

  setLastOrg(userId: number, orgId: number): Observable<HttpResponse<void>> {
    return this.httpService.postFullRequest(
      this.routePrefix + `/lastOrganization?userId=${userId}&orgId=${orgId}`,
      {},
    );
  }

  getLastOrg(userId: number): Observable<HttpResponse<number>> {
    return this.httpService.getFullRequest(
      this.routePrefix + `/lastOrganization?userId=${userId}`,
    );
  }
}
