import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { OrganizationModel } from '../models/organization/organization-model';

@Injectable({ providedIn: 'root' })
export class GetCurrentOrganizationService {
    constructor() { }

    public currentOrganizationId$ = new BehaviorSubject<number>(this.currentOrganizationId);

    public set currentOrganizationId(value: number) {
        this.currentOrganizationId$.next(value);
        localStorage.setItem('selectedOrganization', value.toString());
    }

    public get currentOrganizationId(): number {
        return +(localStorage.getItem('selectedOrganization') ?? '-1');
    }

    public organizationsUpdated$ = new Subject<OrganizationModel>();

    public updateOrganizations(organization: OrganizationModel): void {
        this.organizationsUpdated$.next(organization);
    }
}
