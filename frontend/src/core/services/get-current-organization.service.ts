import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserService } from 'src/app/user/services/user.service';
import { LocalStorageKeys } from '../models/local-storage-keys';
import { OrganizationModel } from '../models/organization/organization-model';
import { GetCurrentUserService } from './get-current-user.service';

@Injectable({ providedIn: 'root' })
export class GetCurrentOrganizationService {
  constructor(
    private userService: UserService,
    private currentUserService: GetCurrentUserService,
  ) {
    const sessionId = sessionStorage.getItem(LocalStorageKeys.selectedOrganization);
    if (sessionId) return;

    const userId = this.currentUserService.getUserId();
    this.userService
      .getLastOrg(userId)
      .pipe(
        take(1),
        map((x) => x.body),
      )
      .subscribe((x) => (this.currentOrganizationId = x as number));
  }

  private currentOrganizationIdSubj = new BehaviorSubject<number>(
    this.currentOrganizationId,
  );
  public currentOrganizationId$ = this.currentOrganizationIdSubj.asObservable();

  public set currentOrganizationId(value: number) {
    sessionStorage.setItem(
      LocalStorageKeys.selectedOrganization,
      value.toString(),
    );
    const userId = this.currentUserService.getUserId();
    this.userService.setLastOrg(userId, value).pipe(take(1)).subscribe();
    this.currentOrganizationIdSubj.next(value);
  }

  public get currentOrganizationId(): number {
    return +(
      sessionStorage.getItem(LocalStorageKeys.selectedOrganization) ?? '-1'
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
