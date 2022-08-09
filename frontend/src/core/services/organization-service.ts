import { Injectable } from '@angular/core';
import { OrganizationModel } from 'src/entity-models/organization-model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  public routePrefix:string = "/api/organization";

  constructor(
    public httpService: HttpService
  ) { }

  createOrganization(organization:OrganizationModel){
    return this.httpService.postFullRequest(this.routePrefix + "/createOrganization", organization);
  }
}
