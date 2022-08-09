import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrganizationModel } from 'src/entity-models/organization-model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  public routePrefix = '/api/organization';

  constructor(
    public httpService: HttpService
  ) { }

  createOrganization(organization:OrganizationModel):Observable<HttpResponse<OrganizationModel>>{
    return this.httpService.postFullRequest<OrganizationModel>(this.routePrefix + '/createOrganization', organization);
  }
}
