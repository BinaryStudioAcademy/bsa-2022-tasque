import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/core/services/http.service';
import { ProfileChangesDTO } from '../dto/profile-changes-dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public routePrefix = '/api/user';
  constructor(
    private httpService: HttpService
  ) { }

  getCurrentUser(): Observable<HttpResponse<ProfileChangesDTO>> {
    return this.httpService.getFullRequest(this.routePrefix + '/current');
  }

  editUserProfile(user: ProfileChangesDTO): Observable<HttpResponse<ProfileChangesDTO>> {
    return this.httpService.putFullRequest(this.routePrefix + '/edit', user);
  }
}
