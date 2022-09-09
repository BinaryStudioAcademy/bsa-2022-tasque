import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CreateOrganizationDialogComponent } from 'src/shared/components/create-organization-dialog/create-organization-dialog.component';
import { CreateProjectDialogComponent } from 'src/shared/components/create-project-dialog/create-project-dialog.component';
import { OrganizationModel } from '../models/organization/organization-model';
import { ProjectInfoModel } from '../models/project/project-info-model';
import { UserModel } from '../models/user/user-model';

@Injectable({ providedIn: 'root' })
export class OpenDialogService {
    constructor(private matDialog: MatDialog) { }

    public openCreateOrganizationDialog(currentUser: UserModel): Observable<OrganizationModel> {
        const dialog = this.matDialog.open(CreateOrganizationDialogComponent, {
            data: currentUser,
        });

        return dialog.afterClosed();
    }

    public openCreateProjectDialog(currentOrganizationId: number): Observable<ProjectInfoModel> {
        const dialog = this.matDialog.open(CreateProjectDialogComponent, {
            data: currentOrganizationId,
        });

        return dialog.afterClosed();
    }
}
