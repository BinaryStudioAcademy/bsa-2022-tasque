import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { LocalStorageKeys } from '../models/local-storage-keys';
import { OrganizationModel } from '../models/organization/organization-model';

@Injectable({ providedIn: 'root' })
export class GetCurrentOrganizationService {
    constructor() { }

    public currentOrganizationId$ = new BehaviorSubject<number>(this.currentOrganizationId);

    public set currentOrganizationId(value: number) {
        this.currentOrganizationId$.next(value);
        localStorage.setItem(LocalStorageKeys.selectedOrganization, value.toString());
    }

    public get currentOrganizationId(): number {
        return +(localStorage.getItem(LocalStorageKeys.selectedOrganization) ?? '-1');
    }

    public organizationsUpdated$ = new Subject<OrganizationModel>();

    public updateOrganizations(organization: OrganizationModel): void {
        this.organizationsUpdated$.next(organization);
    }
}
