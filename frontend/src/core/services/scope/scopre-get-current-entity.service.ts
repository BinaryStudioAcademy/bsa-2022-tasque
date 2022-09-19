import { Injectable } from '@angular/core';
import { GetCurrentOrganizationService } from '../get-current-organization.service';
import { GetCurrentProjectService } from '../get-current-project.service';
import { GetCurrentUserService } from '../get-current-user.service';

@Injectable({
    providedIn: 'root'
})
export class ScopeGetCurrentEntityService {
    
    constructor(
        public getCurrentUserService: GetCurrentUserService,
        public getCurrentOrganizationService: GetCurrentOrganizationService,
        public getCurrentProjectService: GetCurrentProjectService
    ) { }
}
