import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CreateOrganizationDialogComponent } from 'src/shared/components/create-organization-dialog/create-organization-dialog.component';
import { OrganizationModel } from '../models/organization/organization-model';
import { UserModel } from '../models/user/user-model';

@Injectable({ providedIn: 'root' })
export class CreateOrganizationService {
    constructor(private matDialog: MatDialog) { }

    public openDialog(currentUser: UserModel): Observable<OrganizationModel> {
        const dialog = this.matDialog.open(CreateOrganizationDialogComponent, {
            data: currentUser,
        });

        return dialog.afterClosed();
    }
}
