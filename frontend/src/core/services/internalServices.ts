import { Injectable } from '@angular/core';
import { GetCurrentOrganizationService } from './get-current-organization.service';
import { GetCurrentProjectService } from './get-current-project.service';

@Injectable({ providedIn: 'root' })
export class InternalServices {

    public getCurrentProjectService: GetCurrentProjectService;
    public getCurrentOrganizationService: GetCurrentOrganizationService;

    constructor(
        private project: GetCurrentProjectService, 
        private organization: GetCurrentOrganizationService
    ) {
        this.ngOnInit();
     }

    ngOnInit(): void {
        this.getCurrentProjectService = this.project;
        this.getCurrentOrganizationService = this.organization;
    }
}
