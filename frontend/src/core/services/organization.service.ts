import { HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrganizationModel } from '../models/organization/organization-model';
import { NewOrganizationModel } from '../models/organization/new-organization-model';
import { HttpService } from './http.service';
import { ProfileChangesDTO } from 'src/app/user/dto/profile-changes-dto';
import { IUserCard } from 'src/shared/components/select-users/Models';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  public routePrefix = '/api/organization';

  constructor(public httpService: HttpService) {}

  createOrganization(
    organization: NewOrganizationModel,
  ): Observable<HttpResponse<OrganizationModel>> {
    return this.httpService.postFullRequest<OrganizationModel>(
      this.routePrefix + '/create',
      organization,
    );
  }

  getOrganizations(): Observable<HttpResponse<OrganizationModel[]>> {
    return this.httpService.getFullRequest<OrganizationModel[]>(
      this.routePrefix + '/getAll',
    );
  }

  getOrganization(id: number): Observable<HttpResponse<OrganizationModel>> {
    return this.httpService.getFullRequest<OrganizationModel>(
      this.routePrefix + `/getById/${id}`,
    );
  }

  getUserOrganizations(
    userId: number,
  ): Observable<HttpResponse<OrganizationModel[]>> {
    return this.httpService.getFullRequest<OrganizationModel[]>(
      this.routePrefix + `/getUserOrganizationsById/${userId}`,
    );
  }

  getOrganizationUsers(
    organizationId: number,
  ): Observable<HttpResponse<ProfileChangesDTO[]>> {
    return this.httpService.getFullRequest<ProfileChangesDTO[]>(
      this.routePrefix + `/getOrganizationUsers/${organizationId}`,
    );
  }

  editOrganization(
    organization: OrganizationModel,
  ): Observable<HttpResponse<OrganizationModel[]>> {
    return this.httpService.putFullRequest<OrganizationModel[]>(
      this.routePrefix,
      organization,
    );
  }

  addUser(
    organizationId: number,
    user: ProfileChangesDTO,
  ): Observable<HttpResponse<ProfileChangesDTO>> {
    return this.httpService.postRequest(
      this.routePrefix + `/${organizationId}/users/add`,
      user,
    );
  }

  delUser(
    organizationId: number,
    user: ProfileChangesDTO,
  ): Observable<HttpResponse<OrganizationModel[]>> {
    return this.httpService.postFullRequest<OrganizationModel[]>(
      this.routePrefix + `/users/del/${organizationId}`,
      user,
    );
  }
}
