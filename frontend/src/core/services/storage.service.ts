import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StorageService {
    constructor() { }

    private currentOrganization$ = new BehaviorSubject<string>(this.currentOrganization);

    public set currentOrganization(value: string) {
        this.currentOrganization$.next(value);
        localStorage.setItem('selectedOrganization', value);
    }

    public get currentOrganization(): string {
        return localStorage.getItem('selectedOrganization') ?? 'None';
    }
}
