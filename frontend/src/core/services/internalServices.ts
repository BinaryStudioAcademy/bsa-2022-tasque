import { Injectable } from "@angular/core";
import { GetCurrentOrganizationService } from "./get-current-organization.service";
import { GetCurrentProjectService } from "./get-current-project.service";

@Injectable({ providedIn: 'root' })
export class InternalServices {

    constructor(
        public getCurrentProjectService: GetCurrentProjectService,
        public getCurrentOrganizationService: GetCurrentOrganizationService
        ) { }
}
