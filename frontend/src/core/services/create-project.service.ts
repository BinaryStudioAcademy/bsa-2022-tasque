import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CreateProjectDialogComponent } from 'src/shared/components/create-project-dialog/create-project-dialog.component';
import { OrganizationModel } from '../models/organization/organization-model';

@Injectable({ providedIn: 'root' })
export class CreateProjectService {
    constructor(private matDialog: MatDialog) { }

    public openDialog(currentOrganizationId: number): Observable<OrganizationModel> {
        const dialog = this.matDialog.open(CreateProjectDialogComponent, {
            data: currentOrganizationId,
        });

        return dialog.afterClosed();
    }
}
