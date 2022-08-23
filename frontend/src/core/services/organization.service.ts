import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrganizationModel } from '../models/organization/organization-model';
import { NewOrganizationModel } from '../models/organization/new-organization-model';
import { HttpService } from './http.service';

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
    console.log(userId);
    return this.httpService.getFullRequest<OrganizationModel[]>(
      this.routePrefix + `/getUserOrganizationsById/${userId}`,
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
}
