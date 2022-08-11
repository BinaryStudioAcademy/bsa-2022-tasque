import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StorageService {
    constructor() { }

    public currentOrganizationId$ = new BehaviorSubject<number>(this.currentOrganizationId);

    public set currentOrganizationId(value: number) {
        this.currentOrganizationId$.next(value);
        localStorage.setItem('selectedOrganization', value.toString());
    }

    public get currentOrganizationId(): number {
        return +(localStorage.getItem('selectedOrganization') ?? '-1');
    }
}
