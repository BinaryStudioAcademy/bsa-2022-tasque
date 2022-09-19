import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { LocalStorageKeys } from '../models/local-storage-keys';
import { OrganizationModel } from '../models/organization/organization-model';

@Injectable({ providedIn: 'root' })
export class GetCurrentOrganizationService {
  constructor() {}

  private currentOrganizationIdSubj = new BehaviorSubject<number>(
    this.currentOrganizationId,
  );
  public currentOrganizationId$ = this.currentOrganizationIdSubj.asObservable();

  public set currentOrganizationId(value: number) {
    localStorage.setItem(
      LocalStorageKeys.selectedOrganization,
      value.toString(),
    );
    this.currentOrganizationIdSubj.next(value);
  }

  public get currentOrganizationId(): number {
    return +(
      localStorage.getItem(LocalStorageKeys.selectedOrganization) ?? '-1'
    );
  }

  public clearCurrentOrganizationId(): void {
    this.currentOrganizationIdSubj.next(-1);
    this.currentOrganizationIdSubj.complete();
    this.currentOrganizationIdSubj = new BehaviorSubject<number>(
      this.currentOrganizationId,
    );
    this.currentOrganizationId$ = this.currentOrganizationIdSubj.asObservable();
  }

  private organizationUpdatedSubj = new Subject<OrganizationModel>();
  public organizationUpdated$ = this.organizationUpdatedSubj.asObservable();

  public updateOrganization(organization: OrganizationModel): void {
    this.organizationUpdatedSubj.next(organization);
  }

  private organizationsSubj = new ReplaySubject<OrganizationModel[]>(1);
  public organizations$ = this.organizationsSubj.asObservable();

  public setOrganizations(organizations: OrganizationModel[]): void {
    this.organizationsSubj.next(organizations);
  }
}
