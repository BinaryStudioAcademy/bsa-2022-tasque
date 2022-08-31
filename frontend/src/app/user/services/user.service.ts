import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from 'src/core/models/user/user-model';
import { HttpService } from 'src/core/services/http.service';
import { PasswordChangesDTO } from '../dto/password-changes-dto';
import { ProfileChangesDTO } from '../dto/profile-changes-dto';

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
    user: ProfileChangesDTO,
  ): Observable<HttpResponse<ProfileChangesDTO>> {
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

  editAvatar(imageData: string): Observable<HttpResponse<ProfileChangesDTO>> {
    return this.httpService.putFullRequest(this.routePrefix + '/edit/avatar', {
      imageData,
    });
  }

  getUserById(userId: number): Observable<HttpResponse<UserModel>> {
    return this.httpService.getFullRequest(
      this.routePrefix + `/getUserById/${userId}`,
    );
  }
}
