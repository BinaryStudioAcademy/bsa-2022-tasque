import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DeleteSprintDialogComponent } from 'src/app/components/delete-sprint-dialog/delete-sprint-dialog.component';
import { CreateOrganizationDialogComponent } from 'src/shared/components/create-organization-dialog/create-organization-dialog.component';
import { CreateProjectDialogComponent } from 'src/shared/components/create-project-dialog/create-project-dialog.component';
import { OrganizationModel } from '../models/organization/organization-model';
import { ProjectInfoModel } from '../models/project/project-info-model';
import { SprintModel } from '../models/sprint/sprint-model';
import { UserModel } from '../models/user/user-model';
import { ConfirmationData, ConfirmationModalComponent } from 'src/shared/components/tasque-confirmation-modal/confirmation-modal.component'; 

@Injectable({ providedIn: 'root' })
export class OpenDialogService {
  constructor(private matDialog: MatDialog) {}

  public openCreateOrganizationDialog(
    currentUser: UserModel,
  ): Observable<OrganizationModel> {
    const dialog = this.matDialog.open(CreateOrganizationDialogComponent, {
      data: currentUser,
    });

    return dialog.afterClosed();
  }

  public openCreateProjectDialog(
    currentOrganizationId: number,
  ): Observable<ProjectInfoModel> {
    const dialog = this.matDialog.open(CreateProjectDialogComponent, {
      data: currentOrganizationId,
    });

    return dialog.afterClosed();
  }

  public openConfirmRemoveDialog(data: ConfirmationData): Observable<boolean> {
    const dialog = this.matDialog.open(ConfirmationModalComponent, {
      data: data
    });

    return dialog.afterClosed();
  }

  openDeleteSprintDialog(sprint: SprintModel): void {
    const dialog = this.matDialog.open(DeleteSprintDialogComponent, {
      data: sprint,
    });

    dialog.afterClosed();
  }
}
